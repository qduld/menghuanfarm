import { _decorator, Component, Label, UITransform, Node } from "cc";
import { DrawRoundedRect } from "./drawRoundedRect";

const { ccclass, property } = _decorator;

@ccclass("DynamicLabel")
export class DynamicLabel extends Component {
  @property(Label)
  label: Label | null = null;

  @property(DrawRoundedRect)
  roundedRect: DrawRoundedRect | null = null;

  @property(Node)
  prefixIcon: Node | null = null; // 前置图标节点

  @property(Node)
  suffixIcon: Node | null = null; // 后置图标节点

  @property
  padding: number = 10; // Label 和背景之间的边距

  @property
  iconSpacing: number = 5; // 图标和文本之间的间距

  /**
   * 更新背景和图标位置
   */
  updateBackground() {
    if (this.label && this.roundedRect) {
      const labelTransform = this.label.node.getComponent(UITransform);
      if (!labelTransform) return;

      let totalWidth = 0;
      let startX = 0;

      // 获取 Label 的宽度
      const labelWidth = labelTransform.width;

      // 添加 Label 宽度
      totalWidth += labelWidth;

      // 获取后置图标宽度
      if (this.suffixIcon) {
        const suffixTransform = this.suffixIcon.getComponent(UITransform);
        if (suffixTransform) {
          totalWidth += suffixTransform.width + this.iconSpacing;
        }
      }

      // 计算背景宽度
      this.roundedRect.rectWidth = totalWidth + this.padding * 2;

      // 调用 DrawRoundedRect 的 reRender 方法
      this.roundedRect.reRender(this.roundedRect.rectWidth);

      // 调整图标和 Label 的位置
      startX = 0; // 从左侧开始布局

      // 设置前置图标位置
      if (this.prefixIcon) {
        const prefixTransform = this.prefixIcon.getComponent(UITransform);
        if (prefixTransform) {
          startX += prefixTransform.width / 2 - this.iconSpacing;
        }
      }

      // 设置 Label 位置
      this.label.node.setPosition(
        startX + this.padding + this.roundedRect.borderWidth,
        0
      );
      startX += labelWidth + this.iconSpacing;

      // 设置后置图标位置
      if (this.suffixIcon) {
        const suffixTransform = this.suffixIcon.getComponent(UITransform);
        if (suffixTransform) {
          this.suffixIcon.setPosition(
            this.roundedRect.rectWidth - this.padding,
            0
          );
        }
      }
    }
  }

  /**
   * 更新 Label 的文本内容并刷新背景和图标布局
   * @param newText 新的文本内容
   */
  setText(newText: string) {
    if (this.label) {
      this.label.string = newText;

      // 等待下一帧让 Label 的宽高更新完毕后再调整布局
      this.scheduleOnce(() => {
        this.updateBackground();
      }, 0);
    }
  }
}
