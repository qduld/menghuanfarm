import { _decorator, Component, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Telegram")
export class Telegram extends Component {
  @property(Sprite)
  tgInitData: Object = null;

  protected start(): void {
    this.initTelegram();
  }

  loadTelegramSDK() {
    // this.url.string = ‘loadTelegramSDK’
    return new Promise<void>((resolve, reject) => {
      if (window["Telegram"] && window["Telegram"].WebApp) {
        // Telegram SDK has already been loaded
        window["Telegram"].WebApp.ready();
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.onload = () => {
        window["Telegram"].WebApp.ready();

        // SDK loaded successfully
        resolve();
      };
      script.onerror = (error) => {
        // SDK loading failed
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  processInitData() {
    const initData = window["Telegram"]?.WebApp?.initData;
    if (initData) {
      const searchParams = new URLSearchParams(initData);
      const WebAppData = {};
      for (const [key, value] of searchParams.entries()) {
        WebAppData[key] = value;
      }
      // Get user information
      const user = window["Telegram"].WebApp.initDataUnsafe;
      // this.WebAppData = WebAppData;
      // Handle window size changes
      window["Telegram"].WebApp.onEvent("resize", function () {
        // Update UI
      });

      this.tgInitData = initData;
    } else {
    }
  }

  async initTelegram() {
    try {
      await this.loadTelegramSDK();
      this.processInitData();
    } catch (error) {}
  }
}
