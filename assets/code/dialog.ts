import {
  _decorator,
  Component,
  Node,
  find,
  EventTouch,
  resources,
  AudioClip,
  AudioSource,
  Label,
} from "cc";
import { GenBag } from "./genBag";
import { GenShop } from "./genShop";
import { IFarmland, ISeed } from "./interface";
import { AudioMgr } from "./audioManager";
import { GlobalData } from "./globalData";

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
  settingBox: Node = null; // settingBox

  @property(Node)
  quitCircleBox: Node = null; // settingBox

  @property(Node)
  paymentMethodBox: Node = null; // PaymentMethodBox

  @property(Node)
  editNameBox: Node = null; // EditNameBox

  @property(Node)
  shareLinkBox: Node = null; // ShareLinkBox

  @property(Node)
  noticeListBox: Node = null; // noticeListBox

  @property(Node)
  noticeDetailBox: Node = null; // noticeDetailBox

  @property(Node)
  seedUnlockBox: Node = null; // seedUnlockBox

  @property(Node)
  buySucceededBox: Node = null; // buySucceededBox

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
    this.settingBox = find("popBox/Canvas/Setting");
    this.quitCircleBox = find("popBox/Canvas/QuitCircle");
    this.paymentMethodBox = find("popBox/Canvas/PaymentMethod");
    this.editNameBox = find("popBox/Canvas/EditName");
    this.shareLinkBox = find("popBox/Canvas/ShareLink");
    this.noticeListBox = find("popBox/Canvas/NoticeList");
    this.noticeDetailBox = find("popBox/Canvas/NoticeDetail");
    this.seedUnlockBox = find("popBox/Canvas/SeedUnlock");
    this.buySucceededBox = find("popBox/Canvas/BuySucceeded");
    this.overlayMask = find("popBox/Canvas/OverlayMask");

    this.bagBox ? (this.bagBox.active = false) : "";
    this.shopBox ? (this.shopBox.active = false) : "";
    this.lockBlockBox ? (this.lockBlockBox.active = false) : "";
    this.buySeedBox ? (this.buySeedBox.active = false) : "";
    this.buyPropsBox ? (this.buyPropsBox.active = false) : "";
    this.buyCoinsBox ? (this.buyCoinsBox.active = false) : "";
    this.createCircleBox ? (this.createCircleBox.active = false) : "";
    this.settingBox ? (this.settingBox.active = false) : "";
    this.quitCircleBox ? (this.quitCircleBox.active = false) : "";
    this.paymentMethodBox ? (this.paymentMethodBox.active = false) : "";
    this.editNameBox ? (this.editNameBox.active = false) : "";
    this.shareLinkBox ? (this.shareLinkBox.active = false) : "";
    this.noticeListBox ? (this.noticeListBox.active = false) : "";
    this.noticeDetailBox ? (this.noticeDetailBox.active = false) : "";
    this.buySucceededBox ? (this.buySucceededBox.active = false) : "";
    this.seedUnlockBox ? (this.seedUnlockBox.active = false) : "";

    this.overlayMask.active = false;
  }
  showDialog(event: EventTouch, customData) {
    switch (customData) {
      case "Bag":
        this.bagBox.active = true;
        AudioMgr.inst.playOneShot("sounds/openBag", 1);
        const genBag = GenBag.getInstance();
        genBag.requestPackageList();
        break;
      case "Shop":
        this.shopBox.active = true;
        AudioMgr.inst.playOneShot("sounds/openBag", 1);
        const genShop = GenShop.getInstance();
        genShop.requestShopList();
        break;
      case "LockBlock":
        this.lockBlockBox.active = true;
        break;
      case "BuySeed":
        this.overlayMask.setSiblingIndex(3);
        this.buySeedBox.active = true;
        break;
      case "BuyProps":
        this.buyPropsBox.active = true;
        break;
      case "BuyCoins":
        this.lockBlockBox.active = false;
        this.buyCoinsBox.active = true;
        break;
      case "CreateCircle":
        this.createCircleBox.active = true;
        break;
      case "Setting":
        this.settingBox.active = true;
        break;
      case "QuitCircle":
        this.quitCircleBox.active = true;
        break;
      case "PaymentMethod":
        this.overlayMask.setSiblingIndex(9);
        this.paymentMethodBox.active = true;
        break;
      case "EditName":
        this.editNameBox.active = true;
        break;
      case "ShareLink":
        this.shareLinkBox.active = true;
        break;
      case "NoticeList":
        this.noticeListBox.active = true;
        break;
      case "NoticeDetail":
        this.noticeDetailBox.active = true;
        this.overlayMask.setSiblingIndex(11);
        break;
      case "SeedUnlock":
        this.seedUnlockBox.active = true;
        this.overlayMask.setSiblingIndex(12);
        break;
      case "BuySucceeded":
        this.buySucceededBox.active = true;
        this.overlayMask.setSiblingIndex(2);
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
        this.overlayMask.setSiblingIndex(1);
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
      case "Setting":
        this.settingBox.active = false;
        this.overlayMask.active = false;
        break;
      case "QuitCircle":
        this.quitCircleBox.active = false;
        this.overlayMask.active = false;
        break;
      case "PaymentMethod":
        this.overlayMask.setSiblingIndex(1);
        this.paymentMethodBox.active = false;
        this.overlayMask.active = false;
        break;
      case "EditName":
        this.editNameBox.active = false;
        this.overlayMask.active = false;
        break;
      case "ShareLink":
        this.shareLinkBox.active = false;
        this.overlayMask.active = false;
        break;
      case "NoticeList":
        this.noticeListBox.active = false;
        this.overlayMask.active = false;
        break;
      case "NoticeDetail":
        this.overlayMask.setSiblingIndex(1);
        this.noticeDetailBox.active = false;
        break;
      case "SeedUnlock":
        this.overlayMask.setSiblingIndex(1);
        this.seedUnlockBox.active = false;
        this.overlayMask.active = false;
        break;
      case "BuySucceeded":
        this.overlayMask.setSiblingIndex(1);
        this.buySucceededBox.active = false;
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
