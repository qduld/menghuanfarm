// GlobalData.ts
import { _decorator, Component, find, Label, Node, UITransform } from "cc";
import { IUserInfo } from "./interface";
import { DrawRoundedRect } from "./drawRoundedRect";
const { ccclass, property } = _decorator;

@ccclass("GlobalData")
export class GlobalData extends Component {
  private static instance: GlobalData;

  @property
  userInfo: IUserInfo = null; // 用户信息

  @property
  isLogin: Boolean = false; // 是否登录

  @property
  isStolen: Boolean = false; // 是偷取

  @property
  stolenId: Number = -1; // 是偷取

  @property
  UMessage: Node = null; //信息

  @property
  UTipsFind: Node = null;

  @property
  bgmIsOn: boolean = true; //bgm正在播放

  @property
  soundIsEnable: boolean = true; //SFX正在播放

  @property
  shareLink: string = null; //分享链接

  private constructor() {
    super();
  }

  onLoad() {
    this.UMessage = find("Canvas/Message");
    this.UMessage.active = false;
  }

  static getInstance() {
    if (!GlobalData.instance) {
      GlobalData.instance = new GlobalData();
    }
    return GlobalData.instance;
  }

  isStolenUISwitch() {
    const income = find("Canvas/TopContent/Income");
    const slider = find("Canvas/TopContent/Slider");
    const moneyPlusCircle = find("Canvas/TopContent/Person/Money/PlusCircle");
    const addtionPlusCircle = find(
      "Canvas/TopContent/Person/Addition/PlusCircle"
    );
    const footer = find("Canvas/Footer");
    const footerStolen = find("Canvas/FooterStolen");

    income.active = false;
    slider.active = false;
    moneyPlusCircle.active = false;
    addtionPlusCircle.active = false;
    footer.active = false;
    footerStolen.active = true;
  }
  isNotStolenUISwitch() {
    const income = find("Canvas/TopContent/Income");
    const slider = find("Canvas/TopContent/Slider");
    const moneyPlusCircle = find("Canvas/TopContent/Person/Money/PlusCircle");
    const addtionPlusCircle = find(
      "Canvas/TopContent/Person/Addition/PlusCircle"
    );
    const footer = find("Canvas/Footer");
    const footerStolen = find("Canvas/FooterStolen");

    income.active = true;
    slider.active = true;
    moneyPlusCircle.active = true;
    addtionPlusCircle.active = true;
    footer.active = true;
    footerStolen.active = false;
  }
  setMessageLabel(message, timer = 2) {
    const UMessageFind = find("Canvas/Message");
    UMessageFind.active = true;

    const label = UMessageFind.getChildByName("Label").getComponent(Label);
    label.string = message;

    this.scheduleOnce(() => {
      const bgBorder =
        UMessageFind.getChildByName("BgBorder").getComponent(DrawRoundedRect);
      bgBorder.rectHeight = label.getComponent(UITransform).height + 10;

      bgBorder.reRender();
    }, 0);

    setTimeout(() => {
      UMessageFind.active = false;
    }, timer * 1000);
  }
  setTipsLabel(tips, timer = 2) {
    const UTipsFind = find("popBox/Canvas/Tips");
    UTipsFind.active = true;
    UTipsFind.getChildByName("Label").getComponent(Label).string = tips;

    setTimeout(() => {
      UTipsFind.active = false;
    }, timer * 1000);
  }
}
