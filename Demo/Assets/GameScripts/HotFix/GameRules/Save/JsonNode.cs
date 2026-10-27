using System.Collections.Generic;

namespace GameRules
{
    internal enum JsonKind
    {
        Null = 0,
        Bool = 1,
        Integer = 2,
        String = 3,
        Array = 4,
        Object = 5,
    }

    /// <summary>
    /// JSON 子集的解析树(<see cref="JsonSubsetReader"/>):只有整数、字符串、布尔、null、数组、对象。
    /// 对象成员按文本里的先后保留,重名也照留:多、少成员与次序由读档的形状检查去拦(09 号票 §3)。
    /// </summary>
    internal sealed class JsonNode
    {
        public JsonKind Kind { get; }

        public bool Bool { get; }

        public long Integer { get; }

        public string String { get; }

        /// <summary>数组的元素;别的种类为 null。</summary>
        public List<JsonNode> Items { get; }

        /// <summary>对象的成员,按文本里的先后;别的种类为 null。</summary>
        public List<KeyValuePair<string, JsonNode>> Members { get; }

        private JsonNode(JsonKind kind, bool b, long integer, string s, List<JsonNode> items, List<KeyValuePair<string, JsonNode>> members)
        {
            Kind = kind;
            Bool = b;
            Integer = integer;
            String = s;
            Items = items;
            Members = members;
        }

        public static readonly JsonNode Null = new JsonNode(JsonKind.Null, false, 0, null, null, null);

        public static JsonNode FromBool(bool b) => new JsonNode(JsonKind.Bool, b, 0, null, null, null);

        public static JsonNode FromInteger(long v) => new JsonNode(JsonKind.Integer, false, v, null, null, null);

        public static JsonNode FromString(string s) => new JsonNode(JsonKind.String, false, 0, s, null, null);

        public static JsonNode FromItems(List<JsonNode> items) => new JsonNode(JsonKind.Array, false, 0, null, items, null);

        public static JsonNode FromMembers(List<KeyValuePair<string, JsonNode>> members) =>
            new JsonNode(JsonKind.Object, false, 0, null, null, members);
    }
}
