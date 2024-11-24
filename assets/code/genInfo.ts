import { _decorator, Component, Node, find, Label } from "cc";
import { blockList } from "./loadData";
import { httpRequest } from "./http";
import { IUserInfo, IUagg } from "./interface";
import { GlobalData } from "./globalData";
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
  onLoad() {
    this.requestUAgg();
    this.requestUserInfo();
    this.UUserName = find("MainCanvas/TopContent/Person/Name");
    this.UPointsBalance = find("MainCanvas/TopContent/Person/Money");
    this.UAddition = find("MainCanvas/TopContent/Person/Addition");

    this.UHarvest = find("MainCanvas/TopContent/Income/Mask/Section/Harvest");
    this.UStolenFrom = find(
      "MainCanvas/TopContent/Income/Mask/Section/StolenFrom"
    );
    this.UBeStolen = find("MainCanvas/TopContent/Income/Mask/Section/BeStolen");
  }

  updateUserInfo() {
    const globalData = GlobalData.getInstance();
    this.UUserName.getChildByName("Label").getComponent(Label).string =
      globalData.userInfo.tgUsername;
    this.UPointsBalance.getChildByName("Label").getComponent(Label).string =
      globalData.userInfo.pointsBalance + "";
    this.UAddition.getChildByName("Label").getComponent(
      Label
    ).string = `+${globalData.userInfo.radio}%`;
  }

  // 获取用户信息
  async requestUserInfo() {
    try {
      const response = await httpRequest("/farm/u/userInfo", {
        method: "GET",
      });
      if (response.ok) {
        const globalData = GlobalData.getInstance();
        globalData.userInfo = response.data.data as IUserInfo;
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
