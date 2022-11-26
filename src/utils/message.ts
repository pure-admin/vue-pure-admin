import { type MessageHandler, ElMessage } from "element-plus";

// 更多配置请看：https://element-plus.org/zh-CN/component/message.html#message-%E9%85%8D%E7%BD%AE%E9%A1%B9

type messageTypes = "success" | "info" | "warning" | "error";

/**
 * `element-plus` 的 `info` 消息类型
 */
const message = (
  message: string,
  type = "info" as messageTypes,
  showClose = true,
  duration = 2000,
  center = false,
  grouping = false
): MessageHandler => {
  return ElMessage({
    message,
    type,
    showClose,
    duration,
    center,
    grouping
  });
};

/**
 * 关闭 `element-plus` 的所有消息实例
 */
const closeAllMessage = (): void => ElMessage.closeAll();

export { message, closeAllMessage };
