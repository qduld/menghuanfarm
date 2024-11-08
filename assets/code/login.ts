import {
  _decorator,
  Component,
  assetManager,
  SpriteFrame,
  resources,
  Texture2D,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Login")
export class Login extends Component {
  // 这里不再绑定 Sprite 组件，而是返回加载的头像数据
  loadUserAvatar(callback) {
    // 检查 Telegram WebApp API 是否可用
    debugger;
    if (typeof window.Telegram === "undefined" || !window.Telegram.WebApp) {
      console.warn("Telegram WebApp API 不可用");
      callback(null); // 返回空，表示加载失败
      return;
    }
    const avatarUrl = window.Telegram.WebApp.initDataUnsafe?.user?.photo_url;
    console.log(avatarUrl, "avatarUrl");
    if (avatarUrl) {
      if (avatarUrl.includes("spriteFrame")) {
        resources.load(avatarUrl, SpriteFrame, (err, spriteFrame) => {
          if (err) {
            console.error("加载本地头像图片失败:", err);
            callback(null); // 头像加载失败，返回空
            return;
          }

          callback(spriteFrame); // 返回加载完成的头像 SpriteFrame
        });
      }
      assetManager.loadRemote(avatarUrl, (err, imageAsset) => {
        if (err) {
          console.error("头像加载失败:", err);
          callback(null); // 头像加载失败，返回空
          return;
        }

        const texture = new Texture2D();
        texture.image = imageAsset;

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture as Texture2D;
        callback(spriteFrame); // 返回加载完成的头像 SpriteFrame
      });
    } else {
      console.log("用户头像不可用");
      callback(null); // 返回空，表示未找到头像
    }
  }
}
