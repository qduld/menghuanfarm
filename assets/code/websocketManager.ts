import { _decorator, Component, Node } from "cc";
import { tokenMock, userFilter, authFilter, tokenSort } from "./loadData";
// import { retrieveLaunchParams } from "@telegram-apps/sdk";

export class WebSocketManager {
  private static _instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private reconnectCount: number = 0;
  private readonly MAX_RECONNECT_COUNT: number = 5;
  private heartbeatInterval: number = 30000; // 30秒心跳
  private heartbeatTimer: any = null;
  private messageHandlers: Map<string, Function> = new Map();
  private token: string;

  private constructor() {}

  public static get instance(): WebSocketManager {
    if (!this._instance) {
      this._instance = new WebSocketManager();
    }
    return this._instance;
  }

  /**
   * 连接WebSocket服务器
   * @param url 连接地址
   * @param token 认证令牌
   */
  public connect(url: string): void {
    // const { initDataRaw } = retrieveLaunchParams();

    this.token = tokenMock;
    // this.token = initDataRaw;

    if (!this.token) {
      console.error("Token is required for WebSocket connection.");
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("Already connected");
      return;
    }

    // 拼接查询参数（如果有 Token）
    const wsUrl = this.buildWebSocketUrl(url, this.token);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connected to Node.js middleware");
      this.reconnectCount = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (e) {
        console.error("Message parse error:", e);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      this.reconnect(url, this.token);
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");
      this.reconnect(url, this.token);
    };
  }

  /**
   * 发送消息
   * @param message 消息内容
   */
  public send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket not connected");
    }
  }

  /**
   * 注册消息处理器
   * @param type 消息类型
   * @param handler 处理函数
   */
  public registerHandler(type: string, handler: Function): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * 取消注册消息处理器
   * @param type 消息类型
   */
  public unregisterHandler(type: string): void {
    this.messageHandlers.delete(type);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // 确保没有重复的心跳定时器
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: "ping" });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private reconnect(url: string, token: string): void {
    if (this.reconnectCount < this.MAX_RECONNECT_COUNT) {
      this.reconnectCount++;
      setTimeout(() => {
        console.log(
          `Reconnecting...(${this.reconnectCount}/${this.MAX_RECONNECT_COUNT})`
        );
        this.connect(url); // 重新连接时携带 Token
      }, 8000);
    } else {
      console.error("Max reconnection attempts reached");
      this.stopHeartbeat();
    }
  }

  private handleMessage(data: any): void {
    if (data.type === "pong") return; // 忽略心跳响应

    const handler = this.messageHandlers.get(data.type);
    if (handler) {
      handler(data);
    } else {
      console.warn(`No handler for message type: ${data.type}`);
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
  }

  /**
   * 构建带有 Token 的 WebSocket URL
   * @param baseUrl 基础 URL
   * @param token 认证令牌
   * @returns 完整的 WebSocket URL
   */
  private buildWebSocketUrl(baseUrl: string, token: string): string {
    const url = new URL(baseUrl);
    url.searchParams.set("token", token); // 添加 token 参数
    return url.toString();
  }
}
