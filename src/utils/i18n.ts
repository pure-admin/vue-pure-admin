import { i18n } from "../plugins/i18n";

/**
 * 消息转换
 * @param message message
 * @param isI18n  如果true,获取对应的消息,否则返回this
 * @returns message
 */
export function transformI18n(message = "", isI18n = false) {
  if (!message) {
    return "";
  }
  if (isI18n) {
    //@ts-ignore
    return i18n.global.tc.call(i18n.global, message);
  } else {
    return message;
  }
}
