import {
  _decorator,
  Component,
  Node,
  Label,
  UITransform,
  instantiate,
} from "cc";
import { taskList, dayList } from "./loadData";

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

  @property(Number)
  taskSpacingY: number = 35; // taskSpacingY

  protected onLoad(): void {
    this.init();
  }
  async init() {
    this.createDayList();
    this.createTaskList();
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

      daySection
        .getChildByName("Number")
        .getComponent(Label).string = `x${dayItem.number}`;
    });
  }

  createTaskList() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UTaskItem.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.UTaskItem.position.x;
    const startY = this.UTaskItem.position.y;

    taskList.forEach((taskItem, index) => {
      const posY = startY - index * (sectionHeight + this.taskSpacingY);

      let taskSection = instantiate(this.UTaskItem);
      this.UTaskList.addChild(taskSection);

      taskSection.active = true;
      taskSection.setPosition(startX, posY);

      taskSection
        .getChildByName("Content")
        .getChildByName("Left")
        .getChildByName("Title")
        .getComponent(Label).string = taskItem.title;

      const UProgressBar = taskSection
        .getChildByName("Content")
        .getChildByName("Left")
        .getChildByName("ProgressBar");

      const progressbarWidth =
        UProgressBar.getComponent(UITransform).contentSize.width;

      UProgressBar.getChildByName("Label").getComponent(
        Label
      ).string = `${taskItem.current}/${taskItem.total}`;

      UProgressBar.getChildByName("Bar")
        .getComponent(UITransform)
        .setContentSize(
          (progressbarWidth * Number(taskItem.current)) /
            Number(taskItem.total),
          UProgressBar.getComponent(UITransform).contentSize.height
        );
    });
  }
}
