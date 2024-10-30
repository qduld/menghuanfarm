import { _decorator, Component, Node, find, Label } from "cc";
import { blockList } from "./loadData";
import { httpRequest } from "./http";
import { IUserInfo, IUagg } from "./interface";
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
  userInfo: IUserInfo; // 用户信息

  @property
  uagg: IUagg; // 今日收益统计
  onLoad() {
    this.requestUAgg();
    this.requestUserInfo();
    this.UUserName = find("MainCanvas/Person/Canvas/Name");
    this.UPointsBalance = find("MainCanvas/Person/Canvas/Money");
    this.UAddition = find("MainCanvas/Person/Canvas/Addition");

    this.UHarvest = find("MainCanvas/Income/Canvas/Section/Harvest");
    this.UStolenFrom = find("MainCanvas/Income/Canvas/Section/StolenFrom");
    this.UBeStolen = find("MainCanvas/Income/Canvas/Section/BeStolen");
  }

  updateUserInfo() {
    this.UUserName.getChildByName("Label").getComponent(Label).string =
      this.userInfo.tgUsername;
    this.UPointsBalance.getChildByName("Label").getComponent(Label).string =
      this.userInfo.pointsBalance + "";
    this.UAddition.getChildByName("Label").getComponent(
      Label
    ).string = `+${this.userInfo.radio}%`;
  }

  // 获取用户信息
  async requestUserInfo() {
    try {
      const response = await httpRequest("/farm/u/userInfo", {
        method: "GET",
      });
      if (response.ok) {
        this.userInfo = response.data.data as IUserInfo;
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
      const response = await httpRequest("/farm/u/agg", {
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
}
