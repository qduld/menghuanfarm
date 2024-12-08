// GlobalData.ts
import { _decorator, find } from "cc";
import { IUserInfo } from "./interface";
const { ccclass, property } = _decorator;

@ccclass("GlobalData")
export class GlobalData {
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
  token: string = "7360724156:AAGeBGUrfDuRRYTkL-G4ZWKmi3rIKWH05VU";

  private constructor() {}

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
}
