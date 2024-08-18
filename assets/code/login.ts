import { _decorator, Component, Node, director } from "cc";

const { ccclass, property } = _decorator;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("login")
export class main extends Component {
  public static addSalePackCount: number = 0;
  public static addPackCount: number = 0;
  public static saleBox: Node = null;
  // @property([Node])
  // fingerFlows
  start() {
    director.loadScene("login");
  }
}
