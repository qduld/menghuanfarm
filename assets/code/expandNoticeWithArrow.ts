import {
  _decorator,
  Component,
  Node,
  tween,
  Vec3,
  Label,
  Sprite,
  UITransform,
} from "cc";
import { DrawRoundedRect } from "./drawRoundedRect";
const { ccclass, property } = _decorator;

@ccclass("ExpandNoticeWithArrow")
export class ExpandNoticeWithArrow extends Component {
  @property(Node)
  bgBorder: Node = null; // 背景

  @property(Node)
  mainContent: Node = null;

  @property(Node)
  content: Node = null; // 公告内容区域

  @property(Node)
  arrowButton: Node = null; // 下方的箭头按钮

  @property(Label)
  contentLabel: Label = null; // 公告文本

  private isExpanded: boolean = false; // 当前状态：是否展开
  private fullText: string = ""; // 完整公告内容
  private collapsedText: string = ""; // 收缩状态下的内容
  private initBgStartY: number = -1;
  private initBgHeight: number = -1;
  private initButtonStartY: number = -1;
  private initMainContentStartY: number = -1;

  onLoad() {
    // 初始化状态为收缩
    this.isExpanded = false;
    this.initBgStartY = this.bgBorder.position.y;
    this.initBgHeight = this.bgBorder.getComponent(UITransform).height;
    this.initMainContentStartY = this.mainContent.position.y;
    this.initButtonStartY = this.arrowButton.position.y;

    // 绑定箭头按钮的点击事件
    this.arrowButton.on(Node.EventType.TOUCH_END, this.toggleExpand, this);
    this.arrowButton.on(Node.EventType.MOUSE_DOWN, this.toggleExpand, this);
  }

  updateContent() {
    this.fullText = this.contentLabel.string;

    this.collapsedText = this.getCollapsedText(this.fullText, 2);
    this.setPanelState(false);
  }

  toggleExpand() {
    // 切换展开/收缩状态
    this.isExpanded = !this.isExpanded;

    // 更新面板状态
    this.setPanelState(this.isExpanded);
  }

  setPanelState(expanded: boolean) {
    if (expanded) {
      // 展开公告内容（调整 Content 的高度或缩放）
      // 显示完整公告文本
      this.contentLabel.string = this.fullText;

      this.scheduleOnce(() => {
        const movePosition =
          this.contentLabel.getComponent(UITransform).height - 50.4;

        this.bgBorder.getComponent(DrawRoundedRect).rectHeight =
          this.initBgHeight + movePosition;

        this.bgBorder.setPosition(
          this.bgBorder.position.x,
          this.initBgStartY - movePosition / 2
        );
        this.mainContent.setPosition(
          this.mainContent.position.x,
          this.mainContent.position.y - movePosition
        );

        this.arrowButton.setPosition(
          this.arrowButton.position.x,
          this.initButtonStartY - movePosition
        );

        this.bgBorder.getComponent(DrawRoundedRect).reRender();
      }, 0);

      // 设置箭头方向向上
      // 平滑旋转到 180 度
      const startEuler = this.arrowButton?.eulerAngles.clone();
      tween(startEuler)
        .to(0.3, new Vec3(0, 0, 180), {
          onUpdate: (value) => {
            if (this.arrowButton) {
              this.arrowButton.eulerAngles = value;
            }
          },
        })
        .start();
    } else {
      // 收缩公告内容（调整 Content 的高度或缩放）

      // 显示简短公告文本
      this.contentLabel.string = this.collapsedText;

      this.scheduleOnce(() => {
        this.bgBorder.getComponent(DrawRoundedRect).rectHeight =
          this.initBgHeight;

        this.bgBorder.setPosition(this.bgBorder.position.x, this.initBgStartY);

        this.mainContent.setPosition(
          this.mainContent.position.x,
          this.initMainContentStartY
        );

        this.arrowButton.setPosition(
          this.arrowButton.position.x,
          this.initButtonStartY
        );

        this.bgBorder.getComponent(DrawRoundedRect).reRender();
      }, 0);

      // 设置箭头方向向下
      // 平滑旋转到 180 度
      const startEuler = this.arrowButton?.eulerAngles.clone();
      tween(startEuler)
        .to(0.3, new Vec3(0, 0, 0), {
          onUpdate: (value) => {
            this.arrowButton.eulerAngles = value;
          },
        })
        .start();
    }
  }

  getCollapsedText(fullText: string, maxLines: number): string {
    // 根据最大行数截断文本，添加省略号
    const maxCharsPerLine = 25; // 假设每行最大字符数（根据实际 UI 调整）
    const maxChars = maxLines * maxCharsPerLine; // 计算总字符数限制
    if (fullText.length > maxChars) {
      return fullText.slice(0, maxChars) + "..."; // 截断并添加省略号
    }
    return fullText;
  }
}
