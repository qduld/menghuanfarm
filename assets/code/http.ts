import { GlobalData } from "./globalData";
import { tokenMock, userFilter, authFilter, tokenSort, i18n } from "./loadData";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

export interface HttpRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"; // 请求方法
  headers?: { [key: string]: string }; // 请求头
  body?: any; // 请求体，可以是JSON对象或其他格式
}

export interface HttpResponseData {
  list: Array<any>;
  code: number;
  data: any;
  ok: boolean;
}
export interface HttpResponse {
  status: number;
  data: HttpResponseData;
  ok: boolean;
}

export let token = "";

export const proxyUrl = "https://www.we-farming.com/node/proxy";
// export const proxyUrl = "http://localhost:8989/proxy";
// 服务器默认ip和地址
const defaultServer = "https://www.we-farming.com";
// const defaultServer = "http://39.108.156.78:20180";
// const defaultServer = "http://182.92.142.17:18000";
export async function httpRequest<T>(
  url: string,
  options: HttpRequestOptions = {},
  params?: Record<string, any>,
  timeout: number = 10000 // 超时时间，默认 5000 毫秒（5 秒）
): Promise<HttpResponse> {
  if (!token) {
    const { initDataRaw } = retrieveLaunchParams();

    // token = tokenMock;
    token = initDataRaw;
  }

  const {
    method = "GET",
    headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      token,
    },
    body = null,
  } = options;

  if (params) {
    url += objectToQueryString(params);
  }

  // 创建超时的 Promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out")); // 超时后抛出错误
    }, timeout);
  });

  try {
    const response = await Promise.race([
      fetch(`${defaultServer}${url}`, {
        method,
        headers: {
          ...headers,
          token,
        },
        redirect: "follow",
        credentials: "same-origin",
        body: body ? JSON.stringify(body) : null,
      }),
      timeoutPromise, // 超时控制
    ]);

    // 解析 JSON 响应
    const data = await response.json();

    // 返回统一的响应格式
    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  } catch (error) {
    // 在这里可以添加更多的错误处理逻辑
    const globalData = GlobalData.getInstance();
    globalData.setMessageLabel(i18n.requestError);
    throw new Error(`HTTP request failed: ${error.message}`);
  }
}

/**
 * 将对象转换为查询字符串
 * @param params 请求的查询参数对象
 * @returns string 查询字符串
 */
function objectToQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  return (
    "?" +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`
      )
      .join("&")
  );
}
