# Balatro 1.0.1o —— Lua 调用侧的 shader 机制与卡牌 3D 倾斜实现

> 证据来源：`E:\block-rougelike\参考\产物\Balatro_1.0.1o\源码\`（只读，未做任何修改）与同级 `..\资源\shaders\`。
> **重要前提**：本产物是**移动版**构建，不是 Steam 桌面版。`源码\info.txt` 写明 `name: Singular-v12.11.0-03ae108.master / env: release / build_date: Mon, 26 Jan 2026`，`源码\version.jkr` 写明 `1.0.1o-FULL [M]` / `PROD_mobile`。下文标注的若干处（尤其 B 节的 `touch_collide_tilt`、C 节的 `AA_CANVAS`）与桌面版行为**可能不同**，已逐条注明。

---

## A1. shader 在哪里加载？加载成什么数据结构？

### Takeaway
所有 shader 在 `Game:init()` 里一次性扫描 `resources/shaders/` 目录批量加载，存进一个以**文件名（去掉 `.fs`）为键**的扁平表 `G.SHADERS[name]`，值是 LÖVE 的 `Shader` 对象。没有任何分类、分组或按需加载。

### Cited Findings
- 加载代码 —— `源码\game.lua:130-139`：
  ```lua
      --Load all shaders from resources
      self.SHADERS = {}
      local shader_files = love.filesystem.getDirectoryItems("resources/shaders")
      for k, filename in ipairs(shader_files) do
          local extension = string.sub(filename, -3)
          if extension == '.fs' then
              local shader_name = string.sub(filename, 1, -4)
              self.SHADERS[shader_name] = love.graphics.newShader("resources/shaders/"..filename)
          end
      end
  ```
- 全仓唯一一处 `love.graphics.newShader` 调用就是 `源码\game.lua:137`（全仓 grep `newShader` 只此一条）。
- 目录内共 **19 个 `.fs`** 文件（`参考\产物\Balatro_1.0.1o\资源\shaders\`）：`CRT.fs, background.fs, booster.fs, debuff.fs, dissolve.fs, flame.fs, flash.fs, foil.fs, gold_seal.fs, holo.fs, hologram.fs, negative.fs, negative_shine.fs, played.fs, polychrome.fs, skew.fs, splash.fs, vortex.fs, voucher.fs`。
- 加载耗时被计入启动进度条：`源码\game.lua:141` `boot_timer('shaders', 'controllers', 0.7)`。

### Inferences
- `G.SHADERS` 是**全局单例池**，每个 shader 程序全进程只有一份；不存在 per-card 的 shader 实例。这对移植是好消息：Phaser 里同样只需要 19 个 pipeline/shader 程序。
- 文件名即 shader 名这一约定被 A4 里的 `send(_shader, _send)` 复用（见 A4），所以**文件名不能随便改**。

### Gaps
- 无 `.vs` 文件；顶点着色器代码内嵌在各 `.fs` 的 `#ifdef VERTEX` 段里（见 B 节）。

---

## A2. 绘制时怎么切换 shader？

### Takeaway
唯一的 per-sprite shader 切换入口是 `Sprite:draw_shader()`（`源码\engine\sprite.lua:73-125`）。它的结构固定是：**送一批 uniform → `setShader(该 shader)` → 画一次 → `setShader()` 复位**。

### Cited Findings
- `源码\engine\sprite.lua:110-118`：
  ```lua
      love.graphics.setShader( G.SHADERS[_shader or 'dissolve'],  G.SHADERS[_shader or 'dissolve'])

      if other_obj then
          self:draw_from(other_obj, ms, mr, mx, my)
      else
          self:draw_self()
      end

      love.graphics.setShader()
  ```
- 全仓 `setShader` 出现处仅 8 个（`源码\card.lua:4421`、`engine\sprite.lua:110/118/160`、`functions\misc_functions.lua:116`、`game.lua:3088/3305/3313`），其中真正做 per-object 切换的只有 `sprite.lua:110/118`。
- `Sprite:draw()`（`engine\sprite.lua:163-179`）对配置了 `draw_steps` 的精灵（背景、Blind 动画、Tag）会**对每个 step 各调一次 `draw_shader`**：
  ```lua
      if self.draw_steps then
          for k, v in ipairs(self.draw_steps) do
              self:draw_shader(v.shader, v.shadow_height, v.send, v.no_tilt, v.other_obj, v.ms, v.mr, v.mx, v.my, not not v.send)
          end
      end
  ```

### Inferences
- `setShader(a, a)` 传了两个相同参数。LÖVE 11 的 `love.graphics.setShader` 只接受一个参数，多余的会被忽略——看起来是移动版改造时留下的无害冗余（或为某个自定义引擎分支预留 pixel/vertex 双槽）。对移植没有语义影响。
- 由于每次 `draw_shader` 末尾都强制 `setShader()` 复位，**一次 `draw_shader` 调用 = 2 次 shader 状态切换**。

---

## A3. 判定性问题：每张卡是不是独立 draw call？

### Takeaway
**是。确凿无疑：零 batching。** 每一次 `draw_shader` 都是「对该 sprite 单独 `send` 一整批 uniform → `setShader` → 立即 `love.graphics.draw` 一次 → `setShader()` 复位」。而且**一张卡往往不止一次 draw call**——阴影、底图、正面图、edition、seal、贴纸各是独立的一次。

### Cited Findings
- 完整的「送 uniform → 设 shader → 画」链路，`源码\engine\sprite.lua:91-118`：
  ```lua
      else
          self.ARGS.prep_shader = self.ARGS.prep_shader or {}
          self.ARGS.prep_shader.cursor_pos = self.ARGS.prep_shader.cursor_pos or {}
          self.ARGS.prep_shader.cursor_pos[1] = _draw_major.tilt_var and _draw_major.tilt_var.mx*G.CANV_SCALE or G.CONTROLLER.cursor_position.x*G.CANV_SCALE
          self.ARGS.prep_shader.cursor_pos[2] = _draw_major.tilt_var and _draw_major.tilt_var.my*G.CANV_SCALE or G.CONTROLLER.cursor_position.y*G.CANV_SCALE

          G.SHADERS[_shader or 'dissolve']:send('mouse_screen_pos', self.ARGS.prep_shader.cursor_pos)
          G.SHADERS[_shader or 'dissolve']:send('screen_scale', G.TILESCALE*G.TILESIZE*(_draw_major.mouse_damping or 1)*G.CANV_SCALE)
          G.SHADERS[_shader or 'dissolve']:send('hovering', ...)
          G.SHADERS[_shader or 'dissolve']:send("dissolve",math.abs(_draw_major.dissolve or 0))
          G.SHADERS[_shader or 'dissolve']:send("time",123.33412*(_draw_major.ID/1.14212 or 12.5123152)%3000)
          G.SHADERS[_shader or 'dissolve']:send("texture_details",self:get_pos_pixel())
          G.SHADERS[_shader or 'dissolve']:send("image_details",self:get_image_dims())
          G.SHADERS[_shader or 'dissolve']:send("burn_colour_1",...)
          G.SHADERS[_shader or 'dissolve']:send("burn_colour_2",...)
          G.SHADERS[_shader or 'dissolve']:send("shadow",(not not _shadow_height))
          if _send then G.SHADERS[_shader or 'dissolve']:send(_shader,_send) end
      end

      love.graphics.setShader( G.SHADERS[...],  G.SHADERS[...] )
      ... self:draw_self() ...
      love.graphics.setShader()
  ```
- `Sprite:draw_self()` 内部就是一次 `love.graphics.draw(atlas.image, quad, ...)`，`源码\engine\sprite.lua:148-156`：
  ```lua
          love.graphics.draw(
              self.atlas.image,
              self.sprite,
              0 ,0,
              0,
              self.VT.w/(self.T.w),
              self.VT.h/(self.T.h)
          )
  ```
- `Card:draw()` 里**一张卡会连着发多次**，`源码\card.lua:4369`（阴影）、`4424-4432`（底图 + 正面图）：
  ```lua
          G.shared_shadow:draw_shader('dissolve', self.shadow_height)          -- card.lua:4369
  ...
              elseif not self.greyed then
                  self.children.center:draw_shader('dissolve')                 -- card.lua:4425
                  if self.children.front and self.ability.effect ~= 'Stone Card' then
                      self.children.front:draw_shader('dissolve')              -- card.lua:4428
                  end
              end
  ```
- `card.lua` 全文共 **43 处 `draw_shader` 调用**（`grep -c draw_shader card.lua` = 43）。

### Inferences
- **一张普通扑克牌（有 front）最少 3 个 draw call**：阴影 1 + center 1 + front 1。
- **一张 foil 扑克牌 5 个**：上面 3 个 + `foil` 作用在 center 和 front 各 1 次（`card.lua:4467-4472`）。
- **一张带 Gold seal + eternal 贴纸的 foil 小丑**：阴影 1 + center 1 + foil 1 + seal dissolve 1 + seal voucher 1 + eternal dissolve 1 + eternal voucher 1 ≈ 7 个。
- 这是**加法式的多 pass 叠画**（每个 edition/贴纸是一次额外的全卡面 overdraw），不是把效果合成进一个 shader。移植 Phaser 时这点直接决定 draw call 量级。

### Gaps
- 没有任何显式 batching / SpriteBatch / Mesh 合批代码（全仓无 `newSpriteBatch`、`newMesh` 命中），所以「零合批」是代码结构上的必然，不是我的推测。

---

## A4. 每张卡送进去的 per-card uniform 有哪些？

### Takeaway
标准路径（`dissolve`/`foil`/`holo`/`polychrome`/`negative`/`voucher`/`debuff`/`played`/`booster`/`hologram`/`negative_shine`）**固定送 10 个 uniform**，另有一个「与 shader 同名」的第 11 个可选 uniform（`vec2`）。`vortex` 和 `custom_shader`（背景/Blind/Tag）走另外两条分支。

### Cited Findings —— 标准分支的 10 + 1 个 uniform（`源码\engine\sprite.lua:97-107`）

| # | uniform 名 | 类型 | 值来源 | 行号 |
|---|---|---|---|---|
| 1 | `mouse_screen_pos` | `vec2` | `_draw_major.tilt_var.mx/my * G.CANV_SCALE`，无 tilt_var 时退回 `G.CONTROLLER.cursor_position` | sprite.lua:94-97 |
| 2 | `screen_scale` | `float` | `G.TILESCALE*G.TILESIZE*(_draw_major.mouse_damping or 1)*G.CANV_SCALE` | sprite.lua:98 |
| 3 | `hovering` | `float` | `((_shadow_height and not tilt_shadow) or _no_tilt) and 0 or (((_draw_major.touch_collide_tilt and _draw_major.states.collide.is) and _draw_major.hover_tilt or 0) or 0)*(tilt_shadow or 1)` | sprite.lua:99 |
| 4 | `dissolve` | `float` | `math.abs(_draw_major.dissolve or 0)` | sprite.lua:100 |
| 5 | `time` | `float` | `123.33412*(_draw_major.ID/1.14212 or 12.5123152)%3000` —— **按卡 ID 做相位偏移**，不是全局时钟 | sprite.lua:101 |
| 6 | `texture_details` | `vec4` | `self:get_pos_pixel()` = `{sprite_pos.x, sprite_pos.y, atlas.px, atlas.py}`（图集格子坐标 + 格子像素尺寸） | sprite.lua:102；定义在 sprite.lua:43-50 |
| 7 | `image_details` | `vec2` | `self:get_image_dims()` = 整张图集的 `{w, h}` | sprite.lua:103；定义在 sprite.lua:39-40, 52-54 |
| 8 | `burn_colour_1` | `vec4` | `_draw_major.dissolve_colours[1]` 或 `G.C.CLEAR` | sprite.lua:104 |
| 9 | `burn_colour_2` | `vec4` | `_draw_major.dissolve_colours[2]` 或 `G.C.CLEAR` | sprite.lua:105 |
| 10 | `shadow` | `bool` | `(not not _shadow_height)` | sprite.lua:106 |
| 11 | **`<shader 自己的名字>`** | `vec2` | `_send`，即 `card.ARGS.send_to_shader` | sprite.lua:107 |

- 第 11 项的机制 —— `源码\engine\sprite.lua:107`：`if _send then G.SHADERS[_shader or 'dissolve']:send(_shader,_send) end`。即 uniform 名 == shader 文件名。逐一验证成立：
  - `资源\shaders\foil.fs:8` `extern MY_HIGHP_OR_MEDIUMP vec2 foil;`
  - `holo.fs:7` `vec2 holo;`、`polychrome.fs:7` `vec2 polychrome;`、`negative_shine.fs:7` `vec2 negative_shine;`、`voucher.fs:7` `vec2 voucher;`、`debuff.fs:8` `vec2 debuff;`、`played.fs:8` `vec2 played;`、`booster.fs:7` `vec2 booster;`、`hologram.fs:7` `vec2 hologram;`
  - `dissolve.fs` **没有**同名 uniform（它从不带 `_send`）。
- `ARGS.send_to_shader` 的两个分量在 `源码\card.lua:4356-4358`：
  ```lua
          self.ARGS.send_to_shader = self.ARGS.send_to_shader or {}
          self.ARGS.send_to_shader[1] = math.min(self.VT.r*3, 1) + G.TIMERS.REAL/(28) + (self.juice and self.juice.r*20 or 0) + self.tilt_var.amt
          self.ARGS.send_to_shader[2] = G.TIMERS.REAL
  ```
  即 `[1]` = 「卡的旋转 + 缓慢时间漂移 + juice 弹动 + 倾斜量」合成的**单一动画驱动标量**，`[2]` = 真实时间。foil/holo/polychrome 的条纹相位就靠 `[1]` 驱动。
- **`vortex` 分支**只送 2 个（`sprite.lua:88-90`）：`vortex_amt`（`G.TIMERS.REAL - G.vortex_time`）、`DPI`（`love.graphics.getDPIScale()`）。
- **`custom_shader` 分支**（背景 / Blind 动画 / Tag，由 `define_draw_steps` 配置）走声明式 `send` 列表（`sprite.lua:82-87`）：
  ```lua
      if custom_shader then
          if _send then
              for k, v in ipairs(_send) do
                  G.SHADERS[_shader]:send(v.name, v.val or (v.func and v.func()) or v.ref_table[v.ref_value])
              end
          end
  ```
  背景的具体 7 个 uniform 见 `源码\game.lua:2499-2509`：`time`、`spin_time`、`colour_1/2/3`、`contrast`、`spin_amount`。

### Inferences
- 移植到 Phaser 时，**每张卡需要设置的 uniform 数量是 10~11 个**，其中 `texture_details` / `image_details` 在卡的 sprite frame 不变时是常量，`burn_colour_1/2` 绝大多数时候是 `G.C.CLEAR`，`shadow` 是 bool，`dissolve` 绝大多数时候是 0。**真正每帧变的只有 `time`(按 ID 恒定)、`mouse_screen_pos`、`hovering`、`screen_scale` 和第 11 项 `vec2`** —— 这 5 项才是合批的真正障碍。
- `texture_details`/`image_details` 的存在说明 shader 需要**自己把 `texture_coords`（整张图集 UV）换算成单卡格子内的局部 UV**——这是因为 LÖVE 的 quad 采样给的是图集全局 UV。Phaser 里若用 texture atlas 同样要传这组参数。

---

## A5. 一帧大概多少次 shader 切换 / draw call？

### Takeaway
**推算值：牌局中约 60–110 次带 shader 的 draw call、120–220 次 `setShader` 状态切换；商店界面更高。** 注意这是我基于代码结构的估算，源码里没有任何计数器可直接引用。

### Cited Findings（估算所依据的确凿事实）
- `CardArea:draw()` 对**每个卡区跑两遍**（阴影层 + 卡面层），`源码\cardarea.lua:325-326`：
  ```lua
      self.ARGS.draw_layers = self.ARGS.draw_layers or self.config.draw_layers or {'shadow', 'card'}
      for k, v in ipairs(self.ARGS.draw_layers) do
  ```
  随后对 `hand`/`play`/`joker`/`consumeable`/`shop`/`discard`/`deck` 各类型分别 `self.cards[i]:draw(v)`（`cardarea.lua:331, 341, 348, 358, 366`）。
- **牌堆有降采样优化**：只画第 1 张、最后 1 张、每第 9 张，以及偏离堆位置 >1 的张 —— `源码\cardarea.lua:330`：
  ```lua
      if i == 1 or i%(self.config.thin_draw or 9) == 0 or i == #self.cards or math.abs(self.cards[i].VT.x - self.T.x) > 1 or math.abs(self.cards[i].VT.y - self.T.y) > 1 then
  ```
  （`thin_draw` 全仓只在 `functions\UI_definitions.lua:6150` 被设成 1，用于一个 5 张上限的展示区。）
- 阴影可被全局关掉：`源码\card.lua:4367` 条件里含 `G.SETTINGS.GRAPHICS.shadows == 'On'`（默认值 `'On'`，见 `globals.lua:230`）。
- 全屏后处理固定 **1 次**：`源码\game.lua:3293-3309`，CRT shader 对整张 `G.CANVAS` 画一次。
- 背景固定 **1 次**：`源码\game.lua:2499` 给 `G.SPLASH_BACK` 配了单个 `background` draw step。
- `card.lua` 内共 43 处 `draw_shader`；`blind.lua` 2 处；`functions\misc_functions.lua` 2 处。

### Inferences（估算明细，均为推论）
牌局 (SELECTING_HAND) 典型一帧：

| 对象 | 数量 | 每张 draw call | 小计 |
|---|---|---|---|
| 手牌（阴影 + center + front） | 8 | 3 | 24 |
| 小丑（阴影 + center；假设 2 张带 edition） | 5 | 2~3 | 12 |
| 消耗品 | 2 | 2~3 | 5 |
| 出牌区 / 弃牌堆残留 | 0~5 | 3 | 0~15 |
| 牌堆（52 张里约画 7~8 张，背面无 front） | ~8 | 2 | 16 |
| Blind 动画（`define_draw_steps`，通常 2~4 step） | 1 | 2~4 | 3 |
| Tag（`tag.lua:503` 的 draw_steps） | 0~2 | 2~3 | 0~6 |
| 背景 | 1 | 1 | 1 |
| CRT 后处理 | 1 | 1 | 1 |
| **合计（带 shader 的）** | | | **约 62–110** |

- `setShader` 切换次数 = 上述 draw call 数 × 2（每次 `draw_shader` 有一设一复位），即 **约 124–220 次/帧**。
- 商店界面（2 张 joker 商品 + 2 张 booster + 2 张 voucher，且商品普遍带 edition/价签）会更高，粗估 **100–150 次 draw call**。
- 以上**不含 UI/文字**。UI 走 `engine\ui.lua`、`engine\text.lua` 的 `love.graphics.rectangle` / 逐字 `draw`，不走 shader（但文字是**逐字符**一次 draw，数量也很可观）。

### Gaps
- 源码没有内建的 draw-call 计数器可以直接给出精确数字。`game.lua` 里有 `timer_checkpoint('start->canvas','draw')` 等耗时打点（`game.lua:3080, 3281, 3320`）但只记时间不记 call 数。要拿到精确值需要真机跑 RenderDoc / 在 `sprite.lua:110` 加计数器 —— 本次为只读分析，未做。

---

## B6. 卡牌 3D 倾斜：Lua 算顶点 / fragment 偏移 / mesh？

### Takeaway
**都不是 (a)，也不是 (b)，也不是 (c) 里说的「自己建 mesh」。答案是：在 GLSL 的 VERTEX 阶段改写裁剪空间坐标的 `w` 分量，靠透视除法把一个普通的两三角形 quad 掰成梯形。** Lua 侧只负责算出「鼠标位置 / 倾斜强度」这几个标量传给 shader，**不碰任何顶点坐标**。

### Cited Findings
- **倾斜代码内嵌在每一个卡牌 shader 的 `#ifdef VERTEX` 段里**，各文件内容逐字相同。以 `资源\shaders\dissolve.fs:73-86` 为例：
  ```glsl
  #ifdef VERTEX
  vec4 position( mat4 transform_projection, vec4 vertex_position )
  {
      if (hovering <= 0.){
          return transform_projection * vertex_position;
      }
      MY_HIGHP_OR_MEDIUMP float mid_dist = length(vertex_position.xy - 0.5*love_ScreenSize.xy)/length(love_ScreenSize.xy);
      MY_HIGHP_OR_MEDIUMP vec2 mouse_offset = (vertex_position.xy - mouse_screen_pos.xy)/screen_scale;
      MY_HIGHP_OR_MEDIUMP float scale = 0.2*(-0.03 - 0.3*max(0., 0.3-mid_dist))
                  *hovering*(length(mouse_offset)*length(mouse_offset))/(2. -mid_dist);

      return transform_projection * vertex_position + vec4(0,0,0,scale);
  }
  #endif
  ```
  关键就是最后一行的 `+ vec4(0,0,0,scale)`：**只动 `w`**。每个顶点因为离鼠标远近不同拿到不同的 `w`，GPU 做透视除法 `xyz/w` 后四个角位移量不同 → 视觉上的立体倾斜。
- 完全相同的 VERTEX 段出现在：`foil.fs:130-143`、`holo.fs`、`polychrome.fs`、`negative_shine.fs`、`voucher.fs`、`debuff.fs`、`played.fs`、`booster.fs`、`hologram.fs`、`CRT.fs`、`background.fs`、`flame.fs`、`flash.fs`、`gold_seal.fs`、`negative.fs`、`splash.fs`、`vortex.fs` —— `grep -l VERTEX *.fs` 命中全部 19 个文件。
- **`hovering`/`mouse_screen_pos`/`screen_scale` 三个 uniform 只在 VERTEX 段被引用**，fragment 的 `effect()` 完全不用它们。验证：`grep -n hovering dissolve.fs` 只有 70（extern 声明）、76、82 三行，而 `#ifdef VERTEX` 在第 73 行；`foil.fs` 同理（127/133/139，VERTEX 在 130）。→ **排除 (b) fragment 采样偏移**。
- **Lua 侧的绘制是最朴素的 quad 贴图**，没有任何顶点数组 —— `源码\engine\sprite.lua:148-156` 就是 `love.graphics.draw(image, quad, 0, 0, 0, sx, sy)`。全仓无 `newMesh` / `newSpriteBatch` 命中 → **排除 (a) 和 (c)**。
- **Lua 侧只算标量**。`Moveable` 的 `VT`（Visible Transform）只有 `{x, y, w, h, r, scale}` 六个数，是一个缓动到目标 `T` 的**2D 仿射变换**，与 3D 无关 —— 见 `源码\engine\moveable.lua:6-8` 注释与 `:20`、`:201-214`、`:406-443`（缓动积分）。`prep_draw`（`源码\functions\misc_functions.lua:795-806`）把 `VT` 变成 `push/scale/translate/rotate/scale`，纯 2D：
  ```lua
  function prep_draw(moveable, scale, rotate, offset)
      love.graphics.push()
      love.graphics.scale(G.TILESCALE*G.TILESIZE)
      love.graphics.translate(moveable.VT.x+moveable.VT.w/2 + ..., moveable.VT.y+moveable.VT.h/2 + ...)
      if moveable.VT.r ~= 0 or moveable.juice or rotate then love.graphics.rotate(moveable.VT.r + (rotate or 0)) end
      love.graphics.translate(-scale*moveable.VT.w*(moveable.VT.scale)/2, -scale*moveable.VT.h*(moveable.VT.scale)/2)
      love.graphics.scale(moveable.VT.scale*scale)
  end
  ```
- **Lua 只算倾斜的「输入参数」**，`源码\card.lua:4378-4392`：
  ```lua
          self.tilt_var = self.tilt_var or {mx = 0, my = 0, dx = ..., dy = ..., amt = 0}
          local tilt_factor = 0.3
          if self.states.focus.is then
              self.tilt_var.mx, self.tilt_var.my = G.CONTROLLER.cursor_position.x + self.tilt_var.dx*self.T.w*G.TILESCALE*G.TILESIZE, G.CONTROLLER.cursor_position.y + self.tilt_var.dy*self.T.h*G.TILESCALE*G.TILESIZE
              self.tilt_var.amt = math.abs(self.hover_offset.y + self.hover_offset.x - 1 + self.tilt_var.dx + self.tilt_var.dy - 1)*tilt_factor
          elseif self.states.hover.is then
              self.tilt_var.mx, self.tilt_var.my = G.CONTROLLER.cursor_position.x, G.CONTROLLER.cursor_position.y
              self.tilt_var.amt = math.abs(self.hover_offset.y + self.hover_offset.x - 1)*tilt_factor
          elseif self.ambient_tilt then
              local tilt_angle = G.TIMERS.REAL*(1.56 + (self.ID/1.14212)%1) + self.ID/1.35122
              self.tilt_var.mx = ((0.5 + 0.5*self.ambient_tilt*math.cos(tilt_angle))*self.VT.w+self.VT.x+G.ROOM.T.x)*G.TILESIZE*G.TILESCALE
              self.tilt_var.my = ((0.5 + 0.5*self.ambient_tilt*math.sin(tilt_angle))*self.VT.h+self.VT.y+G.ROOM.T.y)*G.TILESIZE*G.TILESCALE
              self.tilt_var.amt = self.ambient_tilt*(0.5+math.cos(tilt_angle))*tilt_factor
          end
  ```
  三档：**focus（手柄/键盘选中，带 dx/dy 摇杆偏移） > hover（鼠标悬停） > ambient_tilt（无人碰时的自动慢摇）**。`ambient_tilt` 默认 `0.2`（`card.lua:16`）、Blind 是 `0.3`（`blind.lua:11`）、某些展示卡是 `0.8`（`UI_definitions.lua:2566`）或 `1`（`game.lua:1508`）。
- `hover_offset` 是鼠标落点相对卡左上角的偏移，在 `源码\engine\node.lua:232-233` 里更新：
  ```lua
          self.hover_offset.x = (_p.x - self.T.x)
          self.hover_offset.y = (_p.y - self.T.y)
  ```
- **阴影不是 3D 倾斜，而是 Lua 直接平移 `VT` 后重画一遍** —— `源码\engine\sprite.lua:76-80` 与 `120-124`：
  ```lua
      if _shadow_height then
          self.VT.y = self.VT.y - _draw_major.shadow_parrallax.y*_shadow_height
          self.VT.x = self.VT.x - _draw_major.shadow_parrallax.x*_shadow_height
          self.VT.scale = self.VT.scale*(1-0.2*_shadow_height)
      end
      ... 画 ...
      if _shadow_height then   -- 还原
          self.VT.y = self.VT.y + _draw_major.shadow_parrallax.y*_shadow_height
          ...
      end
  ```
  `shadow_parrallax` 按卡距屏幕中心的水平距离算，`源码\engine\moveable.lua:461`：
  ```lua
      self.shadow_parrallax.x = (self.T.x + self.T.w/2 - G.ROOM.T.w/2)/(G.ROOM.T.w/2)*1.5
  ```
  默认 `{x = 0, y = -1.5}`（`moveable.lua:71`）。阴影颜色由 `dissolve.fs` 的 `shadow` bool 控制：`return vec4(shadow ? vec3(0.,0.,0.) : tex.xyz, shadow ? tex.a*0.3 : tex.a)`（`foil.fs:20` 同款）。

### Inferences
- **LÖVE 11 的 `love.graphics.draw` 在 CPU 侧把 quad 的 4 个角按当前变换栈预先变换好**，所以 shader 里的 `vertex_position.xy` 已经是**屏幕像素坐标**（否则 `vertex_position.xy - 0.5*love_ScreenSize.xy` 和 `- mouse_screen_pos.xy` 这两个减法在量纲上讲不通）。这是理解这套 shader 的关键：`transform_projection` 此时基本只剩投影矩阵。**移植 Phaser 时必须复现这一坐标空间约定**，否则倾斜公式整个失配。
- 倾斜强度公式里有两个衰减项：`mid_dist`（离屏幕中心的归一化距离，离中心越近倾斜越强）和 `length(mouse_offset)^2`（离鼠标越远的顶点被推得越厉害，二次方）。`screen_scale` 起归一化作用，卡越大（或 `mouse_damping` 越大）倾斜越缓 —— `mouse_damping = 1.5` 只在 Booster 包上设过（`card.lua:346`）。
- 因为倾斜是**纯 vertex**、且开销就是几行算术，**它对 GPU 几乎免费**；真正的成本全在 A3 说的「零合批 + 多 pass overdraw」。这对 Phaser 移植的结论很关键：倾斜本身好移，难点在 draw call 数。

### ⚠️ 本移动版构建的重大差异：卡牌的倾斜实际上是**关闭**的
`hovering` 的表达式（`源码\engine\sprite.lua:99`）里有一个前置条件 `_draw_major.touch_collide_tilt`：
```lua
G.SHADERS[...]:send('hovering', ((_shadow_height and not tilt_shadow) or _no_tilt) and 0
    or (((_draw_major.touch_collide_tilt and _draw_major.states.collide.is) and _draw_major.hover_tilt or 0) or 0)*(tilt_shadow or 1))
```
全仓 grep `touch_collide_tilt` 只有 **4 处**：
- `源码\engine\sprite.lua:99`（读取）
- `源码\functions\UI_definitions.lua:4111` `temp_blind.touch_collide_tilt = true`
- `源码\functions\UI_definitions.lua:5975` `temp_blind.touch_collide_tilt = true`
- `源码\tag.lua:512` `tag_sprite.touch_collide_tilt = true`

**`Card` 从不设置 `touch_collide_tilt`**（`card.lua` 里零命中）。所以在这个移动版里，卡牌传进 shader 的 `hovering` 恒为 **0**，vertex shader 走 `if (hovering <= 0.) return transform_projection * vertex_position;` 提前返回 —— **卡牌的 3D 倾斜被整体禁用，只有 Blind 预览图和 Tag 还保留倾斜**。这显然是触屏端没有 hover 的适配改动。
另外 `源码\engine\sprite.lua:74` 还有一道全局开关：`if G.SETTINGS.reduced_motion then _no_tilt = true end`。

> 推断（未验证）：Steam 桌面版 1.0.1o 的对应行应为 `(_draw_major.states.collide.is and _draw_major.hover_tilt or 0)`，不带 `touch_collide_tilt` 前置。**做「复刻桌面版手感」时应按去掉这个前置条件来实现**，即 hover 命中即 `hovering = hover_tilt`。`hover_tilt` 在 `card.lua:4351` 每帧被重置为 `1`（Hologram 小丑临时 ×1.5，见 `card.lua:4525-4527`），Blind 是 `2`（`blind.lua:432`）。

---

## B7. `skew.fs` 是被谁调用的？什么时机？

### Takeaway
**`skew.fs` 在 Lua 侧从未被调用**（全仓 grep `skew` 在 `.lua` 里零命中）。它是那段倾斜 VERTEX 代码的**独立母版/参考文件**，内容已被逐字复制进其余 18 个 shader 的 `#ifdef VERTEX` 段。`G.SHADERS['skew']` 会被 `game.lua:137` 的循环加载进池子，然后一直闲置。

### Cited Findings
- `资源\shaders\skew.fs` 全文 24 行，**只有 `#ifdef VERTEX` 段，没有 `effect()` 片元函数**，内容与 `dissolve.fs:73-86` 逐字相同（含 `extern` 三行）。
- `grep -rn "skew" --include=*.lua .` → 无任何输出。
- 它仍会被加载：`game.lua:135` 的判断只看扩展名 `.fs`。

### Inferences
- 因为 `skew.fs` 缺少 `effect()`，即使被 `setShader` 也只会走 LÖVE 的默认片元着色器（原样贴图）。它可能是开发期用来单独调倾斜的测试 shader，发布时忘了删。
- 对移植的启示：**倾斜不是一个独立 pass，而是被编译进每一个卡牌 shader 的顶点阶段**。Phaser 移植时同样应该把这段 vertex 代码做成所有卡牌 pipeline 共享的顶点着色器 include，而不是单独再画一遍。

---

## C8. `conf.lua` 的 LÖVE 版本号与图形配置

### Takeaway
**`conf.lua` 里根本没有 `t.version`**（也没有 vsync / msaa / gammacorrect / 固定窗口尺寸）。整个 `conf.lua` 只有 10 行，窗口宽高都设成 `0`（由平台决定）。真正的图形配置散落在 `globals.lua` 的 `G.SETTINGS` 和运行时的 `love.window.setMode`。LÖVE 运行时版本从原生库判断为 **11.5**。

### Cited Findings
- `源码\conf.lua` 全文：
  ```lua
  _RELEASE_MODE = true
  _DEMO = false

  function love.conf(t)
  	t.console = not _RELEASE_MODE
  	t.title = 'Balatro'
  	t.window.width = 0
      t.window.height = 0
  	t.window.minwidth = 100
  	t.window.minheight = 100
  end
  ```
  —— 无 `t.version`、无 `t.window.vsync`、无 `t.window.msaa`、无 `t.window.highdpi`、无 `t.window.fullscreen`。
- LÖVE 版本：`参考\产物\Balatro_1.0.1o\原生库\arm64-v8a\liblove.so` 里含版本代号字符串 `Mysterious Mysteries`（命中 1 次；`Tremendous Tortoise`/`Bestest Friend`/`Super Toast`/`Nine Lives` 均 0 次），且版本串表里 `11.0 11.1 11.2 11.3 11.4 11.5` 齐全、`11.5` 为最高。**LÖVE 11.5「Mysterious Mysteries」**。
- vsync 是**运行时设置**，不在 conf：默认值 `源码\globals.lua:210` `vsync = 1`；切换逻辑 `源码\functions\button_callbacks.lua:797-798, 1221, 1228`（`vsync = G.SETTINGS.WINDOW.vsync == 1 and 1 or 0` 传给 `love.window.setMode`）；UI 入口 `functions\UI_definitions.lua:2431`。
- 图形相关设置默认值 —— `源码\globals.lua:229-234`：
  ```lua
          GRAPHICS = {
              texture_scaling = 2,
              shadows = 'On',
              crt = self.F_MOBILE and 30 or 70,
              bloom = 1
          },
  ```
  注意 `crt` 在移动端默认 30、桌面 70。
- 窗口默认：`源码\globals.lua:205-219` → `screenmode = 'Borderless'`，默认分辨率 `{w = 1000, h = 650}`。
- 唯一的 `setMode` 直接调用是启动失败时的兜底：`源码\main.lua:367` `pcall(love.window.setMode, 800, 600)`。

### Inferences
- 没写 `t.version` 意味着 LÖVE 以「当前运行版本」的兼容模式运行（不做旧版本 API 兼容降级）。要在桌面复现，用 **LÖVE 11.5** 最稳。
- 没有 MSAA 配置 + 后面（C9）也看不到多重采样 canvas，说明**整个游戏没有抗锯齿**，靠 `G.CANVAS:setFilter('linear','linear')` 的双线性过滤做平滑。

### Gaps
- 未能从 `liblove.so` 里提取到形如 `LOVE 11.5 (Mysterious Mysteries)` 的完整拼接串（二进制里是分段存储的），所以 11.5 这个结论是由「代号字符串命中 + 版本表最高值」两条证据**推断**得出，非直接读取。

---

## C9. canvas / render target 的使用；CRT 是否作用于整张 canvas？

### Takeaway
**是，CRT 作用于整张离屏 canvas，是标准的全屏后处理，一帧只有一次。** 游戏所有内容先画进 `G.CANVAS`，最后把这张 canvas 带 CRT shader 画到屏幕上。代码里还留着一个 `G.AA_CANVAS` 的二级 canvas 路径，但**这个构建里 `G.AA_CANVAS` 从未被赋值**，所以那条路等价于「直接画到屏幕」。

### Cited Findings
- 唯一的 canvas 创建 —— `源码\main.lua:480-483`：
  ```lua
  	G.CANV_SCALE = 1

  	G.CANVAS = love.graphics.newCanvas(w*G.CANV_SCALE, h*G.CANV_SCALE, {type = '2d', readable = true})
  	G.CANVAS:setFilter('linear', 'linear')
  ```
  `G.CANV_SCALE = 1` —— 没有超采样。
- 帧开始切到 canvas —— `源码\game.lua:3078-3089`：
  ```lua
  function Game:draw()
      G.FRAMES.DRAW = G.FRAMES.DRAW + 1
      reset_drawhash()
      ...
      love.graphics.setCanvas{self.CANVAS}
      love.graphics.push()
      love.graphics.scale(G.CANV_SCALE)

      love.graphics.setShader()
      love.graphics.clear(0,0,0,1)
  ```
- 帧末的全屏 CRT pass —— `源码\game.lua:3284-3320`：
  ```lua
      love.graphics.setCanvas(G.AA_CANVAS)
      love.graphics.push()
      love.graphics.clear(0,0,0,1)
          love.graphics.setColor(G.C.WHITE)
      if (not G.recording_mode or G.video_control) and true then
          ...
          G.SETTINGS.GRAPHICS.crt = G.SETTINGS.GRAPHICS.crt*0.3
          G.SHADERS['CRT']:send('distortion_fac', {1.0 + 0.07*G.SETTINGS.GRAPHICS.crt/100, 1.0 + 0.1*G.SETTINGS.GRAPHICS.crt/100})
          G.SHADERS['CRT']:send('scale_fac', {1.0 - 0.008*..., 1.0 - 0.008*...})
          G.SHADERS['CRT']:send('feather_fac', 0.01)
          G.SHADERS['CRT']:send('bloom_fac', 0)
          G.SHADERS['CRT']:send('time', 400 + G.TIMERS.REAL)
          G.SHADERS['CRT']:send('crt_intensity', 0.16*G.SETTINGS.GRAPHICS.crt/100)
          G.SHADERS['CRT']:send('glitch_intensity', 0)
          G.SHADERS['CRT']:send('scanlines', G.CANVAS:getPixelHeight()*0.75/G.CANV_SCALE)
          G.SHADERS['CRT']:send('mouse_screen_pos', ... {G.ARGS.eased_cursor_pos.sx, G.ARGS.eased_cursor_pos.sy})
          G.SHADERS['CRT']:send('screen_scale', G.TILESCALE*G.TILESIZE)
          G.SHADERS['CRT']:send('hovering', 1)
          love.graphics.setShader( G.SHADERS['CRT'])
          G.SETTINGS.GRAPHICS.crt = G.SETTINGS.GRAPHICS.crt/0.3
      end
          love.graphics.scale(1/G.CANV_SCALE)
          love.graphics.draw(self.CANVAS, 0, 0)          -- ← 整张 canvas 一次性过 CRT
      love.graphics.pop()

      love.graphics.setCanvas()
      love.graphics.setShader()

      if G.AA_CANVAS then
          love.graphics.push()
              love.graphics.scale(1/G.CANV_SCALE)
              love.graphics.draw(G.AA_CANVAS, 0, 0)
          love.graphics.pop()
      end
  ```
- **`G.AA_CANVAS` 在整个源码树里从未被赋值**：`grep -rn "AA_CANVAS *=" --include=*.lua .` → 零输出；只有 `game.lua:3285/3315/3318` 三处读取。`setCanvas(nil)` 在 LÖVE 中等于恢复默认 framebuffer，所以 CRT 的结果直接落到屏幕，末尾的 `if G.AA_CANVAS then` 分支永不执行。
- 另一处 `setCanvas()` 是加载进度条的临时绘制：`源码\functions\misc_functions.lua:114`。
- **CRT 也复用了那段 tilt 顶点着色器**：`CRT.fs` 在 `grep -l VERTEX` 命中列表里，且 `game.lua:3304` 明确 `send('hovering', 1)`，配合 `screen_scale` 和 `mouse_screen_pos` —— 所以整个屏幕也会随鼠标做一点点极轻微的透视扭曲。

### Inferences
- 渲染管线只有 **2 层**：`G.CANVAS`（所有内容）→ 屏幕（CRT 后处理）。没有 bloom pass（`bloom_fac` 被硬编码成 0，`game.lua:3296`），没有 glitch pass（`glitch_intensity` 硬编码 0，`game.lua:3300`），`noise_fac` 那行是注释掉的（`game.lua:3298`）。移动版把这些都砍了。
- `G.SETTINGS.GRAPHICS.crt = crt*0.3` 然后 `/0.3` 还原的写法（`game.lua:3292` 与 `3306`）是个临时缩放 hack —— 移动版把 CRT 强度又额外压到 30%。移动端实际 CRT 强度 = `30 * 0.3 = 9`（对比桌面默认 70）。
- 移植 Phaser 时，CRT 可以直接做成一个全屏 post-processing pipeline，成本固定 1 次，与卡牌数量无关。

---

## D10. foil / holo / polychrome / negative 如何按卡选择 shader？

### Takeaway
**没有「shader 选择表」，是 `Card:draw()` 里一长串写死的 `if` 分支**，每个 edition 对应一个硬编码的 shader 名字符串，按固定顺序叠加绘制。edition 本身是 `card.edition = {foil=true, type='foil', chips=...}` 这样的一个小 table，由 `Card:set_edition()` 设置，**是互斥的（一张卡只能有一个 edition）**。

### Cited Findings
- **edition 数据结构**，`源码\card.lua:387-417`（`Card:set_edition`）:
  ```lua
  function Card:set_edition(edition, immediate, silent)
      self.edition = nil
      if not edition then return end
      if edition.holo then
          if not self.edition then self.edition = {} end
          self.edition.mult = G.P_CENTERS.e_holo.config.extra
          self.edition.holo = true
          self.edition.type = 'holo'
      elseif edition.foil then
          ...
          self.edition.chips = G.P_CENTERS.e_foil.config.extra
          self.edition.foil = true
          self.edition.type = 'foil'
      elseif edition.polychrome then
          ...
          self.edition.x_mult = G.P_CENTERS.e_polychrome.config.extra
          self.edition.polychrome = true
          self.edition.type = 'polychrome'
      elseif edition.negative then
          ... (negative 还会把 jokers/consumeables 的 card_limit +1)
          self.edition.negative = true
          self.edition.type = 'negative'
  ```
  注意是 `elseif` 链 —— **edition 互斥**。
- **绘制端的硬编码分发**，`源码\card.lua:4453-4479`。整块被一个大 `if`（`card.lua:4452`）包住，只有卡上有 edition / seal / 贴纸 / debuff 等任意一项时才进入：
  ```lua
                  if self.edition and self.edition.holo then
                      self.children.center:draw_shader('holo', nil, self.ARGS.send_to_shader)
                      if self.children.front and self.ability.effect ~= 'Stone Card' then
                          self.children.front:draw_shader('holo', nil, self.ARGS.send_to_shader)
                      end
                  end
                  if self.edition and self.edition.foil then
                      self.children.center:draw_shader('foil', nil, self.ARGS.send_to_shader)
                      if self.children.front and self.ability.effect ~= 'Stone Card' then
                          self.children.front:draw_shader('foil', nil, self.ARGS.send_to_shader)
                      end
                  end
                  if self.edition and self.edition.polychrome then
                      self.children.center:draw_shader('polychrome', nil, self.ARGS.send_to_shader)
                      if self.children.front and self.ability.effect ~= 'Stone Card' then
                          self.children.front:draw_shader('polychrome', nil, self.ARGS.send_to_shader)
                      end
                  end
                  if (self.edition and self.edition.negative) or (self.ability.name == 'Antimatter' and ...) then
                      self.children.center:draw_shader('negative_shine', nil, self.ARGS.send_to_shader)
                  end
  ```
- **negative 特殊：它替换底图而不是叠加**。在画主体的那一步就分叉了，`源码\card.lua:4419-4423`：
  ```lua
              if (self.edition and self.edition.negative) or (self.ability.name == 'Antimatter' and (self.config.center.discovered or self.bypass_discovery_center)) then
                  self.children.center:draw_shader('negative', nil, self.ARGS.send_to_shader)
                  if self.children.front and self.ability.effect ~= 'Stone Card' then
                      self.children.front:draw_shader('negative', nil, self.ARGS.send_to_shader)
                  end
              elseif not self.greyed then
                  self.children.center:draw_shader('dissolve')
                  ...
  ```
  所以 negative 用了**两个** shader：`negative`（替代 `dissolve` 画底图，做反色）+ `negative_shine`（叠加流光）。
- **其余挂载点**（同一块 `if` 内，`源码\card.lua:4455-4546`）：
  | 条件 | shader | 行号 |
  |---|---|---|
  | `ability.set == 'Voucher'` 或 `config.center.demo` | `voucher` | 4456-4458 |
  | `ability.set == 'Booster'` 或 `'Spectral'` | `booster` | 4459-4461 |
  | `ability.name == 'Invisible Joker'` | `voucher` | 4447-4449 |
  | `self.seal`（任意封蜡） | `dissolve`（画蜡本身）+ Gold 额外 `voucher` | 4480-4484 |
  | `ability.eternal` / `perishable` / `rental` / `sticker` | 各 `dissolve` + `voucher` 两次 | 4485-4508 |
  | `ability.name == 'Hologram'` | `hologram` | 4526 |
  | `self.debuff` | `debuff` | 4538-4543 |
  | `self.greyed` | `played` | 4544-4549 |
  | `self.vortex` | `vortex`（完全替代主体绘制） | 4410-4418 |
  | `ability.name == 'The Soul'` / `config.center.soul_pos` | `dissolve` ×2（带 scale/rotate 摆动） | 4511-4520, 4522-4536 |
- **shader 名全部是字面量字符串**：没有 `G.SHADERS[self.edition.type]` 这种表驱动写法（虽然 `edition.type` 字段恰好等于 shader 名，但绘制端并没用它）。
- 未发现 `get_edition` 函数（全仓无此名），edition 的读取一律是直接访问 `card.edition.foil` 等字段。

### Inferences
- 叠加顺序固定为：**底图(dissolve/negative) → front → 未发现遮罩 → voucher/booster → holo → foil → polychrome → negative_shine → seal → 贴纸 → soul/floating → debuff → played**。移植时必须保持这个 z 顺序，否则视觉会错。
- 每个 edition 对 center 和 front **各画一次**（Stone Card 除外），所以一张 foil 扑克牌比普通牌多 2 个 draw call，正好印证 A3 的推算。
- 所有 edition shader 共享同一套 uniform 约定（A4 的 10 项 + 一个与自己同名的 `vec2`），差别只在片元函数。**这对 Phaser 移植非常友好**：可以做一个公共的 uniform 绑定基类 + 19 个只换 fragment 的 pipeline。

### Gaps
- `card.lua` 有 25 万字符，我按 grep 定位后只精读了 `4348-4560`（`Card:draw`）与 `387-417`（`set_edition`）两段。若还有别处（比如 `G.FUNCS` 里的预览/图鉴渲染）用了不同的挂载方式，本次未覆盖。

---

## 移植 Phaser 的要点汇总（推论，非源码直述）

1. **倾斜易移，合批难移。** 倾斜是 14 行 vertex GLSL，Phaser 的自定义 pipeline 完全能复刻；但 Balatro 的「每卡多 pass、每 pass 一次 draw call」在 WebGL 下代价更高（JS→GL 的 uniform 上传开销远大于 LuaJIT→C）。
2. **坐标空间是最大的坑。** `vertex_position.xy` 在 LÖVE 里已是屏幕像素坐标（LÖVE 11 在 CPU 侧预变换 quad 顶点）。Phaser 的 pipeline 里顶点是 world 坐标经 projection，需要显式把 `inPosition` 转到同一空间，倾斜公式才成立。
3. **`time` 是按卡 ID 加相位的**（`sprite.lua:101`），不是全局时钟 —— 这是「每张 foil 卡流光不同步」的来源，不能省。
4. **`texture_details` / `image_details` 必须传**，shader 靠它把图集 UV 还原成单卡局部 UV。
5. **本构建的卡牌倾斜是关的**（`touch_collide_tilt` 从不在 Card 上设置）。要复刻桌面手感，实现时应去掉该前置条件。
6. **CRT 是唯一的全屏 pass，成本固定**，可放心保留。bloom/glitch/noise 在这个版本已全部关闭。
