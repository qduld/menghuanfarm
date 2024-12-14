export function formatSeconds(seconds, blackspace = false) {
  // 计算小时、分钟和秒
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // 根据条件拼接输出
  let result = "";
  if (hrs > 0) {
    blackspace ? (result += `${hrs}h `) : (result += `${hrs}h`);
  }
  if (mins > 0) {
    blackspace ? (result += `${mins}min `) : (result += `${mins}min`);
  }
  result += `${secs}s`;
  return result.trim(); // 去掉多余空格
}

export function formatTimestampToDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
  const day = (date.getDate() < 10 ? "0" : "") + date.getDate();

  return year + "." + month + "." + day;
}

// 类型别名，表示对象中的 key 为字符串，值可以是任意类型
type AnyObject = Record<string, any>;

/**
 * 将驼峰命名转换为下划线命名。
 * @param key 原始驼峰命名的 key。
 * @returns 转换后的下划线命名的 key。
 */
function toSnakeCase(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * 将对象中的指定属性从驼峰命名转换为下划线命名。
 * @param obj 原始对象。
 * @param allowedKeys 需要筛选并转换的属性名数组。
 * @returns 新的对象，仅包含指定属性，且 key 为下划线命名。
 */
export function convertAndFilterKeys(
  obj: AnyObject,
  allowedKeys: string[]
): AnyObject {
  const result: AnyObject = {};

  for (const key of allowedKeys) {
    if (key in obj) {
      const newKey = toSnakeCase(key);
      result[newKey] = obj[key];
    }
  }

  return result;
}

/**
 * 解析当前浏览器 URL 中的 chat_instance 和 chat_type 参数。
 * @returns 包含 chat_instance 和 chat_type 的对象，如果不存在则返回 undefined。
 */
export function parseCurrentChatParams(): {
  chat_instance?: string;
  chat_type?: string;
} {
  const result: { chat_instance?: string; chat_type?: string } = {};

  const params = new URLSearchParams(window.location.search);

  const chatInstance = params.get("chat_instance");
  const chatType = params.get("chat_type");

  if (chatInstance) {
    result.chat_instance = chatInstance;
  }

  if (chatType) {
    result.chat_type = chatType;
  }

  return result;
}

/**
 * 根据指定的顺序，将对象的键值对拼接成 `&` 符号连接的字符串。
 *
 * @param data 包含所有属性的对象
 * @param order 指定拼接顺序的键数组
 * @returns 拼接后的字符串
 */
export function buildToken(data: Record<string, any>, order: string[]): string {
  return order
    .map((key) => {
      const value = data[key];
      // 过滤掉值为 undefined 或 null 的键值对
      return value !== undefined && value !== null ? `${key}=${value}` : null;
    })
    .filter((pair) => pair !== null) // 移除无效项
    .join("&");
}
