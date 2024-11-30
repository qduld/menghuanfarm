import { _decorator, Component, Node, find, Sprite, Label, director } from "cc";
import { Login } from "./login";
import { GenBlock } from "./genBlock";
import { httpRequest } from "./http";

const { ccclass, property } = _decorator;
let userAvata: Node;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("main")
export class main extends Component {
  public static token: string | null = null;
  @property(Node)
  genBlock: GenBlock = new GenBlock(); // block实例

  @property(Node)
  login: Login = new Login(); // block实例

  protected onLoad(): void {
    this.init();
    director.preloadScene("circles");
  }
  init() {
    //种子背包
    userAvata = find("MainCanvas/TopContent/Avatar/Picture");
  }
}
