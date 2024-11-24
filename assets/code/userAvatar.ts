import {
  _decorator,
  Component,
  Sprite,
  Texture2D,
  ImageAsset,
  resources,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("UserAvatar")
export class UserAvatar extends Component {
  @property(Sprite)
  avatarSprite: Sprite = null!;

  start() {
    // 模拟 Telegram.WebApp 对象（本地调试用）
    if (!window.Telegram) {
      window.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: 123456789,
              first_name: "John",
              last_name: "Doe",
              username: "john_doe",
              photo_url: "https://telegram.org/img/t_logo.png",
            },
          },
        },
      };
    }

    const user = window.Telegram.WebApp.initDataUnsafe.user;

    if (user && user.photo_url) {
      this.loadImageToSprite(user.photo_url);
    } else {
      console.log("无法获取用户头像");
    }
  }

  // 加载图片并设置到 Sprite
  private loadImageToSprite(url: string) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // 确保跨域加载
    img.src = url;

    img.onload = () => {
      const imageAsset = new ImageAsset(img);
      const texture = new Texture2D();
      texture.image = imageAsset;

      this.avatarSprite.spriteFrame = SpriteFrame.createWithImage(texture);
    };

    img.onerror = () => {
      console.error("加载用户头像失败:", url);
    };
  }
}
