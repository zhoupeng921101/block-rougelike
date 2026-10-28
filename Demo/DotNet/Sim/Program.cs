using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace GameRules.Sim
{
    /// <summary>
    /// <c>Sim --seeds &lt;种子&gt;[,&lt;种子&gt;…] --policy &lt;策略&gt;[,&lt;策略&gt;…]</c>:先按种子、再按策略的次序逐局跑,轨迹依次写 stdout(ASCII、LF),不落文件。
    /// 种子要是规范种子文本(<see cref="SeedText.IsCanonical"/>),策略是 greedy、random。
    /// 出口码:0 全部跑完;1 某局出错(错误写 stderr,已跑完的局照常在 stdout 里);2 参数不对。
    /// </summary>
    public static class Program
    {
        public static int Main(string[] args)
        {
            var stderr = new StreamWriter(Console.OpenStandardError(), new UTF8Encoding(false)) { NewLine = "\n", AutoFlush = true };
            if (!TryParse(args, out List<string> seeds, out List<string> policies, out string error))
            {
                stderr.WriteLine(error);
                stderr.WriteLine("用法: Sim --seeds <种子>[,<种子>…] --policy greedy|random[,…]");
                return 2;
            }

            var stdout = new StreamWriter(Console.OpenStandardOutput(), new UTF8Encoding(false)) { NewLine = "\n" };
            try
            {
                foreach (string seed in seeds)
                {
                    foreach (string policy in policies) stdout.Write(SimGame.Run(seed, policy));
                }
                return 0;
            }
            catch (Exception e)
            {
                stderr.WriteLine(e.ToString());
                return 1;
            }
            finally
            {
                stdout.Flush();
            }
        }

        private static bool TryParse(string[] args, out List<string> seeds, out List<string> policies, out string error)
        {
            seeds = null;
            policies = null;
            for (int i = 0; i < args.Length; i++)
            {
                if (i + 1 >= args.Length) return Fail("参数 " + args[i] + " 后面缺值", out error);
                switch (args[i])
                {
                    case "--seeds":
                        seeds = Split(args[++i]);
                        break;
                    case "--policy":
                        policies = Split(args[++i]);
                        break;
                    default:
                        return Fail("不认识的参数:" + args[i], out error);
                }
            }
            if (seeds == null || seeds.Count == 0) return Fail("缺 --seeds", out error);
            if (policies == null || policies.Count == 0) return Fail("缺 --policy", out error);
            foreach (string s in seeds)
            {
                if (!SeedText.IsCanonical(s)) return Fail("不是规范种子文本:" + s, out error);
            }
            foreach (string p in policies)
            {
                if (SimPolicies.Create(p, seeds[0]) == null) return Fail("不认识的策略:" + p, out error);
            }
            error = null;
            return true;
        }

        private static List<string> Split(string list) => new List<string>(list.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries));

        private static bool Fail(string message, out string error)
        {
            error = message;
            return false;
        }
    }
}
