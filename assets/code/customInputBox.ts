import {
  _decorator,
  Component,
  Node,
  RichText,
  Label,
  EditBox,
  Graphics,
  ScrollView,
  UITransform,
  Input,
  Vec2,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("CustomInputBox")
export class CustomInputBox extends Component {
  @property(RichText) richText: RichText = null!;
  @property(Node) placeHolder: RichText = null!;
  @property(Label) labelPlaceholder: Label = null!;
  @property(Graphics) cursor: Graphics = null!;
  @property(EditBox) editBox: EditBox = null!;
  @property(ScrollView) scrollView: ScrollView = null!;

  private content: string = "";
  private maxLength: number = 1000;
  private isFocused: boolean = false;
  private cursorInterval: number = 0;
  public validText: string = "";
  private totalLines: number = 0;

  onLoad() {
    // 设置 RichText 的父节点宽度
    const parentTransform =
      this.richText.node.parent?.getComponent(UITransform);
    if (parentTransform) {
      parentTransform.width = 570; // 限制最大宽度
    }

    // 确保 RichText 正确换行
    this.richText.maxWidth = 570;
    this.richText.lineHeight = 36; // 行高调整

    // 隐藏 EditBox 并监听输入事件
    this.editBox.node.active = false;
    this.editBox.string = "";
    this.editBox.node.on("text-changed", this.onEditBoxChanged, this);

    this.editBox.node.on("editing-did-ended", this.onEditBoxEnd, this);

    this.editBox.node.on("editing-did-began", this.onEditBoxFocus, this);

    // 监听点击事件
    this.node.on(Input.EventType.TOUCH_END, this.onFocus, this);
    this.setupRichText();
  }

  onDestroy() {
    clearInterval(this.cursorInterval);
    this.editBox.node.off("text-changed", this.onEditBoxChanged, this);
  }

  private setupRichText() {
    // this.richText.verticalAlign = 1; // 顶部对齐
    // this.richText.node.getComponent(UITransform)!.anchorY = 1;
    // this.richText.node.getComponent(UITransform)!.setContentSize(570, 1330);

    // 2. 确保 ScrollView 可以滚动
    this.scrollView.vertical = true;
    // this.scrollView.elastic = true;
  }

  // **输入完成后隐藏 EditBox**
  private onEditBoxEnd() {
    this.editBox.node.active = false; // 隐藏 EditBox
    this.isFocused = false;
    this.cursor.node.active = false; // 隐藏光标
    this.richText.node.active = true;
    if (this.richText.string) {
      this.labelPlaceholder.node.active = false;
    } else {
      this.labelPlaceholder.node.active = true;
    }
  }

  // 监听 EditBox 输入
  private onEditBoxChanged(editBox: EditBox) {
    this.content = editBox.string;
    this.labelPlaceholder.node.active = false;
    this.updateRichText();
  }

  // 更新 RichText 显示内容
  private updateRichText() {
    // 如果内容长度小于 maxLength，则直接显示全部内容
    if (this.content.length <= this.maxLength) {
      this.richText.string = this.content.replace(/\n/g, ""); // 移除所有换行符
      this.validText = this.richText.string;
      this.calculateTotalLinesByCanvas(this.richText.string, 530); // 计算总行数并更新 this.totalLines
      return;
    }

    // 截取有效文本和溢出文本
    const validTextRaw = this.content.substring(0, this.maxLength);
    const overflowTextRaw = this.content.substring(this.maxLength);

    // 移除所有换行符
    this.validText = validTextRaw.replace(/\n/g, "");
    const overflowText = overflowTextRaw.replace(/\n/g, "");

    // 拼接最终文本，白色部分 + 红色部分
    const displayedText = `${this.validText}<color=#ff0000>${overflowText}</color>`;

    this.richText.string = displayedText;
    this.calculateTotalLinesByCanvas(displayedText, 530); // 计算总行数并更新 this.totalLines

    // 更新 RichText 内容
    this.scheduleOnce(() => {
      let textHeight = 45.1 * this.totalLines;

      this.richText.node
        .getComponent(UITransform)!
        .setContentSize(570, textHeight);

      // **动态设置 content 高度**
      this.richText.node.parent.getComponent(UITransform)!.height = Math.max(
        textHeight,
        this.scrollView.node.getComponent(UITransform)!.height
      );

      // **滚动到底部**
      // this.scrollView.scrollToBottom(0.2);
    }, 0.1);

    // 显示或隐藏占位符
    this.labelPlaceholder.node.active = this.content.length === 0;

    // 更新光标
    this.updateCursor();

    // 适配 ScrollView
    this.adjustScrollViewHeight();

    // 滚动到底部
    // this.autoScrollToBottom();
  }

  /**
   * 计算总行数并更新 this.totalLines
   * @param text 当前显示的文本内容
   */
  private calculateTotalLinesByCanvas(text: string, maxWidth: number): number {
    // 创建一个临时的 CanvasRenderingContext2D 对象
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("无法创建 CanvasRenderingContext2D");
      return 1; // 默认返回 1 行
    }

    // 设置字体样式（根据 RichText 的实际样式调整）
    ctx.font = `${this.richText.fontSize}px ${this.richText.fontFamily}`;

    // 初始化变量
    let currentLineWidth = 0; // 当前行的宽度
    let totalLines = 1; // 总行数（至少有一行）

    // 解析富文本并提取纯文本内容
    const plainText = this.extractPlainText(text);

    // 遍历每个字符，模拟换行逻辑
    for (let i = 0; i < plainText.length; i++) {
      const char = plainText[i];

      // 测量当前字符的宽度
      const charWidth = ctx.measureText(char).width;

      // 累加当前行的宽度
      currentLineWidth += charWidth;

      // 如果超过最大宽度，触发换行
      if (currentLineWidth > maxWidth) {
        totalLines++;
        currentLineWidth = charWidth; // 重置当前行宽度
      }
    }

    console.log(`当前总行数: ${totalLines}`); // 打印总行数
    this.totalLines = totalLines;
  }

  /**
   * 提取富文本中的纯文本内容
   * @param richText 富文本字符串
   * @returns 纯文本内容
   */
  private extractPlainText(richText: string): string {
    // 使用正则表达式移除所有富文本标签
    return richText.replace(/<[^>]+>/g, "");
  }

  private onEditBoxFocus() {
    this.labelPlaceholder.node.active = false;
  }

  // 处理聚焦事件
  private onFocus() {
    this.isFocused = true;
    this.cursor.node.active = true;
    this.startCursorBlink();

    this.richText.node.active = false;
    // 显示 EditBox 让用户输入
    this.editBox.node.active = true;
    this.editBox.focus();

    // 三阶段同步策略
    this.scheduleOnce(() => {
      this.editBox.focus(); // 阶段1：获取焦点

      this.scheduleOnce(() => {
        // 阶段2：强制同步内容
        if (this.content.length > this.maxLength) {
          this.editBox.string = this.content; // 先更新内容
          this.setEditBoxCursorPosition(this.maxLength);
        }

        this.scheduleOnce(() => {
          // 阶段3：二次校准
          if (this.content.length > this.maxLength) {
            this.setEditBoxCursorPosition(this.maxLength);
          }
        }, 0.05);
      }, 0.05);
    }, 0.05);
  }

  // 更新光标位置
  private updateCursor() {
    const textHeight = this.richText.node.getComponent(UITransform).height;
    const lastLineWidth = this.calculateLastLineWidth(this.content);

    // 让光标位于最后一行末尾
    this.cursor.node.setPosition(lastLineWidth + 5, -textHeight / 2);
  }

  // 计算最后一行宽度
  private calculateLastLineWidth(text: string): number {
    const lines = text.split("\n");
    const lastLine = lines[lines.length - 1];

    // 假设每个字符宽度为 10px（根据实际情况调整）
    return Math.min(lastLine.length * 10, this.richText.maxWidth);
  }

  // 光标闪烁
  private startCursorBlink() {
    clearInterval(this.cursorInterval); // 清除上次定时器
    this.cursorInterval = setInterval(() => {
      this.cursor.node.active = !this.cursor.node.active;
    }, 500);
  }

  // **适配 ScrollView 高度**
  private adjustScrollViewHeight() {
    const textHeight = 45.1 * this.totalLines;

    this.richText.node
      .getComponent(UITransform)!
      .setContentSize(570, textHeight);

    const contentTransform = this.scrollView.node
      .getChildByName("view")
      .getChildByName("content")
      .getComponent(UITransform);

    // 设置最小高度，防止文本过短导致无法滚动
    contentTransform.height = Math.max(
      textHeight + 20,
      this.scrollView.node.getComponent(UITransform).height
    );
  }

  // **滚动到底部**
  private autoScrollToBottom() {
    this.scrollView.scrollToBottom(0.2);
  }

  /**
   * 获取当前 EditBox 的底层输入框实例
   * @returns 底层输入框实例（可能为 null）
   */
  private getNativeInput(): HTMLInputElement | HTMLTextAreaElement | null {
    const editBoxNode = this.editBox.node;
    if (!editBoxNode || !editBoxNode.activeInHierarchy) {
      return null;
    }

    // 尝试通过私有属性获取输入框
    const editBoxImpl = (this.editBox as any)._impl;
    if (editBoxImpl && editBoxImpl._edTxt) {
      return editBoxImpl._edTxt;
    }

    // 回退到全局查询
    const inputElements = document.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("input, textarea");
    for (const input of inputElements) {
      if (input === document.activeElement) {
        return input;
      }
    }

    return null;
  }

  private setEditBoxCursorPosition(position: number) {
    position = Math.min(position, this.content.length);
    this.editBox.string = this.content;

    // 使用递归重试机制确保操作成功
    const attemptSetCursor = (retryCount: number) => {
      setTimeout(() => {
        this.editBox.focus();

        const nativeInput = this.getNativeInput();
        if (
          nativeInput &&
          typeof nativeInput.setSelectionRange === "function"
        ) {
          nativeInput.value = this.content;

          // if (nativeInput.type !== "text") {
          //   nativeInput.type = "text";
          // }

          if (position > nativeInput.value.length) {
            position = nativeInput.value.length;
          }

          try {
            nativeInput.setSelectionRange(position, position);
            this.ensureCursorVisible(nativeInput, position);
            console.log(`Cursor set successfully at position: ${position}`);
          } catch (error) {
            if (retryCount < 3) {
              console.warn(`Retrying cursor set... Attempt ${retryCount + 1}`);
              attemptSetCursor(retryCount + 1);
            } else {
              console.error(
                "Failed to set cursor after multiple attempts:",
                error
              );
            }
          }
        }
      }, 100 * (retryCount + 1)); // 逐步增加延迟
    };

    attemptSetCursor(0); // 初始尝试
  }

  private ensureCursorVisible(
    input: HTMLInputElement | HTMLTextAreaElement,
    position: number
  ) {
    // 方法 1: 使用浏览器内置的 scrollIntoViewIfNeeded
    if (typeof (input as any).scrollIntoViewIfNeeded === "function") {
      setTimeout(() => {
        (input as any).scrollIntoViewIfNeeded();
      }, 1000);
      return;
    }

    // 方法 2: 手动计算滚动位置（针对多行文本）
    if (input.tagName === "TEXTAREA") {
      const textBeforeCursor = input.value.substring(0, position);
      const lines = textBeforeCursor.split("\n");
      const lineHeight = parseInt(getComputedStyle(input).lineHeight, 10) || 20;
      const verticalScroll = lines.length * lineHeight;
      input.scrollTop = verticalScroll - input.clientHeight / 2;
    }

    // 方法 3: 强制触发重新布局
    input.style.overflow = "hidden";
    requestAnimationFrame(() => {
      input.style.overflow = "";
    });
  }
}
