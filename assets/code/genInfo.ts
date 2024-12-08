import { _decorator, Component, Node, find, Label, UITransform } from "cc";
import { blockList } from "./loadData";
import { httpRequest } from "./http";
import { ILogin, IUserInfo, IUagg } from "./interface";
import { GlobalData } from "./globalData";
import { DrawRoundedRect } from "./drawRoundedRect";
const { ccclass, property } = _decorator;

@ccclass("GenInfo")
export class GenInfo extends Component {
  @property
  UUserName: Node = null; // 用户名

  @property
  UPointsBalance: Node = null; // 金币数

  @property
  UAddition: Node = null; // 加成

  @property
  UHarvest: Node = null; // 我今日累计收取数量

  @property
  UStolenFrom: Node = null; // 我的今日收取好友数量

  @property
  UBeStolen: Node = null; // 我的今日被累计收取数量

  @property
  uagg: IUagg; // 今日收益统计

  @property
  friendInfo: IUserInfo = null; // 朋友信息

  private static _instance: GenInfo;

  static getInstance(): GenInfo {
    return GenInfo._instance;
  }

  onLoad() {
    GenInfo._instance = this;

    this.UUserName = find("MainCanvas/TopContent/Person/Name");
    this.UPointsBalance = find("MainCanvas/TopContent/Person/Money");
    this.UAddition = find("MainCanvas/TopContent/Person/Addition");

    this.UHarvest = find("MainCanvas/TopContent/Income/Mask/Section/Harvest");
    this.UStolenFrom = find(
      "MainCanvas/TopContent/Income/Mask/Section/StolenFrom"
    );
    this.UBeStolen = find("MainCanvas/TopContent/Income/Mask/Section/BeStolen");
  }

  init() {
    if (GlobalData.getInstance().isStolen) {
      return;
    }
    this.requestUAgg();
    this.requestUserInfo();
  }

  updateUserInfo() {
    const globalData = GlobalData.getInstance();

    let userInfo = this.friendInfo ? this.friendInfo : globalData.userInfo;

    this.UUserName.getChildByName("Label").getComponent(Label).string =
      userInfo.tgUsername;

    // this.UUserName.getChildByName("Label")
    //   .getComponent(Label)
    //   .updateRenderData(true);
    // const drawRoundedRect = this.UUserName.getChildByName(
    //   "Border"
    // ).getComponent("DrawRoundedRect") as DrawRoundedRect;
    // drawRoundedRect.reRender(
    //   this.UUserName.getChildByName("Label").getComponent(UITransform)
    //     .contentSize.width
    // );
    this.UPointsBalance.getChildByName("Label").getComponent(Label).string =
      userInfo.pointsBalance + "";
    this.UAddition.getChildByName("Label").getComponent(
      Label
    ).string = `+${userInfo.radio}%`;
  }

  // 获取用户信息
  async requestUserInfo() {
    try {
      const response = await httpRequest("/api/v1/farm/u/userInfo", {
        method: "GET",
      });
      if (response.ok) {
        const globalData = GlobalData.getInstance();
        globalData.userInfo = response.data.data as IUserInfo;
        this.friendInfo = null;
        this.updateUserInfo();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  updateUAgg() {
    this.UHarvest.getChildByName("Value").getComponent(Label).string =
      this.uagg.mePointSum + "";
    this.UStolenFrom.getChildByName("Value").getComponent(Label).string =
      this.uagg.friendPointSum + "";
    this.UBeStolen.getChildByName("Value").getComponent(Label).string =
      this.uagg.stealPointSum + "";
  }

  // 获取今日统计信息
  async requestUAgg() {
    try {
      const response = await httpRequest("/api/v1/farm/u/agg", {
        method: "GET",
      });
      if (response.ok) {
        this.uagg = response.data.data as IUagg;
        this.updateUAgg();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 获取好有信息
  async requestFriendInfo() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest(
        `/api/v1/farm/u/userInfo/${globalData.stolenId}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        this.friendInfo = response.data.data as IUserInfo;
        this.updateUserInfo();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
