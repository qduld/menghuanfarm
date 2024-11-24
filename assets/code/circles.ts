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
import { IMembersList, ISquadList } from "./interface";
import { squadList, membersList } from "./loadData";
import { GlobalData } from "./globalData";

const { ccclass, property } = _decorator;
@ccclass("circles")
export class circles extends Component {
  @property
  squadList: ISquadList[] = []; // 推荐列表

  @property
  USquad: Node = null; // 推荐列表

  @property
  USquadList: Node = null; // 推荐列表

  @property
  USquadSection: Node = null; // 推荐列表

  @property
  membersList: IMembersList[] = []; // 成员列表

  @property
  UMembers: Node = null; // 推荐列表

  @property
  UMembersList: Node = null; // 成员列表UI

  @property
  UMembersSection: Node = null; // 成员列表Section

  @property
  squadSpacingY: number = 20; // 推荐间距

  @property
  memberSpacingY: number = 0; // 推荐间距

  protected onLoad(): void {
    this.USquad = find("Canvas/UnJoined");
    this.UMembers = find("Canvas/Joined");
    this.USquadList = find("Canvas/UnJoined/Content/List");
    this.USquadSection = find("Canvas/UnJoined/Content/Section");
    this.UMembersList = find("Canvas/Joined/Content/List");
    this.UMembersSection = find("Canvas/Joined/Content/Section");
    this.checkSquadList();
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

  // 生成成员列表
  createMembersLayout() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UMembersSection.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.UMembersSection.position.x;
    const startY = this.UMembersSection.position.y;

    this.membersList.forEach((member, index) => {
      const posY = startY - index * (sectionHeight + this.memberSpacingY);

      let membersSection = instantiate(this.UMembersSection);
      this.UMembersList.addChild(membersSection);

      membersSection.active = true;
      membersSection.setPosition(startX, posY);
      membersSection.getChildByName("Name").getComponent(Label).string =
        member.tgUsername + "";
      membersSection
        .getChildByName("Money")
        .getChildByName("Label")
        .getComponent(Label).string = member.pointsBalance + "";

      let iconPath = "";
      if (index >= 0 && index < 3) {
        if (index === 0) {
          iconPath = "first";
        }
        if (index === 1) {
          iconPath = "second";
        }
        if (index === 2) {
          iconPath = "third";
        }

        resources.load(
          iconPath + "/spriteFrame",
          SpriteFrame,
          (err, spriteFrame) => {
            if (err) {
              console.error("Failed to load sprite:", err);
              return;
            }

            membersSection.getChildByName("Ranking").active = false;

            membersSection
              .getChildByName("Icon")
              .getComponent(Sprite).spriteFrame = spriteFrame;
          }
        );
      } else {
        membersSection.getChildByName("Icon").active = false;
        membersSection.getChildByName("Ranking").active = true;

        membersSection.getChildByName("Ranking").getComponent(Label).string =
          index + 1 + "";
      }
    });
  }

  // 判断是否加入了组织
  checkSquadList() {
    const globalData = GlobalData.getInstance();

    if (globalData.userInfo.squadId === null) {
      this.UMembers.active = false;
      this.USquad.active = true;
      this.requestSquadList();
    } else {
      this.UMembers.active = true;
      this.USquad.active = false;
      this.requestMembersList();
    }
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

  // 获取队伍成员
  async requestMembersList() {
    const globalData = GlobalData.getInstance();

    try {
      const response = await httpRequest(
        "/api/v1/squad/members",
        {
          method: "GET",
        },
        {
          squadId: 1,
          pageNum: 1,
          pageSize: 10,
        }
      );
      if (response.ok) {
        this.membersList = response.data.list as IMembersList[];
        this.createMembersLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
