using System;
using System.IO;
using System.Text;
using System.Threading;
using GameRules;

/// <summary>
/// 局内存档的文件层(09 号票第 6 节):目录里的 <c>run.json</c> 与它的三个旁件 <c>.tmp</c>(写入中)、<c>.bak</c>(上一份)、<c>.bad</c>(最近一份读不了的)。
/// 只搬快照文本,内容由 <see cref="RunSnapshot"/> 写出与读入;什么时候写由 <see cref="RunSaveService"/> 定。
/// 文件出错一律不抛:记一条日志、返回失败,旧档留在原处。
/// </summary>
/// <remarks>不得引用 UnityEngine:<c>DotNet/Tests</c> 把本文件链接编译,在临时目录里测。</remarks>
public sealed class RunSaveFile
{
    public const string FileName = "run.json";

    /// <summary>比它大的文件不读进内存,直接当坏档。快照本身的上限(1 MiB 字符)由 <see cref="RunSnapshot.Read"/> 拦,这里只防把巨型文件整个读进来。</summary>
    private const long MaxFileBytes = 4L * 1024 * 1024;

    /// <summary>写失败后隔多久重试那一次(毫秒)。失败多半是杀毒软件之类短暂占着文件,立刻重试大概率还是撞上。</summary>
    private const int RetryDelayMs = 10;

    private static readonly UTF8Encoding Utf8NoBom = new UTF8Encoding(false);

    private readonly Action<string> _warn;

    /// <param name="folder">存档目录,不存在时第一次写档会建。</param>
    /// <param name="warn">记日志:写失败、坏档、回退到 .bak、删不掉文件。</param>
    public RunSaveFile(string folder, Action<string> warn)
    {
        Folder = folder ?? throw new ArgumentNullException(nameof(folder));
        MainPath = Path.Combine(folder, FileName);
        TmpPath = MainPath + ".tmp";
        BakPath = MainPath + ".bak";
        BadPath = MainPath + ".bad";
        _warn = warn ?? (_ => { });
    }

    public string Folder { get; }
    public string MainPath { get; }
    public string TmpPath { get; }
    public string BakPath { get; }
    public string BadPath { get; }

    /// <summary>
    /// 写一份:先写 <c>.tmp</c>,正档在就 <see cref="File.Replace(string, string, string)"/>(旧正档成为 <c>.bak</c>),不在就改名成正档。
    /// 失败隔一小会儿重试一次,再失败记日志、返回 false;正档还是上一份。
    /// </summary>
    public bool Write(string text)
    {
        if (text == null) throw new ArgumentNullException(nameof(text));
        Exception last = null;
        for (int attempt = 0; attempt < 2; attempt++)
        {
            if (attempt > 0) Thread.Sleep(RetryDelayMs);
            try
            {
                Directory.CreateDirectory(Folder);
                File.WriteAllText(TmpPath, text, Utf8NoBom);
                if (File.Exists(MainPath)) File.Replace(TmpPath, MainPath, BakPath);
                else File.Move(TmpPath, MainPath);
                return true;
            }
            catch (Exception e)
            {
                last = e;
            }
        }
        _warn($"写档失败(重试过一次),正档还是上一份:{Describe(last)}");
        return false;
    }

    /// <summary>
    /// 读档(主界面探测「继续」),返回进行中的局;没有档、读不了、已经结束都返回 null。按 09 §6 的四步:
    /// 删掉残留的 <c>.tmp</c>;正档读不了就挪成 <c>.bad</c>、改读 <c>.bak</c>,<c>.bak</c> 也读不了同样挪走;读到终局快照就删档;
    /// 正档不在就当无档,不回退到 <c>.bak</c>。
    /// 从 <c>.bak</c> 读成时把它抄回正档:不抄的话,玩家这次不点「继续」就退出,下次启动正档不在、档就没了。
    /// </summary>
    public RunState Load(RuleConfig config)
    {
        if (config == null) throw new ArgumentNullException(nameof(config));
        DeleteQuiet(TmpPath);
        if (!File.Exists(MainPath)) return null;

        switch (TryRead(MainPath, config, out RunState state))
        {
            case Verdict.InProgress:
                return state;
            case Verdict.Ended:
                Delete();
                return null;
        }
        Quarantine(MainPath);
        if (!File.Exists(BakPath)) return null;

        switch (TryRead(BakPath, config, out state))
        {
            case Verdict.InProgress:
                _warn($"正档读不了,改用 {Path.GetFileName(BakPath)}(退回上一份)");
                CopyQuiet(BakPath, MainPath);
                return state;
            case Verdict.Ended:
                Delete();
                return null;
        }
        Quarantine(BakPath);
        return null;
    }

    /// <summary>删档:先 <c>.bak</c>,后正档(09 §2:中途断掉,留下的正档还是终局快照,读档时当无档),最后顺手删 <c>.tmp</c>。<c>.bad</c> 留着报 bug。</summary>
    public void Delete()
    {
        DeleteQuiet(BakPath);
        DeleteQuiet(MainPath);
        DeleteQuiet(TmpPath);
    }

    private enum Verdict
    {
        Bad,
        Ended,
        InProgress,
    }

    private Verdict TryRead(string path, RuleConfig config, out RunState state)
    {
        state = null;
        string name = Path.GetFileName(path);
        string text;
        try
        {
            long length = new FileInfo(path).Length;
            if (length > MaxFileBytes)
            {
                _warn($"{name} 有 {length} 字节,超过 {MaxFileBytes},当坏档");
                return Verdict.Bad;
            }
            text = File.ReadAllText(path, Utf8NoBom);
        }
        catch (Exception e)
        {
            _warn($"{name} 读不出来,当坏档:{Describe(e)}");
            return Verdict.Bad;
        }

        SnapshotReadResult result;
        try
        {
            result = RunSnapshot.Read(text, config);
        }
        catch (Exception e)
        {
            // Read 对任何输入都不该抛(22 号票);万一抛了,主界面也不能因为一份档起不来
            _warn($"{name} 解析时抛了异常,当坏档:{Describe(e)}");
            return Verdict.Bad;
        }
        if (!result.Ok)
        {
            _warn($"{name} 是坏档:{result.Error} {result.Path}: {result.Detail}");
            return Verdict.Bad;
        }
        if (result.State.Blind != null && result.State.Blind.Outcome != BlindOutcome.InProgress) return Verdict.Ended;
        if (result.State.Progress.IsComplete(result.State.Map)) return Verdict.Ended;
        state = result.State;
        return Verdict.InProgress;
    }

    /// <summary>挪成 <c>.bad</c>,只留最近的一份。</summary>
    private void Quarantine(string path)
    {
        try
        {
            if (File.Exists(BadPath)) File.Delete(BadPath);
            File.Move(path, BadPath);
        }
        catch (Exception e)
        {
            _warn($"{Path.GetFileName(path)} 挪不成 {Path.GetFileName(BadPath)}:{Describe(e)}");
        }
    }

    private void CopyQuiet(string from, string to)
    {
        try
        {
            File.Copy(from, to, false);
        }
        catch (Exception e)
        {
            _warn($"{Path.GetFileName(from)} 抄不回 {Path.GetFileName(to)}:{Describe(e)}");
        }
    }

    private void DeleteQuiet(string path)
    {
        try
        {
            if (File.Exists(path)) File.Delete(path);
        }
        catch (Exception e)
        {
            _warn($"{Path.GetFileName(path)} 删不掉:{Describe(e)}");
        }
    }

    private static string Describe(Exception e) => e.GetType().Name + ": " + e.Message;
}
