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
  SpriteAtlas,
  Vec3,
} from "cc";
import { httpRequest } from "./http";
import { IMembersList, ISquadList, ISquadInfo, IUserInfo } from "./interface";
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

  @property
  isView: boolean = false;

  @property
  currentUser: IUserInfo = GlobalData.getInstance().userInfo;

  @property
  UCurrentUser: Node = null;

  @property
  UScrollView: Node = null;

  protected onLoad(): void {
    this.USquad = find("Canvas/UnJoined");
    this.UMembers = find("Canvas/Joined");
    this.USquadList = find("Canvas/UnJoined/Content/List");
    this.USquadSection = find("Canvas/UnJoined/Content/Section");
    this.UScrollView = find("Canvas/Joined/Content/ScrollView");
    this.UMembersList = find("Canvas/Joined/Content/ScrollView/view/content");
    this.UMembersSection = find(
      "Canvas/Joined/Content/ScrollView/view/content/Section"
    );
    this.USquadInfo = find("Canvas/Joined/Tips");
    this.UCurrentUser = find("Canvas/Joined/Content/CurrentUser");
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

      squadSection["squad"] = squad;
    });
  }

  updateCurrentUser() {
    const globalData = GlobalData.getInstance();

    const memberIndex = this.membersList.findIndex(
      (member) => member.id === globalData.userInfo.id + ""
    );

    this.UCurrentUser.active = true;

    this.UCurrentUser.getChildByName("Ranking").getComponent(Label).string =
      memberIndex + 1 + "";

    this.UCurrentUser.getChildByName("Name")
      .getChildByName("Label")
      .getComponent(Label).string = this.membersList[memberIndex].tgUsername;

    this.UCurrentUser.getChildByName("Money")
      .getChildByName("Label")
      .getComponent(Label).string =
      this.membersList[memberIndex].pointsBalance + "";

    if (this.membersList[memberIndex].isLeader) {
      this.UCurrentUser.getChildByName("Name").getChildByName("Icon").active =
        true;
    } else {
      this.UCurrentUser.getChildByName("Name").getChildByName("Icon").active =
        false;
    }
  }

  // 生成成员列表
  createMembersLayout() {
    const globalData = GlobalData.getInstance();
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UMembersSection.getComponent(UITransform).contentSize.height;

    // 未加入不显示当前用户
    this.UCurrentUser.active = !this.isView;

    // 未加入修改scrollview位置
    const position = new Vec3(0, -410, 0);
    if (this.isView) {
      position.y -= sectionHeight;
      this.UCurrentUser.active = false;
    } else {
      this.updateCurrentUser();
    }
    this.UScrollView.setPosition(position);

    // 计算起始点，以保证整个布局居中
    const startX = this.UMembersSection.position.x;
    const startY = this.UMembersSection.position.y;

    this.membersList.forEach((member, index) => {
      const posY = startY - index * (sectionHeight + this.memberSpacingY);

      let membersSection = instantiate(this.UMembersSection);
      this.UMembersList.addChild(membersSection);

      membersSection.active = true;
      membersSection.setPosition(startX, posY);
      membersSection
        .getChildByName("Name")
        .getChildByName("Label")
        .getComponent(Label).string = member.tgUsername + "";
      membersSection
        .getChildByName("Money")
        .getChildByName("Label")
        .getComponent(Label).string = member.pointsBalance + "";

      membersSection.getChildByName("Button")["userId"] = member.id;

      // 如果是队长显示图标
      if (member.isLeader) {
        membersSection.getChildByName("Name").getChildByName("Icon").active =
          true;
      } else {
        membersSection.getChildByName("Name").getChildByName("Icon").active =
          false;
      }

      // 可偷且不是自己显示偷取图标
      if (member.stealAvailable === 1 && member.id !== globalData.userInfo.id) {
        membersSection.getChildByName("Button").active = true;
      } else {
        membersSection.getChildByName("Button").active = false;
      }

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

        resources.load("iconList", SpriteAtlas, (err, atlas) => {
          if (err) {
            console.error("Failed to load sprite:", err);
            return;
          }

          membersSection.getChildByName("Ranking").active = false;

          membersSection
            .getChildByName("Icon")
            .getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(iconPath);
        });
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

    this.USquadInfo.getChildByName("Detail")
      .getChildByName("People")
      .getChildByName("Label")
      .getComponent(Label).string = this.squadInfo.memberCount + "";

    this.USquadInfo.getChildByName("Detail")
      .getChildByName("Money")
      .getChildByName("Label")
      .getComponent(Label).string = this.squadInfo.totalPoints + "";

    this.USquadInfo.getChildByName("Detail")
      .getChildByName("Timer")
      .getChildByName("Label")
      .getComponent(Label).string =
      formatTimestampToDate(this.squadInfo.createdAt) + "";
  }

  viewSquadDetail(event: Event) {
    const squadId = event.currentTarget["squad"].id;
    this.isView = true;
    this.UMembers.active = true;
    this.USquad.active = false;
    this.requestMembersList(squadId);
    this.requestSquadInfo(squadId);
  }

  // 推荐队伍
  async requestSquadList() {
    try {
      const response = await httpRequest("/api/v1/squad/list", {
        method: "GET",
      });
      if (response.ok) {
        this.squadList = response.data.data.list
          ? response.data.data.list
          : ([] as ISquadList[]);
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
  async requestMembersList(squadId?: number) {
    const globalData = GlobalData.getInstance();
    if (!squadId) {
      squadId = globalData.userInfo.squadId;
    }
    try {
      const response = await httpRequest(
        "/api/v1/squad/members",
        {
          method: "GET",
        },
        {
          squadId,
          pageNum: 1,
          pageSize: 10,
        }
      );
      if (response.ok) {
        this.membersList = response.data.data.list
          ? response.data.data.list
          : ([] as IMembersList[]);
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
  async requestSquadInfo(squadId?: number) {
    const globalData = GlobalData.getInstance();
    if (!squadId) {
      squadId = globalData.userInfo.squadId;
    }
    try {
      const response = await httpRequest(
        "/api/v1/squad/info",
        {
          method: "GET",
        },
        {
          squadId,
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
      "popBox/Canvas/CreateCircle/Name/EditBox/TEXT_LABEL"
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
