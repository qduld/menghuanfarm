import {
  _decorator,
  Component,
  find,
  instantiate,
  Label,
  Node,
  UITransform,
} from "cc";

import { httpRequest } from "./http";
import { GlobalData } from "./globalData";
import { noticeListData } from "./loadData";

const { ccclass, property } = _decorator;
@ccclass("noticeList")
export class noticeList extends Component {
  @property
  showNoticeList: Array<any> = null; // noticeList

  @property(Node)
  UNoticeListContent: Node = null; // noticeItem

  @property(Node)
  UNoticeItem: Node = null; // noticeItem

  @property(Number)
  noticeSpacingY: number = 35; // noticeItem

  protected onLoad(): void {
    this.init();
  }
  async init() {
    this.showNoticeList = noticeListData;
    this.createNoticeList();
  }

  createNoticeList() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UNoticeItem.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.UNoticeItem.position.x;
    const startY = this.UNoticeItem.position.y;

    this.showNoticeList.forEach((notice, index) => {
      const posY = startY - index * (sectionHeight + this.noticeSpacingY);

      let noticeSection = instantiate(this.UNoticeItem);
      this.UNoticeListContent.addChild(noticeSection);

      noticeSection.active = true;
      noticeSection.setPosition(startX, posY);

      noticeSection
        .getChildByName("Middle")
        .getChildByName("Title")
        .getComponent(Label).string = notice.title;

      noticeSection
        .getChildByName("Middle")
        .getChildByName("Content")
        .getComponent(Label).string = notice.content;
    });
  }
}
