import {
  _decorator,
  Component,
  Node,
  Label,
  UITransform,
  instantiate,
  resources,
  SpriteAtlas,
  Sprite,
} from "cc";
import { taskList, dayList, i18n } from "./loadData";
import { ITaskListItem } from "./interface";
import { GlobalData } from "./globalData";
import { httpRequest } from "./http";
import { LoadingUI } from "./loadingUI";

const { ccclass, property } = _decorator;
@ccclass("task")
export class task extends Component {
  @property(Node)
  UDayList: Node = null; // UDayList

  @property(Node)
  UDayItem: Node = null; // UDayItem

  @property(Number)
  daySpacingX: number = 35; // daySpacingX

  @property(Node)
  UTaskList: Node = null; // UTaskList

  @property(Node)
  UTaskItem: Node = null; // UTaskItem

  @property
  taskList: ITaskListItem[];

  @property(Number)
  taskSpacingY: number = 35; // taskSpacingY

  protected onLoad(): void {
    this.init();
  }
  async init() {
    this.createDayList();
    this.getTaskList();

    const loadingUI = this.UTaskList.getComponent(LoadingUI);
    loadingUI.show();
  }

  createDayList() {
    // 获取预制体的宽度和高度
    const sectionWidth =
      this.UDayItem.getComponent(UITransform).contentSize.width;

    // 计算起始点，以保证整个布局居中
    const startX = this.UDayItem.position.x;
    const startY = this.UDayItem.position.y;

    dayList.forEach((dayItem, index) => {
      const posX = startX + index * (sectionWidth + this.daySpacingX);

      let daySection = instantiate(this.UDayItem);
      this.UDayList.addChild(daySection);

      daySection.active = true;
      daySection.setPosition(posX, startY);

      daySection.getChildByName("Title").getComponent(Label).string =
        dayItem.title;

      var spritePath = "";
      var rewardContent = "";
      switch (dayItem.rewardType) {
        case 1:
          spritePath = "gold";
          rewardContent = "50";
          break;
        case 2:
          spritePath = "gold";
          rewardContent = "150";
          break;
        case 3:
          spritePath = "oneKeyHarvest";
          rewardContent = "";
          break;
        case 4:
          spritePath = "scarecrow";
          rewardContent = "";
          break;
        case 5:
          spritePath = "gold";
          rewardContent = "1000";
          break;
        case 6:
          spritePath = "gold";
          rewardContent = "+5%";
          break;
        default:
          spritePath = "gold";
          rewardContent = "50";
      }

      const showNumberList = [1, 2, 5, 6];
      resources.load("iconList", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        const spriteUITransform = daySection
          .getChildByName("Icon")
          .getComponent(Sprite)
          .getComponent(UITransform);

        if (
          showNumberList.findIndex((item) => item === dayItem.rewardType) !== -1
        ) {
          spriteUITransform.width = 40;
          spriteUITransform.height = 40;
          daySection.getChildByName("Icon").setPosition(-2, -4, 0);
          daySection.getChildByName("Number").active = true;
          daySection
            .getChildByName("Number")
            .getComponent(Label).string = `x${dayItem.reward}`;
        } else {
          daySection.getChildByName("Icon").setPosition(-2, -12, 0);
          spriteUITransform.width = 60;
          spriteUITransform.height = 60;
          daySection.getChildByName("Number").active = false;
        }
        daySection.getChildByName("Icon").getComponent(Sprite).spriteFrame =
          atlas.getSpriteFrame(spritePath);
      });
    });
  }

  createTaskList() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UTaskItem.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.UTaskItem.position.x;
    const startY = this.UTaskItem.position.y;

    this.taskList.forEach((taskItem, index) => {
      const posY = startY - index * (sectionHeight + this.taskSpacingY);

      let taskSection = instantiate(this.UTaskItem);
      this.UTaskList.addChild(taskSection);

      taskSection.active = true;
      taskSection.setPosition(startX, posY);

      taskSection
        .getChildByName("Content")
        .getChildByName("Left")
        .getChildByName("Title")
        .getComponent(Label).string = taskItem.task_type + "";

      const UProgressBar = taskSection
        .getChildByName("Content")
        .getChildByName("Left")
        .getChildByName("ProgressBar");

      const progressbarWidth =
        UProgressBar.getComponent(UITransform).contentSize.width;

      taskSection
        .getChildByName("Content")
        .getChildByName("Right")
        .getChildByName("Button")[`task_type`] = taskItem.task_type;

      UProgressBar.getChildByName("Label").getComponent(
        Label
      ).string = `${taskItem.progress}/${taskItem.target}`;

      UProgressBar.getChildByName("Bar")
        .getComponent(UITransform)
        .setContentSize(
          (progressbarWidth * Number(taskItem.progress)) /
            Number(taskItem.target),
          UProgressBar.getComponent(UITransform).contentSize.height
        );
    });
  }

  async checkIn() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest("/api/v1/task/checkin", {
        method: "POST",
      });
      if (response.ok) {
        if (response.data.code === 200) {
          globalData.setMessageLabel(i18n.checkInSuccess);
        }
      } else {
        globalData.setMessageLabel(i18n.todayChecked);
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      globalData.setMessageLabel(i18n.todayChecked);
      console.error("Error:", error);
    }
  }

  async getCheckInStatus() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest("/api/v1/task/checkin/status", {
        method: "GET",
      });
      if (response.ok) {
        globalData.setMessageLabel(i18n.checkInSuccess);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 获取任务列表
  async getTaskList() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest("/api/v1/task/list", {
        method: "GET",
      });
      if (response.ok) {
        const loadingUI = this.UTaskList.getComponent(LoadingUI);
        loadingUI.hide();

        this.taskList = response.data.data.tasks as ITaskListItem[];
        this.createTaskList();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 完成任务
  async completeTask(event) {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest(
        `/api/v1/task/complete?task_type=${event.target.task_type}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        globalData.setMessageLabel(i18n.taskCompleted);
      } else {
        globalData.setMessageLabel(i18n.taskUnCompleted);
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      globalData.setMessageLabel(i18n.taskUnCompleted);
      console.error("Error:", error);
    }
  }
}
