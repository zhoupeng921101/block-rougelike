/**
 * Lua 表字面量 → JS 对象。三个生成器共用
 * （`gen-joker-centers` / `gen-blind-centers` / `gen-consumable-centers`）。
 *
 * 只对付 `game.lua` 里 `P_CENTERS` / `P_BLINDS` 那种**纯字面量**的单行表：
 * 没有函数、没有变量引用、没有注释。遇到别的先在调用方剪掉
 * （盲注的 `vars = {localize(...)}` 就是这么处理的）。
 *
 * **先扫字符串再改键名，顺序不能反**：`"Driver's License"` 里那个撇号
 * 会被「单引号串」那条规则当成字符串开头，整行从这里往后全错。
 */
export function luaTableToJs(src) {
    if (/localize\(/.test(src)) throw new Error(`遇到 localize() 调用，解析器不支持：${src}`);

    const strings = [];
    let code = '';
    for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        if (ch === '"' || ch === "'") {
            let j = i + 1;
            while (j < src.length && src[j] !== ch) j++;
            strings.push(src.slice(i + 1, j));
            code += `@@STR${strings.length - 1}@@`;
            i = j;
        } else {
            code += ch;
        }
    }

    // `key =` → `"key":`（Lua 的键都是合法标识符）
    code = code.replace(/([{,]\s*)([A-Za-z_]\w*)\s*=/g, '$1"$2":');
    // 字符串放回来，统一成 JSON 双引号
    code = code.replace(/@@STR(\d+)@@/g, (_, n) => JSON.stringify(strings[Number(n)]));

    return new Function(`return ${code}`)();
}
