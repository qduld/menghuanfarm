// WebSocketManager.ts
import { _decorator, Component, Node } from "cc";

export class WebSocketManager {
  private static _instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private reconnectCount: number = 0;
  private readonly MAX_RECONNECT_COUNT: number = 5;
  private heartbeatInterval: number = 30000; // 30秒心跳
  private heartbeatTimer: any = null;
  private messageHandlers: Map<string, Function> = new Map();

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
   */
  public connect(url: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("Already connected");
      return;
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
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
      this.reconnect();
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");
      this.reconnect();
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
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: "heartbeat" });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private reconnect(): void {
    if (this.reconnectCount < this.MAX_RECONNECT_COUNT) {
      this.reconnectCount++;
      setTimeout(() => {
        console.log(
          `Reconnecting...(${this.reconnectCount}/${this.MAX_RECONNECT_COUNT})`
        );
        this.connect("ws://bf.tomocloud.com");
      }, 5000);
    } else {
      console.error("Max reconnection attempts reached");
      this.stopHeartbeat();
    }
  }

  private handleMessage(data: any): void {
    if (data.type === "heartbeat") return; // 忽略心跳响应

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
}
