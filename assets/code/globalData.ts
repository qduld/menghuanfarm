// GlobalData.ts
import { _decorator, Component, find, Label, Node } from "cc";
import { IUserInfo } from "./interface";
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
  bgmIsOn: boolean = true; //bgm正在播放

  private constructor() {
    super();
  }

  onLoad() {
    this.UMessage = find("MainCanvas/Message");
    this.UMessage.active = false;
  }

  static getInstance() {
    if (!GlobalData.instance) {
      GlobalData.instance = new GlobalData();
    }
    return GlobalData.instance;
  }

  isStolenUISwitch() {
    const income = find("MainCanvas/TopContent/Income");
    const slider = find("MainCanvas/TopContent/Slider");
    const moneyPlusCircle = find(
      "MainCanvas/TopContent/Person/Money/PlusCircle"
    );
    const addtionPlusCircle = find(
      "MainCanvas/TopContent/Person/Addition/PlusCircle"
    );
    const footer = find("MainCanvas/Footer");
    const footerStolen = find("MainCanvas/FooterStolen");

    income.active = false;
    slider.active = false;
    moneyPlusCircle.active = false;
    addtionPlusCircle.active = false;
    footer.active = false;
    footerStolen.active = true;
  }
  isNotStolenUISwitch() {
    const income = find("MainCanvas/TopContent/Income");
    const slider = find("MainCanvas/TopContent/Slider");
    const moneyPlusCircle = find(
      "MainCanvas/TopContent/Person/Money/PlusCircle"
    );
    const addtionPlusCircle = find(
      "MainCanvas/TopContent/Person/Addition/PlusCircle"
    );
    const footer = find("MainCanvas/Footer");
    const footerStolen = find("MainCanvas/FooterStolen");

    income.active = true;
    slider.active = true;
    moneyPlusCircle.active = true;
    addtionPlusCircle.active = true;
    footer.active = true;
    footerStolen.active = false;
  }
  setMessageLabel(message, timer = 2) {
    const UMessageFind = find("MainCanvas/Message");
    UMessageFind.active = true;
    UMessageFind.getChildByName("Label").getComponent(Label).string = message;

    setTimeout(() => {
      UMessageFind.active = false;
    }, timer * 1000);
  }
}
