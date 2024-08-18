export interface HttpRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"; // 请求方法
  headers?: { [key: string]: string }; // 请求头
  body?: any; // 请求体，可以是JSON对象或其他格式
}

export interface HttpResponse<T> {
  status: number;
  data: T;
  ok: boolean;
}

// 服务器默认ip和地址
const defaultServer = "http://182.92.142.17:18000";
export async function httpRequest<T>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> {
  const {
    method = "GET",
    headers = { "Content-Type": "application/json" },
    body = null,
  } = options;

  try {
    const response = await fetch(`${defaultServer}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    // 解析 JSON 响应
    const data: T = await response.json();

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
