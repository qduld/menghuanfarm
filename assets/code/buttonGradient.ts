import {
  _decorator,
  Component,
  Sprite,
  Texture2D,
  SpriteFrame,
  Color,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ButtonGradient")
export class ButtonGradient extends Component {
  @property(Sprite)
  sprite: Sprite = null; // 按钮的 Sprite 组件

  @property({ type: Number, range: [0.1, 2.0], slide: true })
  gradientRange: number = 1.0; // 渐变范围：值越大，渐变更平缓

  @property({ type: Color })
  baseColor: Color = new Color(173, 255, 173, 255); // 基础颜色，默认浅绿色

  start() {
    this.createGradientMask();
  }

  createGradientMask() {
    if (!this.sprite) return;

    const width = 256; // 渐变纹理宽度
    const height = 256; // 渐变纹理高度
    const data = new Uint8Array(width * height * 4); // RGBA 数据

    // 填充渐变数据
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;

        // 计算透明度：从中间向两侧渐变
        const gradient =
          1.0 - Math.abs(((x / width - 0.5) * 2.0) / this.gradientRange);
        const alpha = Math.floor(gradient * 255);

        // 设置颜色 (RGBA)
        data[index] = this.baseColor.r; // R
        data[index + 1] = this.baseColor.g; // G
        data[index + 2] = this.baseColor.b; // B
        data[index + 3] = alpha; // A
      }
    }

    // 创建纹理
    const texture = new Texture2D();
    texture.reset({
      width,
      height,
      format: Texture2D.PixelFormat.RGBA8888,
    });
    texture.uploadData(data);

    // 创建 SpriteFrame 并设置到 Sprite 组件
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    this.sprite.spriteFrame = spriteFrame;
  }
}
