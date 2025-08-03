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
    this.scrollView.vertical = true;
  }

  private onEditBoxEnd() {
    this.editBox.node.active = false; // 隐藏 EditBox
    this.isFocused = false;
    this.cursor.node.active = false; // 隐藏光标
    this.richText.node.active = true;
    this.labelPlaceholder.node.active = this.content.length === 0;
  }

  private onEditBoxChanged(editBox: EditBox) {
    this.content = editBox.string;
    this.labelPlaceholder.node.active = false;
    this.updateRichText();
  }

  private updateRichText() {
    if (this.content.length <= this.maxLength) {
      this.richText.string = this.content.replace(/\n/g, ""); // 移除所有换行符
      this.validText = this.richText.string;
      this.calculateTotalLinesByCanvas(this.richText.string, 530);
      return;
    }

    const validTextRaw = this.content.substring(0, this.maxLength);
    const overflowTextRaw = this.content.substring(this.maxLength);
    this.validText = validTextRaw.replace(/\n/g, "");
    const overflowText = overflowTextRaw.replace(/\n/g, "");

    const displayedText = `${this.validText}<color=#ff0000>${overflowText}</color>`;
    this.richText.string = displayedText;
    this.calculateTotalLinesByCanvas(displayedText, 530);

    this.scheduleOnce(() => {
      const textHeight = 45.1 * this.totalLines;
      this.richText.node
        .getComponent(UITransform)!
        .setContentSize(570, textHeight);
      this.richText.node.parent.getComponent(UITransform)!.height = Math.max(
        textHeight,
        this.scrollView.node.getComponent(UITransform)!.height
      );
      this.adjustScrollViewHeight();
    }, 0.1);

    this.updateCursor();
  }

  private calculateTotalLinesByCanvas(text: string, maxWidth: number): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("无法创建 CanvasRenderingContext2D");
      return 1;
    }
    ctx.font = `${this.richText.fontSize}px ${this.richText.fontFamily}`;
    let currentLineWidth = 0;
    let totalLines = 1;
    const plainText = this.extractPlainText(text);

    for (let i = 0; i < plainText.length; i++) {
      const char = plainText[i];
      const charWidth = ctx.measureText(char).width;
      currentLineWidth += charWidth;

      if (currentLineWidth > maxWidth) {
        totalLines++;
        currentLineWidth = charWidth;
      }
    }

    this.totalLines = totalLines;
  }

  private extractPlainText(richText: string): string {
    return richText.replace(/<[^>]+>/g, "");
  }

  private onEditBoxFocus() {
    this.labelPlaceholder.node.active = false;
  }

  private onFocus() {
    this.isFocused = true;
    this.cursor.node.active = true;
    this.startCursorBlink();
    this.richText.node.active = false;
    this.editBox.node.active = true;
    this.editBox.focus();

    this.scheduleOnce(() => {
      this.editBox.focus();
      this.scheduleOnce(() => {
        if (this.content.length > this.maxLength) {
          this.editBox.string = this.content;
          this.setEditBoxCursorPosition(this.maxLength);
        }
        this.scheduleOnce(() => {
          if (this.content.length > this.maxLength) {
            this.setEditBoxCursorPosition(this.maxLength);
          }
        }, 0.05);
      }, 0.05);
    }, 0.05);
  }

  private updateCursor() {
    const textHeight = this.richText.node.getComponent(UITransform).height;
    const lastLineWidth = this.calculateLastLineWidth(this.content);
    this.cursor.node.setPosition(lastLineWidth + 5, -textHeight / 2);
  }

  private calculateLastLineWidth(text: string): number {
    const lines = text.split("\n");
    const lastLine = lines[lines.length - 1];
    return Math.min(lastLine.length * 10, this.richText.maxWidth);
  }

  private startCursorBlink() {
    clearInterval(this.cursorInterval);
    this.cursorInterval = setInterval(() => {
      this.cursor.node.active = !this.cursor.node.active;
    }, 500);
  }

  private adjustScrollViewHeight() {
    const textHeight = 45.1 * this.totalLines;
    this.richText.node
      .getComponent(UITransform)!
      .setContentSize(570, textHeight);
    const contentTransform = this.scrollView.node
      .getChildByName("view")
      .getChildByName("content")
      .getComponent(UITransform);
    contentTransform.height = Math.max(
      textHeight + 20,
      this.scrollView.node.getComponent(UITransform).height
    );
  }

  private setEditBoxCursorPosition(position: number) {
    position = Math.min(position, this.content.length);
    this.editBox.string = this.content;

    const attemptSetCursor = (retryCount: number) => {
      setTimeout(() => {
        this.editBox.focus();
        const nativeInput = this.getNativeInput();
        if (
          nativeInput &&
          typeof nativeInput.setSelectionRange === "function"
        ) {
          nativeInput.value = this.content;
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
      }, 100 * (retryCount + 1));
    };

    attemptSetCursor(0);
  }

  private ensureCursorVisible(
    input: HTMLInputElement | HTMLTextAreaElement,
    position: number
  ) {
    if (typeof (input as any).scrollIntoViewIfNeeded === "function") {
      setTimeout(() => {
        (input as any).scrollIntoViewIfNeeded();
      }, 1000);
      return;
    }

    if (input.tagName === "TEXTAREA") {
      const textBeforeCursor = input.value.substring(0, position);
      const lines = textBeforeCursor.split("\n");
      const lineHeight = parseInt(getComputedStyle(input).lineHeight, 10) || 20;
      const verticalScroll = lines.length * lineHeight;
      input.scrollTop = verticalScroll - input.clientHeight / 2;
    }

    input.style.overflow = "hidden";
    requestAnimationFrame(() => {
      input.style.overflow = "";
    });
  }

  private getNativeInput(): HTMLInputElement | HTMLTextAreaElement | null {
    const editBoxNode = this.editBox.node;
    if (!editBoxNode || !editBoxNode.activeInHierarchy) {
      return null;
    }

    const editBoxImpl = (this.editBox as any)._impl;
    if (editBoxImpl && editBoxImpl._edTxt) {
      return editBoxImpl._edTxt;
    }

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
}
