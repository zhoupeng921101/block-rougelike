using UnityEngine;

/// <summary>
/// 战斗里的键位表(12 号票「键位总表」),键位只在这里写:以后做改键只换这一处。
/// 用旧输入系统轮询,因为 Demo 的 activeInputHandler 是 0(只开了旧输入系统)。
/// 拾起、拖动、落下只认左键,在 <see cref="BlockPieceDragger"/> 里;托盘上原地左键单击转一档的方向取 <see cref="TapSteps"/>。
/// </summary>
public static class PieceKeymap
{
    /// <summary>顺时针一档:右键。</summary>
    private const int RotateMouseButton = 1;

    /// <summary>顺时针一档:R。</summary>
    private const KeyCode RotateKey = KeyCode.R;

    /// <summary>拖拽中是取消这一手,没在拖时是返回主界面。</summary>
    public const KeyCode CancelOrBackKey = KeyCode.Escape;

    /// <summary>托盘上原地左键单击转几档(正 = 顺时针)。</summary>
    public const int TapSteps = 1;

    /// <summary>
    /// 这一帧的旋转输入合计几档,正 = 顺时针、负 = 逆时针:右键、R、滚轮向下一格各顺时针一档,滚轮向上一格逆时针一档。
    /// 滚轮按累计量算,满 1 才转一档(高精度滚轮、触控板一格不到 1),余量留在 <paramref name="wheelCarry"/> 里接着攒。
    /// </summary>
    public static int ReadRotation(ref float wheelCarry)
    {
        int steps = 0;
        if (Input.GetMouseButtonDown(RotateMouseButton)) steps++;
        if (Input.GetKeyDown(RotateKey)) steps++;

        // 滚轮向下是负值,对应顺时针
        wheelCarry -= Input.mouseScrollDelta.y;
        while (wheelCarry >= 1f)
        {
            steps++;
            wheelCarry -= 1f;
        }
        while (wheelCarry <= -1f)
        {
            steps--;
            wheelCarry += 1f;
        }
        return steps;
    }

    /// <summary>这一帧按了取消 / 返回键。</summary>
    public static bool CancelOrBackPressed() => Input.GetKeyDown(CancelOrBackKey);
}
