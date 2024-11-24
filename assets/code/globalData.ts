// GlobalData.ts
import { _decorator } from "cc";
import { IUserInfo } from "./interface";
const { ccclass, property } = _decorator;

@ccclass("GlobalData")
export class GlobalData {
  private static instance: GlobalData;

  @property
  userInfo: IUserInfo = null; // 用户信息

  @property
  token: string = "7360724156:AAGeBGUrfDuRRYTkL-G4ZWKmi3rIKWH05VU";

  private constructor() {}

  static getInstance() {
    if (!GlobalData.instance) {
      GlobalData.instance = new GlobalData();
    }
    return GlobalData.instance;
  }
}
