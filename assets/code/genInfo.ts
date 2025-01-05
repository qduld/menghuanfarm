import {
  _decorator,
  Component,
  Node,
  find,
  Label,
  assetManager,
  Texture2D,
  SpriteFrame,
  Sprite,
  ImageAsset,
  UITransform,
} from "cc";
import { blockList } from "./loadData";
import { httpRequest, proxyUrl } from "./http";
import { IUserInfo, IUagg } from "./interface";
import { GlobalData } from "./globalData";
import { Canvg } from "canvg";
import { RoundBox } from "./roundBox";
const { ccclass, property } = _decorator;

@ccclass("GenInfo")
export class GenInfo extends Component {
  @property
  UUserName: Node = null; // 用户名

  @property
  Upoints_balance: Node = null; // 金币数

  @property
  UAddition: Node = null; // 加成

  @property
  UHarvest: Node = null; // 我今日累计收取数量

  @property
  UStolenFrom: Node = null; // 我的今日收取好友数量

  @property
  UBeStolen: Node = null; // 我的今日被累计收取数量

  @property
  UAvatar: Node = null;

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
    this.Upoints_balance = find("MainCanvas/TopContent/Person/Money");
    this.UAddition = find("MainCanvas/TopContent/Person/Addition");

    this.UHarvest = find("MainCanvas/TopContent/Income/Mask/Section/Harvest");
    this.UStolenFrom = find(
      "MainCanvas/TopContent/Income/Mask/Section/StolenFrom"
    );
    this.UBeStolen = find("MainCanvas/TopContent/Income/Mask/Section/BeStolen");
    this.UAvatar = find("MainCanvas/TopContent/Avatar/RoundBox");
  }

  init() {
    if (GlobalData.getInstance().isStolen) {
      return;
    }
    this.requestUAgg();
    this.requestUserInfo();
  }

  async loadAvatarFromUrl(photoUrl: string) {
    try {
      // 下载 SVG 内容
      const response = await fetch(`${proxyUrl}?url=${photoUrl}`);
      const svgBlob = await response.blob();

      // 创建临时 Image 对象并加载 SVG
      const image = new Image();
      const blobUrl = URL.createObjectURL(svgBlob);
      image.src = blobUrl;

      image.onload = () => {
        // 创建 Cocos 的 ImageAsset
        const imgAsset = new ImageAsset(image);

        // 创建纹理并赋值
        const texture = new Texture2D();
        texture.image = imgAsset;

        // 创建 SpriteFrame 并赋值
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;

        if (this.UAvatar) {
          console.log(this.UAvatar);
          this.UAvatar.getComponent(UITransform).width = 90;
          this.UAvatar.getComponent(UITransform).height = 90;

          this.UAvatar.getComponent(RoundBox).spriteFrame = spriteFrame;
        }

        // 释放 Blob URL
        URL.revokeObjectURL(blobUrl);
      };

      image.onerror = (err) => {
        console.error("加载 SVG 图片失败：", err);
      };
    } catch (err) {
      console.error("代理请求失败：", err);
    }
  }

  updateUserInfo() {
    const globalData = GlobalData.getInstance();

    let userInfo = this.friendInfo ? this.friendInfo : globalData.userInfo;

    this.UUserName.getChildByName("Label").getComponent(Label).string =
      userInfo.tg_username;

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
    this.Upoints_balance.getChildByName("Label").getComponent(Label).string =
      userInfo.points_balance + "";
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
        this.loadAvatarFromUrl(globalData.userInfo.avatar);
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
      this.uagg.me_point_sum + "";
    this.UStolenFrom.getChildByName("Value").getComponent(Label).string =
      this.uagg.friend_point_sum + "";
    this.UBeStolen.getChildByName("Value").getComponent(Label).string =
      this.uagg.steal_point_sum + "";
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

  // 获取好友信息
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
        this.loadAvatarFromUrl(this.friendInfo.avatar);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
