import { _decorator, Component, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RoundedCorner")
export class RoundedCorner extends Component {
  @property(Sprite)
  sprite: Sprite = null;

  start() {
    this.updateRadius(20.0); // 设置圆角半径为 20
  }

  /**
   * 更新材质的圆角半径
   * @param radius 圆角半径
   */
  updateRadius(radius: number) {
    const material = this.sprite.material as any; // 获取材质实例
    if (material) {
      material.setProperty("radius", radius); // 设置材质的 radius 属性
    }
  }
}
