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
  EditBox,
} from "cc";
import { httpRequest } from "./http";
import { IMembersList, ISquadList, ISquadInfo, IUserInfo } from "./interface";
import { squadList, i18n, squadSearchList } from "./loadData";
import { GlobalData } from "./globalData";
import { GenInfo } from "./genInfo";
import { Dialog } from "./dialog";
import { formatNumberShortDynamic, formatTimestampToDate } from "./utils";
import { ExpandNoticeWithArrow } from "./expandNoticeWithArrow";
import { InputHandler } from "./inputHandler";
import { initUtils } from "@telegram-apps/sdk";

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
  UEditButton: Node = null;

  @property
  squadSpacingY: number = 15; // 推荐间距

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

  @property(Node)
  USearchCircle: Node = null;

  @property(Node)
  UBatchAnother: Node = null;

  @property(Node)
  UCircleTitle: Node = null;

  @property(Node)
  USearchCircleTitle: Node = null;

  @property(Node)
  UCloseSearch: Node = null;

  @property(Node)
  USquadScrollView: Node = null;

  private isUpdateCircle: string = "false";
  private currentPage: number = 0;
  private hasMore: boolean = false;
  private isSearchMode: boolean = false;

  protected onLoad(): void {
    this.USquad = find("Canvas/UnJoined");
    this.UMembers = find("Canvas/Joined");
    this.USquadList = find("Canvas/UnJoined/Content/ScrollView/view/content");
    this.USquadSection = find(
      "Canvas/UnJoined/Content/ScrollView/view/content/Section"
    );
    this.UScrollView = find("Canvas/Joined/Content/ScrollView");
    this.UMembersList = find("Canvas/Joined/Content/ScrollView/view/content");
    this.UMembersSection = find(
      "Canvas/Joined/Content/ScrollView/view/content/Section"
    );
    this.USquadInfo = find("Canvas/Joined/Tips");
    this.UCurrentUser = find("Canvas/Joined/Content/CurrentUser");
    this.UEditButton = find("Canvas/Joined/Options/Edit");
    this.UCircleTitle = find("Canvas/UnJoined/Content/Title");
    this.USearchCircleTitle = find("Canvas/UnJoined/Content/SearchTitle");
    this.USearchCircle.getComponent(InputHandler).callback = this.searchCircle;
    this.USearchCircle.getComponent(InputHandler).callbackThis = this;
    this.USearchCircle.getComponent(InputHandler).onFocusEvent =
      this.switchSearchAndPatch;
    this.checkSquadList();
  }

  updateScrollViewHeight(sectionNum) {
    const scrollHeight = sectionNum * (120 + this.squadSpacingY) + 20;
    // this.USquadScrollView.getComponent(UITransform).height = scrollHeight;
    // this.USquadScrollView.getChildByName("scrollBar").getComponent(
    //   UITransform
    // ).height = scrollHeight;
    // this.USquadScrollView.getChildByName("view").getComponent(
    //   UITransform
    // ).height = scrollHeight;
    this.USquadScrollView.getChildByName("view")
      .getChildByName("content")
      .getComponent(UITransform).height = scrollHeight;
  }

  // 生成推荐列表
  createSquadLayout() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.USquadSection.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.USquadSection.position.x;
    const startY = this.USquadSection.position.y;

    if (this.isSearchMode) {
      this.updateScrollViewHeight(this.squadList.length);
    }

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
        .getComponent(Label).string = squad.member_count + "";
      squadSection.getChildByName("Name").getComponent(Label).string =
        squad.name;

      squadSection.getChildByName("Button")["squad_id"] = squad.id;

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

    this.UCurrentUser.getChildByName("Middle")
      .getChildByName("Name")
      .getChildByName("Label")
      .getComponent(Label).string = this.membersList[memberIndex].tg_username;

    this.UCurrentUser.getChildByName("Middle")
      .getChildByName("Money")
      .getChildByName("Label")
      .getComponent(Label).string =
      this.membersList[memberIndex].points_balance + "";

    if (this.membersList[memberIndex].is_leader) {
      this.UEditButton.active = true;
      this.UCurrentUser.getChildByName("Middle")
        .getChildByName("Name")
        .getChildByName("Icon").active = true;
    } else {
      this.UEditButton.active = false;
      this.UCurrentUser.getChildByName("Middle")
        .getChildByName("Name")
        .getChildByName("Icon").active = false;
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
        .getChildByName("Middle")
        .getChildByName("Name")
        .getChildByName("Label")
        .getComponent(Label).string = member.tg_username + "";
      membersSection
        .getChildByName("Middle")
        .getChildByName("Money")
        .getChildByName("Label")
        .getComponent(Label).string = member.points_balance + "";

      membersSection.getChildByName("Button")["userId"] = member.id;

      // 如果是队长显示图标
      if (member.is_leader) {
        membersSection
          .getChildByName("Middle")
          .getChildByName("Name")
          .getChildByName("Icon").active = true;
      } else {
        membersSection
          .getChildByName("Middle")
          .getChildByName("Name")
          .getChildByName("Icon").active = false;
      }

      // 可偷且不是自己显示偷取图标
      if (
        member.steal_available === 1 &&
        member.id !== globalData.userInfo.id
      ) {
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
    if (globalData.userInfo.squad_id === null) {
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
      .getComponent(Label).string = this.squadInfo.member_count + "";

    this.USquadInfo.getChildByName("Detail")
      .getChildByName("Money")
      .getChildByName("Label")
      .getComponent(Label).string =
      formatNumberShortDynamic(this.squadInfo.total_points) + "";

    this.USquadInfo.getChildByName("Detail")
      .getChildByName("Timer")
      .getChildByName("Label")
      .getComponent(Label).string =
      formatTimestampToDate(this.squadInfo.created_at) + "";

    this.USquadInfo.getChildByName("Bulletin")
      .getChildByName("Content")
      .getChildByName("Label")
      .getComponent(Label).string = this.squadInfo.notice
      ? this.squadInfo.notice
      : i18n.empty;

    this.USquadInfo.getComponent(ExpandNoticeWithArrow).updateContent();
  }

  viewSquadDetail(event: Event) {
    const squad_id = event.currentTarget["squad"].id;
    this.isView = true;
    this.UMembers.active = true;
    this.USquad.active = false;
    this.requestMembersList(squad_id);
    this.requestSquadInfo(squad_id);
  }

  switchUpdateCircleFlag(event, flag: string) {
    this.isUpdateCircle = flag;

    const dialog = Dialog.getInstance();

    if (flag === "false") {
      dialog.createCircleBox.getChildByName("UpdateMode").active = false;
      dialog.createCircleBox.getChildByName("CreateMode").active = true;
    } else {
      dialog.createCircleBox.getChildByName("UpdateMode").active = true;
      dialog.createCircleBox.getChildByName("CreateMode").active = false;
    }

    dialog.showDialog(null, "CreateCircle");
  }

  squadDialogConfirm(event) {
    if (this.isUpdateCircle === "true") {
      const criclesName = find(
        "popBox/Canvas/CreateCircle/UpdateMode/Name/EditBox/TEXT_LABEL"
      ).getComponent(Label).string;

      const criclesNotice = find(
        "popBox/Canvas/CreateCircle/UpdateMode/Notice/EditBox/TEXT_LABEL"
      ).getComponent(Label).string;

      this.requestUpdateSquadInfo({
        name: criclesName,
        notice: criclesNotice,
      });
    } else {
      const criclesName = find(
        "popBox/Canvas/CreateCircle/CreateMode/Name/EditBox/TEXT_LABEL"
      ).getComponent(Label).string;

      this.createSquad(criclesName);
    }
  }

  anotherBatchSquad() {
    if (this.hasMore) {
      this.currentPage++;
    } else {
      this.currentPage = 0;
    }
    this.requestSquadList();
  }

  // 推荐队伍
  async requestSquadList() {
    try {
      const response = await httpRequest(
        "/api/v1/squad/list",
        {
          method: "GET",
        },
        {
          current: this.currentPage,
          page_size: 5,
        }
      );
      if (response.ok) {
        this.hasMore = response.data.data.has_more;
        // this.squadList = squadSearchList;
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
  async requestMembersList(squad_id?: number) {
    const globalData = GlobalData.getInstance();
    if (!squad_id) {
      squad_id = globalData.userInfo.squad_id;
    }
    try {
      const response = await httpRequest(
        "/api/v1/squad/members",
        {
          method: "GET",
        },
        {
          squad_id,
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
  async requestSquadInfo(squad_id?: number) {
    const globalData = GlobalData.getInstance();
    if (!squad_id) {
      squad_id = globalData.userInfo.squad_id;
    }
    try {
      const response = await httpRequest(
        "/api/v1/squad/info",
        {
          method: "GET",
        },
        {
          squad_id,
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

  // 更新队伍信息
  async requestUpdateSquadInfo(squadInfo: Pick<ISquadInfo, "notice" | "name">) {
    const globalData = GlobalData.getInstance();

    try {
      const response = await httpRequest("/api/v1/squad/update", {
        method: "POST",
        body: {
          squad_id: globalData.userInfo.squad_id,
          name: squadInfo.name,
          notice: squadInfo.notice,
        },
      });
      if (response.ok) {
        this.requestSquadInfo(globalData.userInfo.squad_id);
        const dialog = Dialog.getInstance();

        dialog.closeDialog(null, "CreateCircle");
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
          squad_id: globalData.userInfo.squad_id,
        },
      });
      if (response.ok) {
        const dialog = Dialog.getInstance();

        dialog.closeDialog(null, "QuitCircle");

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
          squad_id: event.currentTarget.squad_id,
        },
      });
      if (response.ok) {
        globalData.userInfo.squad_id = event.currentTarget.squad_id;
        this.UMembers.active = true;
        this.USquad.active = false;
        this.requestMembersList();
        this.requestSquadInfo();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  squadBtnClick(event, options) {
    const dialog = Dialog.getInstance();

    dialog.showDialog(null, options);
  }

  // 创建队伍
  async createSquad(criclesName) {
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
        globalData.userInfo.squad_id = response.data.data.id;
        this.UMembers.active = true;
        this.USquad.active = false;
        this.requestMembersList();
        this.requestSquadInfo();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  switchSearchAndPatch(event, mode) {
    this.isSearchMode = mode;
    if (this.isSearchMode === true) {
      this.USquadList.removeAllChildren();
      this.UBatchAnother.active = false;
      this.UCloseSearch.active = true;
      this.UCircleTitle.active = false;
      this.USearchCircleTitle.active = true;
      this.USearchCircleTitle.getComponent(Label).string = `0 search results`;
    } else {
      this.USearchCircleTitle.active = false;
      this.UBatchAnother.active = true;
      this.UCloseSearch.active = false;
      this.UCircleTitle.active = true;
      this.searchCircle("");
      this.USearchCircle.getChildByName("EditBox").getComponent(
        EditBox
      ).string = "";
    }
  }

  // 查询圈子
  async searchCircle(keyword: string) {
    if (!keyword) {
      this.currentPage = 0;
      this.isSearchMode = false;
      this.UBatchAnother.active = true;
      this.UCloseSearch.active = false;
      this.UCircleTitle.active = true;
      this.requestSquadList();
      return;
    }
    try {
      const response = await httpRequest(
        "/api/v1/squad/search",
        {
          method: "GET",
        },
        {
          keyword,
        }
      );
      let squadListLen = 0;
      if (response.ok) {
        this.squadList = response.data.data.data
          ? response.data.data.data
          : ([] as ISquadList[]);
        squadListLen = this.squadList.length;
        this.USquadList.removeAllChildren();
        this.USearchCircleTitle.active = true;
        this.createSquadLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
      this.USearchCircleTitle.getComponent(
        Label
      ).string = `${this.squadList} search results`;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  shareGame() {
    const utils = initUtils();

    const link = `https://t.me/MyBitFarmBot?start=startapp`;
    utils.shareURL(link, ``);
  }
}
