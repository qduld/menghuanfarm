import {
  _decorator,
  Component,
  Node,
  find,
  Sprite,
  Label,
  director,
  view,
  instantiate,
} from "cc";
import { GenBlock } from "./genBlock";
import { GenInfo } from "./genInfo";
import { AudioControl } from "./audioControl";

import { httpRequest, token } from "./http";
import { GlobalData } from "./globalData";
import { AudioMgr } from "./audioManager";
import { LoadingUI } from "./loadingUI";
import { SceneSwitcher } from "./sceneSwitcher";
import { WebSocketManager } from "./websocketManager";
import { Dialog } from "./dialog";

const { ccclass, property } = _decorator;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("main")
export class main extends Component {
  public static token: string | null = null;
  @property(Node)
  genBlock: GenBlock = new GenBlock(); // block实例

  @property(Node)
  topContent: Node = null;

  @property(Node)
  block: Node = null;

  @property(Node)
  footer: Node = null;

  @property(Node)
  tools: Node = null;

  protected async onAwake() {
    director.preloadScene("circles");
    director.preloadScene("harvest");
    director.preloadScene("task");
    const urlParams = new URLSearchParams(window.location.search);
    const scene = urlParams.get("scene");
    if (scene?.includes("circles")) {
      await this.circleScenePreview();
    }
  }

  protected async onLoad() {
    const globalData = GlobalData.getInstance();
    if (globalData.isStolen) {
      this.init();
      return;
    }
    if (!AudioMgr.inst.audioSource.state) {
      AudioMgr.inst.play("sounds/bgm", 1);
    }
    this.userLogin();

    this.topContent.active = false;
    this.footer.active = false;
    this.tools.active = false;

    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.show();

    this.connectWebsocket();
  }
  async circleScenePreview() {
    await this.requestUserInfo();
    director.loadScene("circles", async (err) => {
      if (err) {
        console.error("Failed to load scene:", "circle", err);
      }
    });
  }
  async init() {
    const genInfo = GenInfo.getInstance();
    const genBlock = GenBlock.getInstance();

    await Promise.all([genInfo.init(), genBlock.init()]);

    this.topContent.active = true;
    this.footer.active = true;
    this.tools.active = true;

    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.hide();
  }

  async userLogin() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest("/api/v1/farm/u/login", {
        method: "POST",
      });
      if (response.ok) {
        globalData.isLogin = true;
        this.init();
      } else {
        globalData.isLogin = false;
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 一键收割
  async requestOneClickHarvest() {
    const genInfo = GenInfo.getInstance();
    const genBlock = GenBlock.getInstance();

    try {
      const response = await httpRequest("/api/v1/farm/farmland/harvest_all", {
        method: "POST",
      });
      if (response.ok) {
        genInfo.init();
        genBlock.onekeyHarvest();
        genBlock.init();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 获取好友信息
  async requestUserInfo() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest(`/api/v1/farm/u/userInfo`, {
        method: "GET",
      });
      if (response.ok) {
        globalData.userInfo = response.data.data;
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  connectWebsocket() {
    const wsManager = WebSocketManager.instance;
    // 连接服务器
    // WebSocketManager.instance.connect("wss://bf.tomocloud.com/ws");

    // 连接到 Node.js 中间件，并传递 Token
    wsManager.connect("wss://we-farming.com/websocket");

    // wsManager.connect("ws://localhost:8989");

    // 注册消息处理器
    wsManager.registerHandler("message", (data) => {
      const dialog = Dialog.getInstance();

      switch (data.content.type) {
        case "order_payment_success":
          dialog.closeDialog(null, "PaymentMethod");
          dialog.closeDialog(null, "BuyCoins");
          dialog.buyCoinsSuccessBox
            .getChildByName("Coins")
            .getChildByName("Number")
            .getChildByName("Name")
            .getComponent(Label).string = data.content.data.points;
          dialog.showDialog(null, "BuyCoinsSuccess");
          setTimeout(() => {
            dialog.closeDialog(null, "BuyCoinsSuccess");
          }, 2000);
          break;
      }
      console.log("Received chat message:", data);
    });

    // 发送消息
    wsManager.send({ type: "chat", content: "Hello, world!" });
  }
}
