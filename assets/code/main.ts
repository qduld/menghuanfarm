import {
  _decorator,
  Component,
  Node,
  tween,
  CCInteger,
  Vec3,
  CCFloat,
  find,
  EventTouch,
  instantiate,
  Layers,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  director,
  Scene,
  sys,
  assetManager,
  AudioClip,
  AudioSource,
} from "cc";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { genPlant } from "./genPlant";
import { timer } from "./timer";
import { paiHang, param, wechatAd, tokenMock } from "./loadData";
import { httpRequest } from "./http";

const { ccclass, property } = _decorator;
let myPackBox: Node,
  mySaleBox: Node,
  storeBox: Node,
  paiHangBox: Node,
  msgBox: Node = null;
let userAvata: Node,
  nickName: Node,
  jinbi: Node = null;
let mainAd1,
  mainAd2,
  mainAd3 = null;
//0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗
@ccclass("main")
export class main extends Component {
  public static addSalePackCount: number = 0;
  public static addPackCount: number = 0;
  public static saleBox: Node = null;
  public static token: string | null = null;
  // @property([Node])
  // fingerFlows
  protected onLoad(): void {
    director.preloadScene("main");
    const windowLocal = window as any;

    if (windowLocal.Telegram && windowLocal.Telegram.WebApp) {
      windowLocal.Telegram.WebApp.onEvent("ready", () => {
        const initData = windowLocal.Telegram.WebApp.initData;
        console.log("Telegram WebApp initialized with initData:", initData);

        // 处理 initData 数据，执行你需要的逻辑
        // 假设 token 在 initData 中
        const token = this.parseTokenFromInitData(initData);
        if (token) {
          // 存储 token
          main.token = token;
          // 可选择使用 localStorage 存储
          sys.localStorage.setItem("token", token);
        } else {
          console.error("Token not found in initData.");
        }
      });
    } else {
      main.token = tokenMock;
      console.error("Telegram WebApp not found.");
    }
    this.requestFarmLand();
    // const { initDataRaw, initData } = retrieveLaunchParams();
    // console.log(initData);
    // console.log(initDataRaw);
    this.login();
  }

  // 假设 token 以某种方式存在于 initData 中，解析并返回 token
  private parseTokenFromInitData(initData: string): string | null {
    // 实际实现中你需要根据 initData 的格式解析 token
    // 例如，假设 initData 是一个 query string
    const params = new URLSearchParams(initData);
    return params.get("token");
  }
  start() {
    //手指跟随
    // const finger = find("MainCanvas/op/finger");
    // this.fingerFlows.forEach(item => {
    //     item.on(Node.EventType.TOUCH_END, function (event: EventTouch) {
    //         finger.parent.active = true;
    //         const position = item.getPosition();
    //         finger.setPosition(new Vec3(position.x + 30, position.y - 30, 0));
    //     }, this);
    // });
  }
  async requestFarmLand() {
    try {
      const response = await httpRequest("/api/v1/farmland", {
        method: "GET",
        headers: {
          Authorization: tokenMock,
        },
      });
      if (response.ok) {
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  // clickLoginBtn() {
  //   const btn = find("Canvas/btnClick");
  //   btn.getComponent(AudioSource).play();
  // }
  // clickBtn() {
  //   const btn = find("MainCanvas/btnClick");
  //   btn.getComponent(AudioSource).play();
  // }
  login() {
    // director.loadScene("main", () => {
    //游戏开始倒计时
    timer.isStart = true;
    this.init();
    nickName.getComponent(Label).string = param.nickname;
    resources.load(param.avata, SpriteFrame, (err, spriteFrame) => {
      userAvata.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
      userAvata.getComponent(Sprite).spriteFrame = spriteFrame;
    });
    jinbi.getComponent(Label).string = param.money.toString();
    timer.time = param.levelTime;
    if (sys.platform === sys.Platform.WECHAT_GAME) {
      if (mainAd1 !== null) {
        mainAd1.hide();
      }
      if (mainAd2 !== null) {
        mainAd2.hide();
      }
    }
    // });
  }
  //类型，索引
  static addSalePack(type: number) {
    let sale_item = new Node();
    //成熟果实仅仅可以售卖 只入包一次
    if (type === 10) {
      sale_item = instantiate(
        mySaleBox.getChildByName("items").getChildByName("fanqie_base")
      );
      sale_item.name = "fanqie";
    }
    if (type === 11) {
      sale_item = instantiate(
        mySaleBox.getChildByName("items").getChildByName("pingguo_base")
      );
      sale_item.name = "pingguo";
    }
    if (type === 12) {
      sale_item = instantiate(
        mySaleBox.getChildByName("items").getChildByName("qiezi_base")
      );
      sale_item.name = "qiezi";
    }
    if (type === 13) {
      sale_item = instantiate(
        mySaleBox.getChildByName("items").getChildByName("huluobo_base")
      );
      sale_item.name = "huluobo";
    }

    main.addSalePackCount++;
    sale_item.active = true;
    sale_item.layer = Layers.Enum.UI_2D;
    sale_item.setParent(mySaleBox);
    //果实背包只放一条记录，后期改成scrollview组件即可，多条的话会出现位置不对的bug
    sale_item.setPosition(-60, 271 - 189 * main.addSalePackCount, 0);
    mySaleBox.getChildByName("items").addChild(sale_item);
  }
  static addPack(type: number) {
    //动态添加背包
    //种子 仅仅可以种植
    let clone_item = new Node();
    if (type === 0) {
      clone_item = instantiate(
        myPackBox.getChildByName("items").getChildByName("fanqiezz_base")
      );
      clone_item.name = "fanqiezz";
    }
    if (type === 1) {
      clone_item = instantiate(
        myPackBox.getChildByName("items").getChildByName("pingguozz_base")
      );
      clone_item.name = "pingguozz";
    }
    if (type === 2) {
      clone_item = instantiate(
        myPackBox.getChildByName("items").getChildByName("qiezizz_base")
      );
      clone_item.name = "qiezizz";
    }
    if (type === 3) {
      clone_item = instantiate(
        myPackBox.getChildByName("items").getChildByName("huluobozz_base")
      );
      clone_item.name = "huluobozz";
    }
    main.addPackCount++;
    clone_item.active = true;
    clone_item.layer = Layers.Enum.UI_2D;
    clone_item.setParent(myPackBox);
    clone_item.setPosition(-60, 271 - 189 * main.addPackCount, 0);
    myPackBox.getChildByName("items").addChild(clone_item);
  }
  addPaiHang() {
    //动态添加排行榜
    paiHang.forEach((item, index) => {
      const clone_item = instantiate(paiHangBox.getChildByName("items"));
      clone_item.layer = Layers.Enum.UI_2D;
      clone_item.setParent(paiHangBox);
      clone_item.setPosition(0, 0 - clone_item.position.y - 240 * index, 0);
      const name = clone_item
        .getChildByName("box")
        .getChildByName("txtBox")
        .getChildByName("name");
      name.getComponent(Label).string = item.nickName;
      resources.load(
        item.top === 1
          ? "1/spriteFrame"
          : item.top === 2
          ? "2/spriteFrame"
          : "3/spriteFrame",
        SpriteFrame,
        (err, spriteFrame) => {
          const top = clone_item
            .getChildByName("box")
            .getChildByName("txtBox")
            .getChildByName("top");
          top.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
          top.getComponent(Sprite).spriteFrame = spriteFrame;
        }
      );
      resources.load(item.userAvata, SpriteFrame, (err, spriteFrame) => {
        const sp = clone_item
          .getChildByName("box")
          .getChildByName("txtBox")
          .getChildByName("pro");
        sp.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
        sp.getComponent(Sprite).spriteFrame = spriteFrame;
      });
      paiHangBox.addChild(clone_item);
    });
  }
  init() {
    //种子背包
    (myPackBox = find("MainCanvas/popBox/mypack")),
      //果实背包
      (mySaleBox = find("MainCanvas/popBox/mysalepack")),
      (storeBox = find("MainCanvas/popBox/store")),
      (paiHangBox = find("MainCanvas/popBox/paihang")),
      (msgBox = find("MainCanvas/popBox/msgBox"));

    (userAvata = find("MainCanvas/touxiangkuang/userAvata")),
      (nickName = find("MainCanvas/touxiangkuang/nickname")),
      (jinbi = find("MainCanvas/jinbi/boxbg/txt"));
    //默认添加胡萝卜到商店植物 胡萝卜最便宜
    genPlant._genPlant.addPlants({
      name: "huluobo",
      img: "huluobozz",
      chengshuImg: "huluobo",
    });

    main.saleBox = mySaleBox;
    main.addPackCount = 0;
    main.addSalePackCount = 0;
  }
  update(deltaTime: number) {}
  //弹窗
  showDialog(event: EventTouch) {
    switch (event.currentTarget.name) {
      case "package":
        myPackBox.active = true;
        if (sys.platform === sys.Platform.WECHAT_GAME) {
          //种子背包原生模板
          let mainAd8 = wx.createCustomAd({
            adUnitId: wechatAd[8].adid,
            style: {
              left: 50,
              top: 550,
              width: 650,
            },
            //自动刷新
            adIntervals: 30,
          });
          if (mainAd8 !== null) {
            // 用户触发广告后，显示激励视频广告
            mainAd8.show();
            mainAd8.onError((err) => {
              console.log(err);
            });
          }
        }
        break;
      case "package_guoshi":
        mySaleBox.active = true;
        if (sys.platform === sys.Platform.WECHAT_GAME) {
          if (mainAd2 !== null) {
            mainAd2.show();
            mainAd2.onError((err) => {
              console.log(err);
            });
          }
          //果实背包原生模板
          let mainAd9 = wx.createCustomAd({
            adUnitId: wechatAd[9].adid,
            style: {
              left: 50,
              top: 550,
              width: 650,
            },
            //自动刷新
            adIntervals: 30,
          });
          if (mainAd9 !== null) {
            // 用户触发广告后，显示激励视频广告
            mainAd9.show();
            mainAd9.onError((err) => {
              console.log(err);
            });
          }
        }
        break;
      case "zhishipai":
        storeBox.active = true;
        break;
      case "rongyaobang":
        this.addPaiHang();
        paiHangBox.active = true;
        break;
    }
  }
  closeDialog(event: EventTouch) {
    let type = event.currentTarget.parent.name + "_" + event.currentTarget.name;
    switch (type) {
      case "store_close":
        storeBox.active = false;
        break;
      case "mypack_close":
        myPackBox.active = false;
        break;
      case "mysalepack_close":
        mySaleBox.active = false;
      case "paihang_close":
        paiHangBox.active = false;
        break;
    }
  }
  //弹消息
  showMsg(msg: string) {
    const mg = msgBox.getChildByName("msgTxt").getComponent(Label);
    mg.string = msg;
    msgBox.active = true;
    this.scheduleOnce(function callback() {
      msgBox.active = false;
    }, 1);
  }
  //购买种子  进背包
  buyPlant(event: EventTouch) {
    //必须把种子背包的种子用完才可以购买种子
    const mySaleBoxItems = find("MainCanvas/popBox/mypack/items");
    if (mySaleBoxItems.children.length > 4) {
      this.showMsg("种子尚未使用完毕！");
      return;
    }

    const currentJinbi = parseInt(jinbi.getComponent(Label).string);
    let price = 0;
    if (event.currentTarget.parent.parent.name === "fanqiezz") {
      price = 300;
      if (currentJinbi - price <= 0) {
        this.showMsg("金币不足！");
        return;
      } else {
        if (main.addPackCount > 3) {
          this.showMsg("种子背包已满！");
          return;
        }
        let arrIndex = myPackBox
          .getChildByName("items")
          .children.findIndex((item) => {
            return item.name === "fanqiezz";
          });
        if (arrIndex > -1) {
          this.showMsg("已购买此种子！");
          return;
        }
        main.addPack(0);
        jinbi.getComponent(Label).string = (currentJinbi - price).toString();
        myPackBox.active = false;
        this.showMsg("购买成功！");
        return;
      }
    }
    if (event.currentTarget.parent.parent.name === "pingguozz") {
      price = 180;
      if (currentJinbi - price <= 0) {
        this.showMsg("金币不足！");
        return;
      } else {
        if (main.addPackCount > 3) {
          this.showMsg("种子背包已满！");
          return;
        }
        let arrIndex = myPackBox
          .getChildByName("items")
          .children.findIndex((item) => {
            return item.name === "pingguozz";
          });
        if (arrIndex > -1) {
          this.showMsg("已购买此种子！");
          return;
        }
        main.addPack(1);
        jinbi.getComponent(Label).string = (currentJinbi - price).toString();
        myPackBox.active = false;
        this.showMsg("购买成功！");
        return;
      }
    }
    if (event.currentTarget.parent.parent.name === "qiezizz") {
      price = 120;
      if (currentJinbi - price <= 0) {
        this.showMsg("金币不足！");
        return;
      } else {
        if (main.addPackCount > 3) {
          this.showMsg("种子背包已满！");
          return;
        }
        let arrIndex = myPackBox
          .getChildByName("items")
          .children.findIndex((item) => {
            return item.name === "qiezizz";
          });
        if (arrIndex > -1) {
          this.showMsg("已购买此种子！");
          return;
        }
        main.addPack(2);
        jinbi.getComponent(Label).string = (currentJinbi - price).toString();
        myPackBox.active = false;
        this.showMsg("购买成功！");
        return;
      }
    }
    if (event.currentTarget.parent.parent.name === "huluobozz") {
      price = 60;
      if (currentJinbi - price <= 0) {
        this.showMsg("金币不足！");
        return;
      } else {
        if (main.addPackCount > 3) {
          this.showMsg("种子背包已满！");
          return;
        }
        let arrIndex = myPackBox
          .getChildByName("items")
          .children.findIndex((item) => {
            return item.name === "huluobozz";
          });
        if (arrIndex > -1) {
          this.showMsg("已购买此种子！");
          return;
        }
        main.addPack(3);
        jinbi.getComponent(Label).string = (currentJinbi - price).toString();
        myPackBox.active = false;
        this.showMsg("购买成功！");
        return;
      }
    }
  }
  removePack(type: number) {
    //种子播种 减去背包
    if (type === 0) {
      myPackBox.getChildByName("items").getChildByName("fanqiezz").destroy();
      myPackBox.getChildByName("items").getChildByName("fanqiezz_base").active =
        false;
    }
    if (type === 1) {
      myPackBox.getChildByName("items").getChildByName("pingguozz").destroy();
      myPackBox
        .getChildByName("items")
        .getChildByName("pingguozz_base").active = false;
    }
    if (type === 2) {
      myPackBox.getChildByName("items").getChildByName("qiezizz").destroy();
      myPackBox.getChildByName("items").getChildByName("qiezizz_base").active =
        false;
    }
    if (type === 3) {
      myPackBox.getChildByName("items").getChildByName("huluobozz").destroy();
      myPackBox
        .getChildByName("items")
        .getChildByName("huluobozz_base").active = false;
    }
    //果实成熟 减去背包
    //因为用的场景中的Node 克隆的节点所以使用active来控制克隆节点的显示和隐藏
    if (type === 10) {
      mySaleBox.getChildByName("items").getChildByName("fanqie").destroy();
      mySaleBox.getChildByName("items").getChildByName("fanqie_base").active =
        false;
    }
    if (type === 11) {
      mySaleBox.getChildByName("items").getChildByName("pingguo").destroy();
      mySaleBox.getChildByName("items").getChildByName("pingguo_base").active =
        false;
    }
    if (type === 12) {
      mySaleBox.getChildByName("items").getChildByName("qiezi").destroy();
      mySaleBox.getChildByName("items").getChildByName("qiezi_base").active =
        false;
    }
    if (type === 13) {
      mySaleBox.getChildByName("items").getChildByName("huluobo").destroy();
      mySaleBox.getChildByName("items").getChildByName("huluobo_base").active =
        false;
    }
  }
  //出售果实  减去背包
  salePlant(event: EventTouch) {
    let price = 0;
    const currentJinbi = parseInt(jinbi.getComponent(Label).string);
    if (event.currentTarget.parent.parent.name === "fanqie") {
      price = 30;
      this.removePack(10);
      jinbi.getComponent(Label).string = (currentJinbi + price).toString();
      this.showMsg("出售果实成功！");
    }
    if (event.currentTarget.parent.parent.name === "pingguo") {
      price = 18;
      this.removePack(11);
      jinbi.getComponent(Label).string = (currentJinbi + price).toString();
      this.showMsg("出售果实成功！");
    }
    if (event.currentTarget.parent.parent.name === "qiezi") {
      price = 12;
      this.removePack(12);
      jinbi.getComponent(Label).string = (currentJinbi + price).toString();
      this.showMsg("出售果实成功！");
    }
    if (event.currentTarget.parent.parent.name === "huluobo") {
      price = 6;
      this.removePack(13);
      jinbi.getComponent(Label).string = (currentJinbi + price).toString();
      this.showMsg("出售果实成功！");
    }
    main.addSalePackCount--;
  }
  //播种，一次播6个种子,并且修改genPlant种子类型，土地添加种子
  boZhong(event: EventTouch) {
    let plants = find("MainCanvas/plant");
    let arrIndex = plants.children.findIndex((item) => {
      return (
        item.name === "huluobo" ||
        item.name === "qiezi" ||
        item.name === "pingguo" ||
        item.name === "fanqie"
      );
    });
    if (event.currentTarget.parent.parent.name === "fanqiezz") {
      if (arrIndex > -1) {
        this.showMsg("请将成熟的果实收获！");
        return;
      }
      genPlant._genPlant.addPlants({
        name: "fanqie",
        img: "fanqiezz",
        chengshuImg: "fanqie",
      });
      //播种后种子库移除，种子背包items数量减1，否则不能继续购买种子了
      this.removePack(0);
      main.addPackCount -= 1;
    }
    if (event.currentTarget.parent.parent.name === "pingguozz") {
      if (arrIndex > -1) {
        this.showMsg("请将成熟的果实收获！");
        return;
      }
      genPlant._genPlant.addPlants({
        name: "pingguo",
        img: "pingguozz",
        chengshuImg: "pingguo",
      });
      this.removePack(1);
      main.addPackCount -= 1;
    }
    if (event.currentTarget.parent.parent.name === "qiezizz") {
      if (arrIndex > -1) {
        this.showMsg("请将成熟的果实收获！");
        return;
      }
      genPlant._genPlant.addPlants({
        name: "qiezi",
        img: "qiezizz",
        chengshuImg: "qiezi",
      });
      this.removePack(2);
      main.addPackCount -= 1;
    }
    if (event.currentTarget.parent.parent.name === "huluobozz") {
      if (arrIndex > -1) {
        this.showMsg("请将成熟的果实收获！");
        return;
      }
      genPlant._genPlant.addPlants({
        name: "huluobo",
        img: "huluobozz",
        chengshuImg: "huluobo",
      });
      this.removePack(3);
      main.addPackCount -= 1;
    }
    const Timer = find("MainCanvas/Timer");
    //播种完成需要重置生长时间
    Timer.active = true;
    timer.time = param.levelTime;
    timer.isStart = true;
    this.showMsg("播种完成！");
  }
  //看激励视频随机增加金币
  adCalcTime(event: EventTouch, customEventData: any) {
    let currentMoney = parseInt(jinbi.getComponent(Label).string);
    currentMoney = currentMoney + param.adGiveMoney;
    if (sys.platform === sys.Platform.WECHAT_GAME) {
      //种子背包点击激励视频广告
      let videoAd = wx.createRewardedVideoAd({
        adUnitId: wechatAd[3 + parseInt(customEventData)].adid,
      });
      if (videoAd !== null) {
        // 用户触发广告后，显示激励视频广告
        videoAd.show();
        videoAd.onError((err) => {
          console.log(err);
        });
        videoAd.onClose((res) => {
          //看完广告后增加10金币
          if ((res && res.isEnded) || res === undefined) {
            jinbi.getComponent(Label).string = currentMoney.toString();
            this.showMsg("已奖励10金币！");
          } else {
            // 播放中途退出，不下发游戏奖励
            this.showMsg("广告没有播放完成！");
          }
        });
      }
    } else {
      this.showMsg("敬请期待！");
    }
  }
  //分享成功随机增加金币，暂时不做
  share() {
    this.showMsg("分享成功！");
  }
}
