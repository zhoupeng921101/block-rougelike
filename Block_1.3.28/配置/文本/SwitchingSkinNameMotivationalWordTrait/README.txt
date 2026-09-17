# SwitchingSkinNameMotivationalWord Trait

## 特性信息

- **特性ID**: 329026001
- **云效ID**: JAEJ-1611
- **平台**: GP
- **游戏模式**: 无尽
- **功能**: 切换皮肤时显示皮肤名称作为激励词

## 功能说明

### 触发条件
- 玩家触发清盘（roundNum >= 6 && clearScreen）
- 本次清盘会触发皮肤切换

### 行为逻辑
1. **显示皮肤名称**：当触发皮肤切换时，使激励词显示为该皮肤对应的名称文字
2. **取消原显示**：取消原 unbelievable 文字显示
3. **保留音效**：仍然会播放 unbelievable 音效
4. **例外情况**：当皮肤切换为默认皮肤（1000），或本次清盘不触发皮肤切换时，显示原激励词

## 皮肤名称映射表

| 皮肤ID | 皮肤名称 |
|--------|----------|
| 1001 | Pure Pink |
| 1002 | Macaron |
| 1003 | Gradient Pink |
| 1004 | Morandi |
| 1005 | Pure Green |
| 1006 | Sunflowers |
| 1007 | The Starry Night |
| 1008 | Dark Pop |
| 1009 | Mondrian |
| 1010 | Cyberpunk |
| 1011 | Countryside |
| 1012 | Ocean |
| 1013 | Forest |
| 1014 | Ukiyoe |
| 1015 | Memphis |
| 1016 | Rococo |
| 1017 | Matisse |
| 1018 | Latte |
| 1019 | Pantone |
| 1020 | Ground |
| 1021 | Blue-white |
| 1022 | Classic Black |
| 1023 | Earth |
| 1024 | Air Pink |
| 1025 | Tiffany Blue |
| 1026 | Dessert |
| 1027 | Macaw |
| 1028 | Mountains |
| 1029 | Glaciers |
| 1030 | Warm Cold |
| 1031 | Wizard |
| 1032 | Passion |
| 1033 | Peaceful |
| 1034 | Mystery |
| 1035 | Fresh |
| 1036 | Romantic |
| 1037 | Calm |
| 1038 | Lovely |
| 1039 | Energy |

## 实现原理

### 1. 拦截机制
- 监听 `ClassEncourage_Proxy.playEncourageUnbelievable()` 方法
- 使用 `target.replace = true` 阻止原激励词显示

### 2. 双层判断机制

#### 第一层：`isPlaySkinEncourage()` - 静态条件检查
检查是否满足播放皮肤名称激励词的基本条件：
- ✅ 游戏模式为无尽模式 (`gameMode === Class`)
- ✅ 轮数 >= 6
- ✅ 触发了皮肤切换 (`currentSkinId !== prevSkinId`)
- ✅ 切换到的不是默认皮肤 (`currentSkinId !== '1000'`)
- ✅ 皮肤ID在映射表中

#### 第二层：`checkSkinSwitched()` - 动态状态检查
使用缓存机制避免重复显示：
- 通过对比 `storage.prevSkinId` 和 `storage.currentSkinId` 判断是否发生皮肤切换
- 使用 `hasShownSkinNameThisRound` 标记避免同一轮清盘多次显示
- 返回实际要显示的皮肤ID

### 3. 显示逻辑
- 加载预制体 `SwitchingSkinNameEncourage`
- 从 `skinEncourage.json` 读取颜色配置
- 设置皮肤名称和颜色参数
- 播放动画效果

### 4. 资源结构
```
SwitchingSkinNameMotivationalWordTrait/
├── scripts/
│   ├── SwitchingSkinNameMotivationalWordTrait.ts  # 主逻辑
│   └── SwitchingSkinNameEncourage.ts              # 预制体组件
├── prefabs/
│   └── SwitchingSkinNameEncourage.prefab          # UI预制体
├── json/
│   └── skinEncourage.json                         # 颜色配置
└── textures/
    └── [skinId]/                                  # 各皮肤的纹理资源
        ├── gameplay_skinname_bg_[skinId].png      # 背景图
        └── gameplay_skinname_[skinId].png         # 文字图
```

## 测试步骤

### 前置条件
1. 确保特性已激活（`{"active":"true"}`）
2. 确保已开启皮肤切换功能（如 `CleanSceneRandomSkinTrait`）
3. 确保当前游戏模式为无尽模式

### 测试用例

#### 用例1：触发皮肤切换（非默认皮肤）
**步骤**：
1. 启动游戏，进入无尽模式
2. 游戏进行到第6轮或以上
3. 触发清盘，且清盘会触发皮肤切换（如从皮肤1001切换到1002）

**预期结果**：
- ✅ 显示新皮肤的名称（如 "Macaron"）
- ✅ 不显示 "unbelievable" 文字
- ✅ 播放 unbelievable 音效
- ✅ 皮肤名称使用对应的颜色方案

#### 用例2：切换到默认皮肤
**步骤**：
1. 启动游戏，进入无尽模式
2. 游戏进行到第6轮或以上
3. 触发清盘，且清盘会触发皮肤切换到默认皮肤（1000）

**预期结果**：
- ✅ 显示原激励词 "unbelievable"
- ✅ 不显示皮肤名称
- ✅ 播放 unbelievable 音效

#### 用例3：不触发皮肤切换
**步骤**：
1. 启动游戏，进入无尽模式
2. 游戏进行到第6轮或以上
3. 触发清盘，但本次清盘不触发皮肤切换

**预期结果**：
- ✅ 显示原激励词 "unbelievable"
- ✅ 不显示皮肤名称
- ✅ 播放 unbelievable 音效

#### 用例4：轮数小于6
**步骤**：
1. 启动游戏，进入无尽模式
2. 游戏进行到第5轮或以下
3. 触发清盘

**预期结果**：
- ✅ 不显示任何激励词（因为不满足 roundNum >= 6 的条件）

## 调试日志

特性开启时，会在控制台输出以下日志（仅 CC_DEBUG 模式）：

```
[SwitchingSkinName] 显示皮肤名称激励词: 1002 - Macaron
```

如果配置或资源加载失败，会输出警告/错误日志：
```
[SwitchingSkinName] 未找到皮肤名称: [skinId]
[SwitchingSkinName] 未找到颜色配置: [skinId]
[SwitchingSkinName] 加载配置失败: [error]
[SwitchingSkinName] 加载预制体失败
[SwitchingSkinName] 未找到组件
[SwitchingSkinName] 显示皮肤名称激励词失败: [error]
```

## 注意事项

1. **资源依赖**：确保 `textures/` 目录下每个皮肤ID都有对应的图片资源
2. **配置同步**：`skinEncourage.json` 中的皮肤ID必须与 `SKIN_NAME_MAP` 保持一致
3. **性能优化**：配置文件只在首次使用时加载一次，后续复用
4. **异常处理**：如果资源加载失败，会自动降级为不显示（不影响游戏流程）
5. **时序控制**：皮肤名称激励词的延迟时间与原激励词保持一致（time 参数）

## 相关代码

- **主逻辑**: `SwitchingSkinNameMotivationalWordTrait.ts`
- **预制体组件**: `SwitchingSkinNameEncourage.ts`
- **拦截点**: `ClassEncourage_Proxy.playEncourageUnbelievable()`
- **音效保留**: `ClassEncourage_Proxy.playEncourageUnbelievableAudio()` 不拦截
- **皮肤切换事件**: `E_Skin_Update`, `E_Skin_DataUpdateCompleted`
