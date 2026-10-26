namespace TEngine
{
    /// <summary>
    /// 事件管理器。持有底层分发器,事件 ID 为手写字面量常量(业务侧正本 = <c>GameEventID</c>)。
    /// </summary>
    public class EventMgr
    {
        /// <summary>
        /// 分发注册器。
        /// </summary>
        public EventDispatcher Dispatcher { get; private set; } = new EventDispatcher();

        public EventDispatcher GetDispatcher()
        {
            return Dispatcher;
        }

        /// <summary>
        /// 清除事件。
        /// </summary>
        public void Init()
        {
            Dispatcher.ClearEventTable();
        }
    }
}
