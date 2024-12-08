import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  EventTouch,
} from "cc";
import { httpRequest } from "./http";
import { IMembersList, ISquadList, ISquadInfo } from "./interface";
import { squadList } from "./loadData";
import { GlobalData } from "./globalData";
import { GenInfo } from "./genInfo";
import { Dialog } from "./dialog";
import { formatTimestampToDate } from "./utils";

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
  squadInfo: ISquadInfo; // 推荐列表

  @property
  USquadInfo: Node = null; // 队伍信息

  @property
  UMembers: Node = null; // 推荐列表

  @property
  UMembersList: Node = null; // 成员列表UI

  @property
  UMembersSection: Node = null; // 成员列表Section

  @property
  squadSpacingY: number = 10; // 推荐间距

  @property
  memberSpacingY: number = 0; // 推荐间距

  protected onLoad(): void {
    this.USquad = find("Canvas/UnJoined");
    this.UMembers = find("Canvas/Joined");
    this.USquadList = find("Canvas/UnJoined/Content/List");
    this.USquadSection = find("Canvas/UnJoined/Content/Section");
    this.UMembersList = find("Canvas/Joined/Content/List");
    this.UMembersSection = find("Canvas/Joined/Content/Section");
    this.USquadInfo = find("Canvas/Joined/Tips");
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

    this.squadList.forEach((squad, index) => {
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

      squadSection.getChildByName("Button")["squadId"] = squad.id;
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

      membersSection.getChildByName("Button")["userId"] = member.id;

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

    this.UMembersList.removeAllChildren();
    if (globalData.userInfo.squadId === null) {
      this.UMembers.active = false;
      this.USquad.active = true;
      this.requestSquadList();
    } else {
      this.UMembers.active = true;
      this.USquad.active = false;
      this.requestMembersList();
      this.requestSquadInfo();
    }
  }

  updateSquadInfo() {
    this.USquadInfo.getChildByName("Name").getComponent(Label).string =
      this.squadInfo.name;

    this.USquadInfo.getChildByName("People")
      .getChildByName("Label")
      .getComponent(Label).string = this.squadInfo.memberCount + "";

    this.USquadInfo.getChildByName("Money")
      .getChildByName("Label")
      .getComponent(Label).string = this.squadInfo.totalPoints + "";

    this.USquadInfo.getChildByName("Timer")
      .getChildByName("Label")
      .getComponent(Label).string =
      formatTimestampToDate(this.squadInfo.createdAt) + "";
  }

  // 推荐队伍
  async requestSquadList() {
    try {
      const response = await httpRequest("/api/v1/squad/list", {
        method: "GET",
      });
      if (response.ok) {
        this.squadList = response.data.data.list as ISquadList[];
        this.USquadList.removeAllChildren();
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
          squadId: globalData.userInfo.squadId,
          pageNum: 1,
          pageSize: 10,
        }
      );
      if (response.ok) {
        this.membersList = response.data.data.list as IMembersList[];
        this.UMembersList.removeAllChildren();
        this.createMembersLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 获取队伍信息
  async requestSquadInfo() {
    const globalData = GlobalData.getInstance();

    try {
      const response = await httpRequest(
        "/api/v1/squad/info",
        {
          method: "GET",
        },
        {
          squadId: globalData.userInfo.squadId,
        }
      );
      if (response.ok) {
        this.squadInfo = response.data.data as ISquadInfo;
        this.updateSquadInfo();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 退出队伍
  async quitSquad() {
    const globalData = GlobalData.getInstance();

    try {
      const response = await httpRequest("/api/v1/squad/leave", {
        method: "POST",
        body: {
          squadId: globalData.userInfo.squadId,
        },
      });
      if (response.ok) {
        const genInfo = GenInfo.getInstance();
        genInfo.requestUserInfo();
        this.UMembers.active = false;
        this.USquad.active = true;
        this.UMembersList.removeAllChildren();
        this.requestSquadList();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 加入队伍
  async joinSquad(event: EventTouch) {
    const globalData = GlobalData.getInstance();

    try {
      const response = await httpRequest("/api/v1/squad/join", {
        method: "POST",
        body: {
          squadId: event.currentTarget.squadId,
        },
      });
      if (response.ok) {
        globalData.userInfo.squadId = event.currentTarget.squadId;
        this.UMembers.active = true;
        this.USquad.active = false;
        this.requestMembersList();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  createSquadBtnClick() {
    const dialog = Dialog.getInstance();

    dialog.showDialog(null, "CreateCircle");
  }

  // 创建队伍
  async createSquad(event: EventTouch) {
    const criclesName = find(
      "popBox/Canvas/CreateCircle/EditBox/TEXT_LABEL"
    ).getComponent(Label).string;
    console.log(criclesName);
    try {
      const response = await httpRequest("/api/v1/squad/create", {
        method: "POST",
        body: {
          name: criclesName,
        },
      });
      if (response.ok) {
        const dialog = Dialog.getInstance();

        dialog.closeDialog(null, "CreateCircle");
        const globalData = GlobalData.getInstance();
        globalData.userInfo.squadId = event.currentTarget.squadId;
        this.UMembers.active = true;
        this.USquad.active = false;
        this.requestMembersList();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
