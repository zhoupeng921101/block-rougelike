using System.Diagnostics;
using System.IO;
using GameRules;
using TEngine;
using UnityEngine;

/// <summary>
/// 局内存档的时机(09 号票第 2 节):开新局先删档、再写第一份;一步被接受之后、开演之前同步写,定了结局就写终局快照再删档;
/// 转朝向只置脏,<see cref="ClearPacing.RotationSaveDelay"/> 内没再转、下一次写档、离开战斗界面、窗口失焦、退出时合并写掉。
/// 文件怎么写、怎么读回在 <see cref="RunSaveFile"/>;快照里有什么归规则核心 <see cref="RunSnapshot"/>。
/// </summary>
/// <remarks>
/// 写档是同步的(09 §2:3–4 KB 一次,回合制承受得起;异步要处理「上一份没写完又来一步」和「退出时等它写完」)。
/// 每步写档的耗时记进日志,超过 <see cref="SlowWriteMs"/> 记警告:那是 09 定的「回去重议挪到后台线程」的门槛。
/// </remarks>
public sealed class RunSaveService : Singleton<RunSaveService>, IUpdate
{
    private const string FolderName = "save";

    private const double SlowWriteMs = 4;

    private RunSaveFile _file;

    /// <summary>战斗里正在打、要存的这一局;离开战斗界面或结局删档后为 null。</summary>
    private RunState _run;

    /// <summary>转过朝向、还没写进档。</summary>
    private bool _dirty;

    private float _dirtyAt;

    protected override void OnInit()
    {
        _file = new RunSaveFile(Path.Combine(Application.persistentDataPath, FolderName), m => Log.Warning("[RunSave] " + m));
        Application.focusChanged += OnFocusChanged;
        Application.quitting += Flush;
    }

    protected override void OnRelease()
    {
        Flush();
        Application.focusChanged -= OnFocusChanged;
        Application.quitting -= Flush;
    }

    /// <summary>主界面探测「继续」:能读、校验通过、还没打完的局,否则 null。点「继续」直接用这个结果,不再读第二次。</summary>
    public RunState Probe() => _file.Load(TuningTable.Instance.Config, MetaProgress.UnlockedGenes);

    /// <summary>开新局:先删掉旧局的档,再写第一份。开局这一步还没有盲注(下一步是选关),快照的 blind 写 null。</summary>
    public void StartNew(RunState run)
    {
        _file.Delete();
        _run = run;
        Write("开新局");
    }

    /// <summary>续玩:接着存这一局。档里就是它,不用写。</summary>
    public void Resume(RunState run)
    {
        _run = run;
        _dirty = false;
    }

    /// <summary>两场之间(地图、商店、结算之后)也存:这时 blind 为 null,读回来照样能继续。</summary>
    public void CommitRun(RunState run, string what)
    {
        _run = run;
        Write(what);
    }

    /// <summary>一步被接受之后、交给演出之前调。只写照这一步之后的局面,不删档:输赢的删档在 <see cref="EndRun"/> 与结算之后定。</summary>
    public void CommitStep(RunState run, StepResult result)
    {
        _run = run;
        Write($"第 {result.Step} 步");
    }

    /// <summary>这一局结束(输了、或打完最后一段):删档。</summary>
    public void EndRun()
    {
        Flush();
        _file.Delete();
        _run = null;
    }

    /// <summary>转了朝向(不算步):置脏,等防抖或下一个写入点合并写。</summary>
    public void MarkRotated(RunState run)
    {
        _run = run;
        _dirty = true;
        _dirtyAt = Time.realtimeSinceStartup;
    }

    /// <summary>离开战斗界面:写掉脏标记,不再跟这一局。</summary>
    public void Leave()
    {
        Flush();
        _run = null;
    }

    public void OnUpdate()
    {
        if (_dirty && Time.realtimeSinceStartup - _dirtyAt >= ClearPacing.RotationSaveDelay) Flush();
    }

    private void OnFocusChanged(bool focused)
    {
        if (!focused) Flush();
    }

    private void Flush()
    {
        if (_dirty && _run != null) Write("转朝向");
    }

    private void Write(string what)
    {
        _dirty = false;
        long start = Stopwatch.GetTimestamp();
        string text = RunSnapshot.Write(_run);
        long serialized = Stopwatch.GetTimestamp();
        bool ok = _file.Write(text);
        long done = Stopwatch.GetTimestamp();
        double totalMs = Ms(done - start);
        string line = $"[RunSave] {what}写档{(ok ? "" : "失败")} {totalMs:F3} ms(快照 {Ms(serialized - start):F3} + 文件 {Ms(done - serialized):F3}),{text.Length} 字节";
        if (totalMs > SlowWriteMs) Log.Warning(line + $",超过 {SlowWriteMs} ms");
        else Log.Info(line);
    }

    private static double Ms(long ticks) => ticks * 1000.0 / Stopwatch.Frequency;
}
