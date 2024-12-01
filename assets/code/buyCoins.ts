import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  UITransform,
  Label,
} from "cc";
import { coinList } from "./loadData";

const { ccclass, property } = _decorator;
@ccclass("BuyCoins")
export class BuyCoins extends Component {
  @property
  coinList: Array<any> = []; // Coin列表

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

  protected onLoad(): void {
    BuyCoins._instance = this;
    this.coinSpacingY = 40;
    this.UCoinList = find("popBox/Canvas/BuyCoins/List");
    this.UCoinSection = find("popBox/Canvas/BuyCoins/Section");
    this.createBuyCoinsLayout();
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

    coinList.forEach((coin, index) => {
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
        .getComponent(Label).string = `${coin.rebates}%`;

      coinSection
        .getChildByName("Coins")
        .getComponent(Label).string = `x${coin.coins}`;

      coinSection
        .getChildByName("Button")
        .getChildByName("Label")
        .getComponent(Label).string = "$" + coin.money;
    });
  }
}
