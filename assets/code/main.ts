import { _decorator, Component, Node, find, Sprite, Label, director } from "cc";
import { Login } from "./login";
import { GenBlock } from "./genBlock";
import { httpRequest } from "./http";

const { ccclass, property } = _decorator;
let userAvata: Node;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("main")
export class main extends Component {
  public static token: string | null = null;
  @property(Node)
  genBlock: GenBlock = new GenBlock(); // block实例

  @property(Node)
  login: Login = new Login(); // block实例

  protected onLoad(): void {
    this.init();
    director.preloadScene("circles");
  }
  init() {
    //种子背包
    userAvata = find("MainCanvas/TopContent/Avatar/Picture");

    // this.initTelegram();
    // this.initLogin();
    // this.getUserInfo();
  }
  initTelegram() {
    if (typeof window.Telegram === "undefined") {
      window.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: "123456789",
              username: "testuser",
              first_name: "Test",
              last_name: "User",
              photo_url: "home/spriteFrame",
            },
          },
          ready: () => console.log("Telegram WebApp ready (模拟)"),
        },
      };
    } else {
      window.Telegram.WebApp.ready();
    }
  }
  initLogin() {
    this.login.loadUserAvatar((spriteFrame) => {
      if (spriteFrame) {
        console.log("头像加载成功，可以在这里使用 spriteFrame", spriteFrame);
        userAvata.getComponent(Sprite).spriteFrame = spriteFrame;
      } else {
        console.log("未能加载头像");
      }
    });
  }
  getUserInfo() {
    // Telegram API URL
    const apiUrl = `https://api.telegram.org/bot7360724156:AAGeBGUrfDuRRYTkL-G4ZWKmi3rIKWH05VU/getUpdates`;

    // 使用 fetch 请求 Telegram Bot API
    fetch(apiUrl)
      .then((response) => response.json()) // 解析 JSON 响应
      .then((data) => {
        if (data.ok && data.result.length > 0) {
          // 获取第一个更新的消息
          const message = data.result[0].message;
          const userId = message.from.id; // 提取 user_id
          const userName = message.from.first_name; // 提取用户名字（可选）
          console.log(`User ID: ${userId}`);
          console.log(`User Name: ${userName}`);

          const label = find("MainCanvas/TelgramInfo");
          // 将 `window.Telegram` 的内容显示到 Label 上
          label.getComponent(Label).string = `Telegram Info:\n${userId}`;
          // 在这里你可以继续处理用户数据，如获取头像等
        } else {
          console.log("没有找到更新或数据为空");
        }
      })
      .catch((error) => {
        console.error("请求错误: ", error);
      });
  }
}
