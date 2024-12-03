import {
  _decorator,
  Component,
  Sprite,
  Label,
  find,
  assetManager,
  SpriteFrame,
  Texture2D,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("UserAvatar")
export class UserAvatar extends Component {
  @property(Sprite)
  avatarSprite: Sprite = null!;

  start() {
    // this.showUserAvatar();
  }
  showUserAvatar() {
    // 假设您已经获得授权后重定向的 URL
    // let url = window.location.href; // 获取当前页面 URL

    // 使用 URLSearchParams 解析查询参数
    // let params = new URLSearchParams(url.split("?")[1]);

    // 获取 photo_url 参数并解码
    // let encodedPhotoUrl = params.get("photo_url"); // 获取 encoded photo_url
    // let decodedPhotoUrl = decodeURIComponent(encodedPhotoUrl); // 解码

    let photoUrl =
      "http://api.telegram.org/file/bot7360724156:AAGeBGUrfDuRRYTkL-G4ZWKmi3rIKWH05VU/photos/file_4.jpg";
    console.log(photoUrl, "photoUrl");
    // const UInitData = find("MainCanvas/TopContent/Avatar/Picture/Label");

    let sprite = this.avatarSprite.getComponent(Sprite);

    // 加载头像图片并设置为 Sprite 的纹理
    assetManager.loadRemote(photoUrl, (err, imageAsset) => {
      if (err) {
        console.error("头像加载失败", err);
        return;
      }

      const texture = new Texture2D();
      texture.image = imageAsset;

      const spriteFrame = new SpriteFrame();
      spriteFrame.texture = texture as Texture2D;

      sprite.spriteFrame = spriteFrame;
    });

    // UInitData.getComponent(Label).string = initData.user.photoUrl;
  }
}
