import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  UITransform,
  Label,
  sys,
} from "cc";
import { coinList } from "./loadData";
import { httpRequest } from "./http";
import { ICoinListItem } from "./interface";
import { Dialog } from "./dialog";
import { LoadingUI } from "./loadingUI";

const { ccclass, property } = _decorator;
@ccclass("BuyCoins")
export class BuyCoins extends Component {
  @property
  coinList: Array<ICoinListItem> = []; // Coin列表

  @property
  UCoinList: Node = null; // Coin列表

  @property
  UCoinSection: Node = null; // CoinSection

  @property
  coinSpacingY: number = 40; // CoinY间距

  @property
  coinSpacingX: number = 30; // CoinX间距

  private static _instance: BuyCoins;

  static getInstance(): BuyCoins {
    return BuyCoins._instance;
  }

  protected async onLoad() {
    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.show();

    BuyCoins._instance = this;
    this.coinSpacingY = 40;
    this.UCoinList = find("popBox/Canvas/BuyCoins/List");
    this.UCoinSection = find("popBox/Canvas/BuyCoins/Section");

    await this.buyCoinsList();
    loadingUI.hide();
  }

  // 生成推荐列表
  createBuyCoinsLayout() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UCoinSection.getComponent(UITransform).contentSize.height;
    const sectionWidth =
      this.UCoinSection.getComponent(UITransform).contentSize.width;

    // 计算起始点，以保证整个布局居中
    const startX = this.UCoinSection.position.x;
    const startY = this.UCoinSection.position.y;

    this.coinList.forEach((coin, index) => {
      const posY =
        startY - Math.floor(index / 3) * (sectionHeight + this.coinSpacingY);
      const posX = startX + (index % 3) * (sectionWidth + this.coinSpacingX);

      let coinSection = instantiate(this.UCoinSection);
      this.UCoinList.addChild(coinSection);

      coinSection.active = true;
      coinSection.setPosition(posX, posY);

      coinSection
        .getChildByName("Rebates")
        .getChildByName("Percent")
        .getComponent(Label).string = `${coin.discount}%`;

      coinSection
        .getChildByName("Coins")
        .getComponent(Label).string = `x${coin.points}`;

      coinSection.getChildByName("Button")["coinId"] = coin.id;

      coinSection
        .getChildByName("Button")
        .getChildByName("Label")
        .getComponent(Label).string = "$" + coin.price;
    });
  }

  // 积分列表
  async buyCoinsList() {
    try {
      const response = await httpRequest("/api/v1/shop/points", {
        method: "GET",
      });
      if (response.ok) {
        this.coinList = response.data.data as ICoinListItem[];
        this.createBuyCoinsLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 购买
  async buyCoins(event) {
    const dialog = Dialog.getInstance();
    try {
      const response = await httpRequest("/api/v1/shop/buy", {
        method: "POST",
        body: {
          id: event.currentTarget.coinId,
        },
      });
      if (response.ok) {
        dialog.showDialog(null, "PaymentMethod");
        if (response.data.data.star_url) {
          this.addClickEvent("Star", response.data.data.star_url);
        }
        if (response.data.data.tonkeeper_url) {
          this.addClickEvent("TONKeeper", response.data.data.tonkeeper_url);
        }
        if (response.data.data.tonhub_url) {
          this.addClickEvent("TONHub", response.data.data.tonhub_url);
        }
        // sys.openURL(response.data.data.tonkeeper_url);
        // tonhub_url ;
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  addClickEvent(name, url) {
    const dialog = Dialog.getInstance();
    dialog.paymentMethodBox
      .getChildByName(name)
      .on(Node.EventType.MOUSE_DOWN, () => sys.openURL(url), this);
    dialog.paymentMethodBox
      .getChildByName(name)
      .on(Node.EventType.TOUCH_END, () => sys.openURL(url), this);
  }
}
