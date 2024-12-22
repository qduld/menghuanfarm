import { tokenMock, userFilter, authFilter, tokenSort } from "./loadData";
// import { retrieveLaunchParams } from "@telegram-apps/sdk";

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

let token = "";

export const proxyUrl = "https://franklinzelo.duckdns.org:8989/proxy";
// export const proxyUrl = "http://localhost:8989/proxy";
// 服务器默认ip和地址
const defaultServer = "https://bf.tomocloud.com";
// const defaultServer = "http://39.108.156.78:20180";
// const defaultServer = "http://182.92.142.17:18000";
export async function httpRequest<T>(
  url: string,
  options: HttpRequestOptions = {},
  params?: Record<string, any>
): Promise<HttpResponse> {
  if (!token) {
    // const { initDataRaw } = retrieveLaunchParams();

    token = tokenMock;
    // token = initDataRaw;
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

  try {
    const response = await fetch(`${defaultServer}${url}`, {
      method,
      headers: {
        ...headers, // 确保 headers 不会被覆盖
        token, // 添加 Authorization
      },
      redirect: "follow",
      credentials: "same-origin",
      body: body ? JSON.stringify(body) : null,
    });

    // 解析 JSON 响应
    const data = await response.json();

    // 返回一个统一的响应格式
    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  } catch (error) {
    // 在这里可以添加更多的错误处理逻辑
    throw new Error(`HTTP request failed: ${error}`);
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
