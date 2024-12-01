import { _decorator, Component, Node, find, EventTouch } from "cc";
import { Login } from "./login";
import { GenBag } from "./genBag";
import { GenShop } from "./genShop";
import { IFarmland, ISeed } from "./interface";

const { ccclass, property } = _decorator;
@ccclass("Dialog")
export class Dialog extends Component {
  @property(Node)
  bagBox: Node = null; // bag

  @property(Node)
  shopBox: Node = null; // shop

  @property(Node)
  lockBlockBox: Node = null; // lockBlock

  @property(Node)
  buySeedBox: Node = null; // buySeedBox

  @property(Node)
  buyPropsBox: Node = null; // buyPropsBox

  @property(Node)
  buyCoinsBox: Node = null; // buyCoinsBox

  @property(Node)
  createCircleBox: Node = null; // createCircleBox

  @property(Node)
  overlayMask: Node = null; // overlayMask

  @property
  targetBlock: Node = null; // 当前选中的土地

  @property
  targetBlockInfo: IFarmland = null; // 当前选中的土地

  @property
  targetSeedInfo: ISeed = null; // 当前选中的种子

  @property
  targetBuySeedInfo: ISeed = null; // 当前选中的种子

  private static _instance: Dialog;

  static getInstance(): Dialog {
    return Dialog._instance;
  }

  protected onLoad(): void {
    Dialog._instance = this;

    this.bagBox = find("popBox/Canvas/Bag");
    this.shopBox = find("popBox/Canvas/Shop");
    this.lockBlockBox = find("popBox/Canvas/LockBlock");
    this.buySeedBox = find("popBox/Canvas/BuySeed");
    this.buyPropsBox = find("popBox/Canvas/BuyProps");
    this.buyCoinsBox = find("popBox/Canvas/BuyCoins");
    this.createCircleBox = find("popBox/Canvas/CreateCircle");
    this.overlayMask = find("popBox/Canvas/OverlayMask");

    this.bagBox.active = false;
    this.shopBox.active = false;
    this.lockBlockBox.active = false;
    this.buySeedBox.active = false;
    this.buyPropsBox.active = false;
    this.buyCoinsBox.active = false;
    this.createCircleBox.active = false;
    this.overlayMask.active = false;
  }
  showDialog(event: EventTouch, customData) {
    switch (customData) {
      case "Bag":
        this.bagBox.active = true;
        const genBag = GenBag.getInstance();
        genBag.requestPackageList();
        break;
      case "Shop":
        this.shopBox.active = true;
        const genShop = GenShop.getInstance();
        genShop.requestShopList();
        break;
      case "LockBlock":
        this.lockBlockBox.active = true;
        break;
      case "BuySeed":
        this.buySeedBox.active = true;
        break;
      case "BuyProps":
        this.buyPropsBox.active = true;
        break;
      case "BuyCoins":
        this.buyCoinsBox.active = true;
        break;
      case "CreateCircle":
        this.createCircleBox.active = true;
        break;
    }
    this.overlayMask.active = true;
  }
  closeDialog(event: EventTouch, customData) {
    switch (customData) {
      case "Bag":
        this.bagBox.active = false;
        this.overlayMask.active = false;
        break;
      case "Shop":
        this.shopBox.active = false;
        this.overlayMask.active = false;
        break;
      case "LockBlock":
        this.lockBlockBox.active = false;
        this.overlayMask.active = false;
        break;
      case "BuySeed":
        this.buySeedBox.active = false;
        break;
      case "BuyProps":
        this.buyPropsBox.active = false;
        this.overlayMask.active = false;
        break;
      case "BuyCoins":
        this.buyCoinsBox.active = false;
        this.overlayMask.active = false;
        break;
      case "CreateCircle":
        this.createCircleBox.active = false;
        this.overlayMask.active = false;
        break;
    }
  }
  setTargetBlock(block, data) {
    this.targetBlock = block;
    this.targetBlockInfo = data;
  }
  setTargetSeed(data) {
    this.targetSeedInfo = data;
  }
  setTargetBuySeed(data) {
    this.targetBuySeedInfo = data;
  }
}
