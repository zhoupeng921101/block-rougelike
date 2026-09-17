# BigNum

`BigNum` 是一个用于处理大整数的 JavaScript 库，支持高精度计算和多种数学操作。它提供了对大整数的加法、减法、乘法、除法、取模等基本运算，以及按位操作和比较功能。
## 特性
- 支持大整数的加法、减法、乘法、除法、取模等基本运算。
- 支持按位操作，如按位与、按位或、按位异或等。
- 支持比较操作，如大于、小于、等于等。
- 支持转换为不同进制的字符串表示。
- 支持从字符串或数字创建 BigNum 实例。

原始库地址 https://github.com/peterolson/BigInteger.js/blob/master/BigInteger.js

BigInteger 更名字为 BigNum，以避免与其他库冲突。 lib.dom.d.ts type BigInteger = Uint8Array;

Examples:
// 不需要引用，可直接使用
// 创建 BigNum 实例
const num1:BigNum = bigNum("12345678901234567890");
const num2:BigNum = bigNum(987654321);

// 加法
const sum:BigNum = num1.add(num2);
console.log(sum.toString()); // 输出: 12345678902222222211

// 乘法
const product:BigNum = num1.multiply(num2);
console.log(product.toString()); // 输出: 12193263112482853211026352690

// 比较
console.log(num1.greater(num2)); // 输出: true

