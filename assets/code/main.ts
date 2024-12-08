import { _decorator, Component, Node, find, Sprite, Label, director } from "cc";
import { GenBlock } from "./genBlock";
import { GenInfo } from "./genInfo";
import { GenBag } from "./genBag";
import { GenShop } from "./genShop";

import { httpRequest } from "./http";
import { GlobalData } from "./globalData";

const { ccclass, property } = _decorator;
let userAvata: Node;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("main")
export class main extends Component {
  public static token: string | null = null;
  @property(Node)
  genBlock: GenBlock = new GenBlock(); // block实例

  protected onLoad(): void {
    const globalData = GlobalData.getInstance();
    if (globalData.isStolen) {
      this.init();
      return;
    }
    this.userLogin();
    director.preloadScene("circles");
    director.preloadScene("harvest");
  }
  async init() {
    const genInfo = GenInfo.getInstance();
    const genBlock = GenBlock.getInstance();

    genInfo.init();
    genBlock.init();
  }

  async userLogin() {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest("/api/v1/farm/u/login", {
        method: "POST",
      });
      if (response.ok) {
        globalData.isLogin = true;
        this.init();
      } else {
        globalData.isLogin = false;
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
