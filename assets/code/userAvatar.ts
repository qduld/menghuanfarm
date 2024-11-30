import {
  _decorator,
  Component,
  Sprite,
  Texture2D,
  ImageAsset,
  Label,
  find,
} from "cc";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

const { ccclass, property } = _decorator;

@ccclass("UserAvatar")
export class UserAvatar extends Component {
  @property(Sprite)
  avatarSprite: Sprite = null!;

  start() {}
  showInitData() {
    const { initData } = retrieveLaunchParams();
    const UInitData = find("MainCanvas/TopContent/Avatar/Picture/Label");
    UInitData.getComponent(Label).string = initData.user.photoUrl;
  }
}
