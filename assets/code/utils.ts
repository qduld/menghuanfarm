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

export function formatSecondsImprove(seconds) {
  // 计算小时、分钟和秒
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // 拼接结果字符串
  let result = "";
  if (hrs > 0) {
    result += `${hrs}h`;
  }
  if (mins > 0) {
    result += `${mins}min`;
  }
  if (secs > 0 || (hrs === 0 && mins === 0)) {
    result += `${secs}s`;
  }

  // 如果结果为空（即所有单位都为0），返回 "0s"
  return result || "0s";
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
      return value !== undefined && value !== null
        ? `${key}=${encodeURIComponent(String(value))}`
        : null;
    })
    .filter((pair) => pair !== null) // 移除无效项
    .join("&");
}

export function objectToUrlParams(obj: Record<string, any>): string {
  return Object.keys(obj)
    .map((key) => {
      let value = obj[key];

      // 判断值是否为对象（且不为 null）
      if (typeof value === "object" && value !== null) {
        value = JSON.stringify(value);
      }

      // 将键和值进行 URL 编码
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);

      return `${encodedKey}=${encodedValue}`;
    })
    .join("&");
}

export function formatToUSDInteger(amount: number): string {
  if (isNaN(amount)) {
    throw new Error("Input is not a valid number");
  }
  const integerPart = Math.floor(amount); // 获取整数部分
  return `${integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatNumberShortDynamic(amount: number): string {
  if (isNaN(amount)) {
    throw new Error("Input is not a valid number");
  }

  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;
  let absAmount = Math.abs(amount);

  while (absAmount >= 1000 && unitIndex < units.length - 1) {
    absAmount /= 1000;
    unitIndex++;
  }

  return (
    (amount < 0 ? "-" : "") +
    absAmount.toFixed(1).replace(/\.0$/, "") +
    units[unitIndex]
  );
}

// 有时间戳获取当天00:00:00的时间戳
export function getStartOfDayTimestamp(timestampInSeconds) {
  // 1. 将秒级时间戳转换为毫秒级
  const timestampInMilliseconds = timestampInSeconds * 1000;

  // 2. 创建一个 Date 对象
  const date = new Date(timestampInMilliseconds);

  // 3. 获取当天的年、月、日
  const year = date.getFullYear();
  const month = date.getMonth(); // 注意：月份从 0 开始
  const day = date.getDate();

  // 4. 创建一个新的 Date 对象，表示当天的 00:00:00
  const startOfDay = new Date(year, month, day);

  // 5. 返回时间戳（毫秒级）
  return startOfDay.getTime();
}

// 判断两个时间戳之间的天数是否大于 30 天（包含起始的两天）
export function isDifferenceBetweenTimes(timestamp1, timestamp2) {
  // 确保时间戳是毫秒级
  const toMilliseconds = (ts) => (ts < 1e12 ? ts * 1000 : ts);

  const timestamp1InMilliseconds = toMilliseconds(timestamp1);
  const timestamp2InMilliseconds = toMilliseconds(timestamp2);

  // 计算两个时间戳之间的毫秒差
  const differenceInMilliseconds = Math.abs(
    timestamp1InMilliseconds - timestamp2InMilliseconds
  );

  // 将毫秒差转换为天数，并加 1（包含起始的两天）
  const millisecondsPerDay = 1000 * 60 * 60 * 24; // 一天的毫秒数
  const differenceInDays =
    Math.floor(differenceInMilliseconds / millisecondsPerDay) + 1;

  return differenceInDays;
}
