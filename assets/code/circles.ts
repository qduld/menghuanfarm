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
  director,
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
import { LoadingUI } from "./loadingUI";
import { CustomInputBox } from "./customInputBox";

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
  UEditNameButton: Node = null;

  @property
  UQuitButton: Node = null;

  @property
  UEditNoticeButton: Node = null;

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

  @property(Node)
  UMemberScrollView: Node = null;

  @property
  shareLink: string = null;

  private isUpdateCircle: string = "false";
  private currentPage: number = 0;
  private hasMore: boolean = false;
  private isSearchMode: boolean = false;

  protected async onLoad() {
    const globalData = GlobalData.getInstance();
    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.show();

    this.USquad = find("Canvas/UnJoined");
    this.UMembers = find("Canvas/Joined");
    this.USquadList = find("Canvas/UnJoined/Content/ScrollView/view/content");
    this.USquadSection = find(
      "Canvas/UnJoined/Content/ScrollView/view/content/SquadSection"
    );
    this.UScrollView = find("Canvas/Joined/Content/ScrollView");
    this.UMembersList = find("Canvas/Joined/Content/ScrollView/view/content");
    this.UMembersSection = find(
      "Canvas/Joined/Content/ScrollView/view/content/MemberSection"
    );
    this.USquadInfo = find("Canvas/Joined/Tips");
    this.UCurrentUser = find("Canvas/Joined/Content/CurrentUser");
    this.UEditNameButton = find("Canvas/Joined/Tips/Top/Options/Edit");
    this.UQuitButton = find("Canvas/Joined/Tips/Top/Options/Quit");
    this.UEditNoticeButton = find("Canvas/Joined/Tips/Bulletin/Edit");
    this.UCircleTitle = find("Canvas/UnJoined/Content/Title");
    this.USearchCircleTitle = find("Canvas/UnJoined/Content/SearchTitle");
    this.USearchCircle.getComponent(InputHandler).callback = this.searchCircle;
    this.USearchCircle.getComponent(InputHandler).callbackThis = this;
    this.USearchCircle.getComponent(InputHandler).onFocusEvent =
      this.switchSearchAndPatch;
    await this.checkSquadList();

    globalData.shareLink = "https://t.me/WeFarmingBot/WeFarmingNow";
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
    if (!this.USquadSection) return;
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

      squadSection
        .getChildByName("Money")
        .getChildByName("Label")
        .getComponent(Label).string =
        formatNumberShortDynamic(squad.total_points) + "";

      squadSection
        .getChildByName("Timer")
        .getChildByName("Label")
        .getComponent(Label).string =
        formatTimestampToDate(squad.created_at) + "";
      squadSection.getChildByName("Name").getComponent(Label).string =
        squad.name + "";

      squadSection.getChildByName("Button")["squad_id"] = squad.id;
      squadSection["squad_id"] = squad.id;

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
      .getComponent(Label).string = this.membersList[memberIndex].nickname
      ? this.membersList[memberIndex].nickname
      : this.membersList[memberIndex].tg_username;

    this.UCurrentUser.getChildByName("Middle")
      .getChildByName("Money")
      .getChildByName("Label")
      .getComponent(Label).string =
      this.membersList[memberIndex].points_balance + "";

    if (this.membersList[memberIndex].is_leader) {
      this.UEditNameButton.active = true;
      this.UEditNoticeButton.active = true;
      this.UCurrentUser.getChildByName("Middle")
        .getChildByName("Name")
        .getChildByName("Icon").active = true;
    } else {
      this.UEditNameButton.active = false;
      this.UEditNoticeButton.active = false;
      this.UCurrentUser.getChildByName("Middle")
        .getChildByName("Name")
        .getChildByName("Icon").active = false;
    }
  }

  updateMemberScrollViewHeight(sectionNum) {
    const scrollHeight = sectionNum * 180;

    this.UMemberScrollView.getChildByName("view")
      .getChildByName("content")
      .getComponent(UITransform).height = scrollHeight;
  }

  // 生成成员列表
  createMembersLayout() {
    const globalData = GlobalData.getInstance();
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UMembersSection.getComponent(UITransform).contentSize.height;

    // 未加入不显示当前用户
    this.UCurrentUser.active = !this.isView;

    this.updateMemberScrollViewHeight(this.membersList.length + 1);

    // 未加入修改scrollview位置
    const position = new Vec3(0, -410, 0);
    if (this.isView) {
      position.y += sectionHeight;
      this.UCurrentUser.active = false;
      this.UEditNameButton.active = false;
      this.UEditNoticeButton.active = false;
      this.UQuitButton.active = false;
    } else {
      this.updateCurrentUser();
      this.UMembers.getChildByName("Footer").getChildByName("Share").active =
        true;
      this.UMembers.getChildByName("Footer").getChildByName("Join").active =
        false;
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
        .getComponent(Label).string = member.nickname
        ? member.nickname
        : member.tg_username + "";
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
        member.id !== globalData.userInfo.id &&
        !this.isView
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
  async checkSquadList() {
    const globalData = GlobalData.getInstance();

    this.UMembersList.removeAllChildren();
    if (globalData.userInfo.squad_id === null) {
      this.UMembers.active = false;
      this.USquad.active = true;
      await this.requestSquadList();
    } else {
      this.UMembers.active = true;
      this.USquad.active = false;
      await this.requestMembersList();
      await this.requestSquadInfo();
    }
  }

  updateSquadInfo() {
    this.USquadInfo.getChildByName("Top")
      .getChildByName("Name")
      .getComponent(Label).string = this.squadInfo.name;

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
    this.UQuitButton.active = false;
    this.UEditNameButton.active = false;
    this.UEditNoticeButton.active = false;
    this.UMembers.getChildByName("Footer").getChildByName("Share").active =
      false;
    this.UMembers.getChildByName("Footer").getChildByName("Join").active = true;
    this.requestMembersList(squad_id);
    this.requestSquadInfo(squad_id);
  }

  switchUpdateCircleFlag(event, flag: string) {
    this.isUpdateCircle = flag;

    const dialog = Dialog.getInstance();

    if (flag === "true") {
      dialog.createCircleBox
        .getChildByName("Name")
        .getChildByName("EditBox")
        .getComponent(EditBox).string = this.squadInfo.name;
    }
    dialog.showDialog(null, "CreateCircle");
  }

  squadDialogConfirm(event) {
    const criclesName = find(
      "popBox/Canvas/CreateCircle/Name/EditBox/TEXT_LABEL"
    ).getComponent(Label).string;

    if (this.isUpdateCircle === "true") {
      const criclesNotice = find(
        "popBox/Canvas/UpdateNotice/Notice/CustomInputBox"
      ).getComponent(CustomInputBox).validText;

      this.requestUpdateSquadInfo({
        name: criclesName,
        notice: criclesNotice,
      });
    } else {
      this.createSquad(criclesName);
    }
  }

  showNoticeDialog() {
    const dialog = Dialog.getInstance();

    dialog.updateNoticeBox
      .getChildByName("Notice")
      .getChildByName("CustomInputBox")
      .getChildByName("EditBox")
      .getComponent(EditBox).string = this.squadInfo.notice;

    if (this.squadInfo.notice) {
      dialog.updateNoticeBox
        .getChildByName("Notice")
        .getChildByName("CustomInputBox")
        .getComponent(CustomInputBox).labelPlaceholder.string = "";
    }
    dialog.updateNoticeBox
      .getChildByName("Notice")
      .getChildByName("CustomInputBox")
      .getComponent(CustomInputBox).richText.string = this.squadInfo.notice;

    dialog.showDialog(null, "UpdateNotice");
  }

  updateNoticeConfirm() {
    const criclesNotice = find(
      "popBox/Canvas/UpdateNotice/Notice/CustomInputBox"
    ).getComponent(CustomInputBox).validText;

    this.requestUpdateSquadInfo({
      name: this.squadInfo.name,
      notice: criclesNotice,
    });
  }

  anotherBatchSquad() {
    if (this.hasMore) {
      this.currentPage = this.currentPage + 5;
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
        if (this.USquadList) {
          this.USquadList.removeAllChildren();
        }
        this.createSquadLayout();

        const loadingUI = this.node.getComponent(LoadingUI);
        loadingUI.hide();
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

        const loadingUI = this.node.getComponent(LoadingUI);
        loadingUI.hide();
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
        const dialog = Dialog.getInstance();
        // if (response.data.code === 1003) {
        //   dialog.closeDialog(null, "CreateCircle");
        //   globalData.setTipsLabel(i18n.noticeLimit);
        //   return;
        // }
        this.requestSquadInfo(globalData.userInfo.squad_id);

        if (response.data.code !== 1001 && response.data.code !== 1003) {
          dialog.closeDialog(null, "CreateCircle");
          dialog.closeDialog(null, "UpdateNotice");
        }
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

  viewModeJoinSquad() {
    this.joinSquad(null, this.squadInfo.id);
  }

  // 加入队伍
  async joinSquad(event: EventTouch, squad_id) {
    const globalData = GlobalData.getInstance();
    const squadId = event?.currentTarget?.squad_id
      ? event?.currentTarget?.squad_id
      : squad_id;

    try {
      const response = await httpRequest("/api/v1/squad/join", {
        method: "POST",
        body: {
          squad_id: squadId,
        },
      });
      if (response.ok) {
        globalData.userInfo.squad_id = squadId;
        this.UMembers.active = true;
        this.USquad.active = false;
        if (this.isView) {
          globalData.setTipsLabel(i18n.joinedSucceed);
          this.isView = false;
          this.UQuitButton.active = true;
          this.UMembers.getChildByName("Footer").getChildByName(
            "Share"
          ).active = true;
          this.UMembers.getChildByName("Footer").getChildByName("Join").active =
            false;
        }
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
        globalData.userInfo.squad_id = response.data?.data?.id;
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
          current: this.currentPage + 1,
          page_size: 5,
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
      ).string = `${squadListLen} search results`;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  shareGame() {
    const utils = initUtils();
    const globalData = GlobalData.getInstance();

    utils.shareURL(
      globalData.shareLink,
      `Welcome to join my team and steal vegetables together!`
    );
  }
}
