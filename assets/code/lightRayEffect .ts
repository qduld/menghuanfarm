import { _decorator, Component, Graphics, math } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LightRayEffect")
export class LightRayEffect extends Component {
  @property
  lightCount = 24; // 光线的数量
  @property
  lightLength = 200; // 光线的长度
  @property
  rotationSpeed = 90; // 旋转速度（每秒旋转的度数）
  @property
  waveSpeed = 2; // 光源扩散的速度（越大越快）

  private graphics: Graphics | null = null;
  private time: number = 0; // 用于记录时间，控制波动效果

  onLoad() {
    // 获取或添加 Graphics 组件
    this.graphics = this.node.getComponent(Graphics);
    if (!this.graphics) {
      this.graphics = this.node.addComponent(Graphics);
    }
    // 设置绘制样式
    this.graphics.lineWidth = 1;

    // 启动定时器，控制光线旋转和光源扩散
    this.schedule(this.updateLightRays, 0.016); // 每帧调用一次，约为60fps
  }

  // 更新光线和光源扩散效果
  updateLightRays(dt: number) {
    this.time += dt; // 增加时间
    this.node.angle += this.rotationSpeed * dt; // 旋转光线
    this.drawLightRays(); // 绘制光线
  }

  // 绘制光线的函数
  drawLightRays() {
    if (!this.graphics) return;
    this.graphics.clear();

    const angleIncrement = 360 / this.lightCount; // 每条光线之间的角度间隔
    const segmentCount = 120; // 将每条光线分成 40 段

    for (let i = 0; i < this.lightCount; i++) {
      const angleStart = i * angleIncrement;
      const angleEnd = (i + 1) * angleIncrement;

      // 设置交替的颜色（淡黄色和暗灰色交替，且透明度渐变）
      const isLight = i % 2 === 0; // 偶数是淡黄色，奇数是暗灰色
      let colorStart: math.Color, colorEnd: math.Color;
      if (isLight) {
        colorStart = new math.Color(218, 218, 97, 128); // 圆心透明
        colorEnd = new math.Color(218, 218, 97, 0); // 边缘半透明
      } else {
        colorStart = new math.Color(120, 120, 120, 128); // 圆心透明
        colorEnd = new math.Color(120, 120, 120, 0); // 边缘半透明
      }

      // 使用线性插值绘制多边形，并添加波动效果
      for (let j = 0; j < segmentCount; j++) {
        const t = j / (segmentCount - 1); // t 范围从 0 到 1
        const alpha = colorStart.a + t * (colorEnd.a - colorStart.a);

        // 添加波动效果：通过正弦波函数调整透明度
        const waveFactor = Math.sin(
          this.time * this.waveSpeed + t * Math.PI * 2
        );
        const dynamicAlpha = Math.max(0, alpha * (1 + waveFactor * 0.5)); // 波动范围控制在 0 到 alpha 之间

        const color = new math.Color(
          colorStart.r + t * (colorEnd.r - colorStart.r),
          colorStart.g + t * (colorEnd.g - colorStart.g),
          colorStart.b + t * (colorEnd.b - colorStart.b),
          dynamicAlpha
        );

        const currentLength = this.lightLength * t; // 当前光线的长度

        // 计算起点和终点的角度
        const startAngle = math.toRadian(angleStart);
        const endAngle = math.toRadian(angleEnd);

        // 计算起点和终点的坐标
        const startX = currentLength * Math.cos(startAngle);
        const startY = currentLength * Math.sin(startAngle);
        const endX = currentLength * Math.cos(endAngle);
        const endY = currentLength * Math.sin(endAngle);

        // 开始绘制
        this.graphics.fillColor = color;
        this.graphics.moveTo(0, 0); // 移动到圆心
        this.graphics.lineTo(startX, startY); // 绘制到起点
        this.graphics.lineTo(endX, endY); // 绘制到终点
        this.graphics.lineTo(0, 0); // 回到圆心
        this.graphics.fill();
      }
    }
  }
}
