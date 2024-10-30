import {
  _decorator,
  Component,
  Node,
  tween,
  CCInteger,
  Vec3,
  CCFloat,
  find,
  EventTouch,
  instantiate,
  Layers,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  director,
  Scene,
  sys,
  assetManager,
  AudioClip,
  AudioSource,
} from "cc";
import { paiHang, param, wechatAd, tokenMock } from "./loadData";
import { httpRequest } from "./http";
import { ISquadList } from "./interface";
import { squadList } from "./loadData";

const { ccclass, property } = _decorator;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("circles")
export class circles extends Component {
  @property
  squadList: ISquadList[] = []; // 推荐列表

  @property
  USquadList: Node = null; // 推荐列表

  @property
  USquadSection: Node = null; // 推荐列表

  @property
  squadSpacingY: number = 20; // 推荐间距

  protected onLoad(): void {
    this.requestSquadList();
    this.USquadList = find("Canvas/UnJoined/Content/List");
    this.USquadSection = find("Canvas/UnJoined/Content/Section");
  }

  // 生成推荐列表
  createSquadLayout() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.USquadSection.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.USquadSection.position.x;
    const startY = this.USquadSection.position.y;

    squadList.forEach((squad, index) => {
      const posY =
        startY - index * (sectionHeight + (this.squadSpacingY * 3) / 2);

      let squadSection = instantiate(this.USquadSection);
      this.USquadList.addChild(squadSection);

      squadSection.active = true;
      squadSection.setPosition(startX, posY);
      squadSection
        .getChildByName("People")
        .getChildByName("Label")
        .getComponent(Label).string = squad.memberCount + "";
      squadSection.getChildByName("Name").getComponent(Label).string =
        squad.name;
    });
  }

  // 推荐队伍
  async requestSquadList() {
    try {
      const response = await httpRequest("/api/v1/squad/list", {
        method: "GET",
      });
      if (response.ok) {
        this.squadList = response.data.data as ISquadList[];
        this.createSquadLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
