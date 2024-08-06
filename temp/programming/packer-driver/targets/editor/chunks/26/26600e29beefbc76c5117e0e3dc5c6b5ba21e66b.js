System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, find, instantiate, Layers, resources, Sprite, SpriteFrame, Label, director, sys, AudioSource, genPlant, timer, paiHang, param, wechatAd, _dec, _class, _class2, _crd, ccclass, property, myPackBox, mySaleBox, storeBox, paiHangBox, msgBox, userAvata, nickName, jinbi, mainAd1, mainAd2, mainAd3, main;

  function _reportPossibleCrUseOfgenPlant(extras) {
    _reporterNs.report("genPlant", "./genPlant", _context.meta, extras);
  }

  function _reportPossibleCrUseOftimer(extras) {
    _reporterNs.report("timer", "./timer", _context.meta, extras);
  }

  function _reportPossibleCrUseOfpaiHang(extras) {
    _reporterNs.report("paiHang", "./loadData", _context.meta, extras);
  }

  function _reportPossibleCrUseOfparam(extras) {
    _reporterNs.report("param", "./loadData", _context.meta, extras);
  }

  function _reportPossibleCrUseOfwechatAd(extras) {
    _reporterNs.report("wechatAd", "./loadData", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      find = _cc.find;
      instantiate = _cc.instantiate;
      Layers = _cc.Layers;
      resources = _cc.resources;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Label = _cc.Label;
      director = _cc.director;
      sys = _cc.sys;
      AudioSource = _cc.AudioSource;
    }, function (_unresolved_2) {
      genPlant = _unresolved_2.genPlant;
    }, function (_unresolved_3) {
      timer = _unresolved_3.timer;
    }, function (_unresolved_4) {
      paiHang = _unresolved_4.paiHang;
      param = _unresolved_4.param;
      wechatAd = _unresolved_4.wechatAd;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ad534xFMT9JSp8KEKnH95y0", "main", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'CCInteger', 'Vec3', 'CCFloat', 'find', 'EventTouch', 'instantiate', 'Layers', 'resources', 'Sprite', 'SpriteFrame', 'UITransform', 'Label', 'director', 'Scene', 'sys', 'assetManager', 'AudioClip', 'AudioSource']);

      ({
        ccclass,
        property
      } = _decorator);
      msgBox = null;
      jinbi = null;
      mainAd3 = null; //0 橘子香蕉西红柿幼苗，1 红富士苹果幼苗,2 紫金冠茄幼苗,3 红森胡萝卜幼苗

      _export("main", main = (_dec = ccclass('main'), _dec(_class = (_class2 = class main extends Component {
        // @property([Node])
        // fingerFlows
        start() {
          director.preloadScene("main"); //login顶部banner广告

          if (sys.platform === sys.Platform.WECHAT_GAME && director.getScene().name === "login") {
            let {
              screenWidth
            } = wx.getSystemInfoSync();
            mainAd1 = wx.createBannerAd({
              adUnitId: (_crd && wechatAd === void 0 ? (_reportPossibleCrUseOfwechatAd({
                error: Error()
              }), wechatAd) : wechatAd)[0].adid,
              style: {
                left: 0,
                top: 0,
                width: screenWidth
              },
              //自动刷新
              adIntervals: 30
            });

            if (mainAd1 !== null) {
              mainAd1.show();
              mainAd1.onError(err => {
                console.log(err);
              });
            }
          }

          if (sys.platform === sys.Platform.WECHAT_GAME && director.getScene().name === "main") {
            let {
              screenWidth,
              screenHeight
            } = wx.getSystemInfoSync(); //main场景插屏广告

            mainAd3 = wx.createInterstitialAd({
              adUnitId: (_crd && wechatAd === void 0 ? (_reportPossibleCrUseOfwechatAd({
                error: Error()
              }), wechatAd) : wechatAd)[2].adid
            });

            if (mainAd3 !== null) {
              mainAd3.show();
              mainAd3.onError(err => {
                console.log(err);
              });
            } //main场景底部banner广告


            mainAd2 = wx.createBannerAd({
              adUnitId: (_crd && wechatAd === void 0 ? (_reportPossibleCrUseOfwechatAd({
                error: Error()
              }), wechatAd) : wechatAd)[1].adid,
              style: {
                left: 0,
                top: screenHeight - 60,
                width: screenWidth
              },
              //自动刷新
              adIntervals: 30
            });

            if (mainAd2 !== null) {
              mainAd2.show();
              mainAd2.onError(err => {
                console.log(err);
              });
            }
          } //手指跟随
          // const finger = find("MainCanvas/op/finger");
          // this.fingerFlows.forEach(item => {
          //     item.on(Node.EventType.TOUCH_END, function (event: EventTouch) {
          //         finger.parent.active = true;
          //         const position = item.getPosition();
          //         finger.setPosition(new Vec3(position.x + 30, position.y - 30, 0));
          //     }, this);
          // });

        }

        clickLoginBtn() {
          const btn = find("Canvas/btnClick");
          btn.getComponent(AudioSource).play();
        }

        clickBtn() {
          const btn = find("MainCanvas/btnClick");
          btn.getComponent(AudioSource).play();
        }

        login() {
          director.loadScene("main", () => {
            //游戏开始倒计时
            (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
              error: Error()
            }), timer) : timer).isStart = true;
            this.init();
            nickName.getComponent(Label).string = (_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
              error: Error()
            }), param) : param).nickname;
            resources.load((_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
              error: Error()
            }), param) : param).avata, SpriteFrame, (err, spriteFrame) => {
              userAvata.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
              userAvata.getComponent(Sprite).spriteFrame = spriteFrame;
            });
            jinbi.getComponent(Label).string = (_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
              error: Error()
            }), param) : param).money.toString();
            (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
              error: Error()
            }), timer) : timer).time = (_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
              error: Error()
            }), param) : param).levelTime;

            if (sys.platform === sys.Platform.WECHAT_GAME) {
              if (mainAd1 !== null) {
                mainAd1.hide();
              }

              if (mainAd2 !== null) {
                mainAd2.hide();
              }
            }
          });
        } //类型，索引


        static addSalePack(type) {
          let sale_item = new Node(); //成熟果实仅仅可以售卖 只入包一次

          if (type === 10) {
            sale_item = instantiate(mySaleBox.getChildByName("items").getChildByName("fanqie_base"));
            sale_item.name = "fanqie";
          }

          if (type === 11) {
            sale_item = instantiate(mySaleBox.getChildByName("items").getChildByName("pingguo_base"));
            sale_item.name = "pingguo";
          }

          if (type === 12) {
            sale_item = instantiate(mySaleBox.getChildByName("items").getChildByName("qiezi_base"));
            sale_item.name = "qiezi";
          }

          if (type === 13) {
            sale_item = instantiate(mySaleBox.getChildByName("items").getChildByName("huluobo_base"));
            sale_item.name = "huluobo";
          }

          main.addSalePackCount++;
          sale_item.active = true;
          sale_item.layer = Layers.Enum.UI_2D;
          sale_item.setParent(mySaleBox); //果实背包只放一条记录，后期改成scrollview组件即可，多条的话会出现位置不对的bug

          sale_item.setPosition(-60, 271 - 189 * main.addSalePackCount, 0);
          mySaleBox.getChildByName("items").addChild(sale_item);
        }

        static addPack(type) {
          //动态添加背包
          //种子 仅仅可以种植
          let clone_item = new Node();

          if (type === 0) {
            clone_item = instantiate(myPackBox.getChildByName("items").getChildByName("fanqiezz_base"));
            clone_item.name = "fanqiezz";
          }

          if (type === 1) {
            clone_item = instantiate(myPackBox.getChildByName("items").getChildByName("pingguozz_base"));
            clone_item.name = "pingguozz";
          }

          if (type === 2) {
            clone_item = instantiate(myPackBox.getChildByName("items").getChildByName("qiezizz_base"));
            clone_item.name = "qiezizz";
          }

          if (type === 3) {
            clone_item = instantiate(myPackBox.getChildByName("items").getChildByName("huluobozz_base"));
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
          (_crd && paiHang === void 0 ? (_reportPossibleCrUseOfpaiHang({
            error: Error()
          }), paiHang) : paiHang).forEach((item, index) => {
            const clone_item = instantiate(paiHangBox.getChildByName("items"));
            clone_item.layer = Layers.Enum.UI_2D;
            clone_item.setParent(paiHangBox);
            clone_item.setPosition(0, 0 - clone_item.position.y - 240 * index, 0);
            const name = clone_item.getChildByName("box").getChildByName("txtBox").getChildByName("name");
            name.getComponent(Label).string = item.nickName;
            resources.load(item.top === 1 ? "1/spriteFrame" : item.top === 2 ? "2/spriteFrame" : "3/spriteFrame", SpriteFrame, (err, spriteFrame) => {
              const top = clone_item.getChildByName("box").getChildByName("txtBox").getChildByName("top");
              top.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
              top.getComponent(Sprite).spriteFrame = spriteFrame;
            });
            resources.load(item.userAvata, SpriteFrame, (err, spriteFrame) => {
              const sp = clone_item.getChildByName("box").getChildByName("txtBox").getChildByName("pro");
              sp.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
              sp.getComponent(Sprite).spriteFrame = spriteFrame;
            });
            paiHangBox.addChild(clone_item);
          });
        }

        init() {
          //种子背包
          myPackBox = find("MainCanvas/popBox/mypack"), //果实背包
          mySaleBox = find("MainCanvas/popBox/mysalepack"), storeBox = find("MainCanvas/popBox/store"), paiHangBox = find("MainCanvas/popBox/paihang"), msgBox = find("MainCanvas/popBox/msgBox");
          userAvata = find("MainCanvas/touxiangkuang/userAvata"), nickName = find("MainCanvas/touxiangkuang/nickname"), jinbi = find("MainCanvas/jinbi/boxbg/txt"); //默认添加胡萝卜到商店植物 胡萝卜最便宜

          (_crd && genPlant === void 0 ? (_reportPossibleCrUseOfgenPlant({
            error: Error()
          }), genPlant) : genPlant)._genPlant.addPlants({
            name: "huluobo",
            img: "huluobozz",
            chengshuImg: "huluobo"
          });

          main.saleBox = mySaleBox;
          main.addPackCount = 0;
          main.addSalePackCount = 0;
        }

        update(deltaTime) {} //弹窗


        showDialog(event) {
          switch (event.currentTarget.name) {
            case "package":
              myPackBox.active = true;

              if (sys.platform === sys.Platform.WECHAT_GAME) {
                //种子背包原生模板
                let mainAd8 = wx.createCustomAd({
                  adUnitId: (_crd && wechatAd === void 0 ? (_reportPossibleCrUseOfwechatAd({
                    error: Error()
                  }), wechatAd) : wechatAd)[8].adid,
                  style: {
                    left: 50,
                    top: 550,
                    width: 650
                  },
                  //自动刷新
                  adIntervals: 30
                });

                if (mainAd8 !== null) {
                  // 用户触发广告后，显示激励视频广告
                  mainAd8.show();
                  mainAd8.onError(err => {
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
                  mainAd2.onError(err => {
                    console.log(err);
                  });
                } //果实背包原生模板


                let mainAd9 = wx.createCustomAd({
                  adUnitId: (_crd && wechatAd === void 0 ? (_reportPossibleCrUseOfwechatAd({
                    error: Error()
                  }), wechatAd) : wechatAd)[9].adid,
                  style: {
                    left: 50,
                    top: 550,
                    width: 650
                  },
                  //自动刷新
                  adIntervals: 30
                });

                if (mainAd9 !== null) {
                  // 用户触发广告后，显示激励视频广告
                  mainAd9.show();
                  mainAd9.onError(err => {
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

        closeDialog(event) {
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
        } //弹消息


        showMsg(msg) {
          const mg = msgBox.getChildByName("msgTxt").getComponent(Label);
          mg.string = msg;
          msgBox.active = true;
          this.scheduleOnce(function callback() {
            msgBox.active = false;
          }, 1);
        } //购买种子  进背包


        buyPlant(event) {
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

              let arrIndex = myPackBox.getChildByName("items").children.findIndex(item => {
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

              let arrIndex = myPackBox.getChildByName("items").children.findIndex(item => {
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

              let arrIndex = myPackBox.getChildByName("items").children.findIndex(item => {
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

              let arrIndex = myPackBox.getChildByName("items").children.findIndex(item => {
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

        removePack(type) {
          //种子播种 减去背包
          if (type === 0) {
            myPackBox.getChildByName("items").getChildByName("fanqiezz").destroy();
            myPackBox.getChildByName("items").getChildByName("fanqiezz_base").active = false;
          }

          if (type === 1) {
            myPackBox.getChildByName("items").getChildByName("pingguozz").destroy();
            myPackBox.getChildByName("items").getChildByName("pingguozz_base").active = false;
          }

          if (type === 2) {
            myPackBox.getChildByName("items").getChildByName("qiezizz").destroy();
            myPackBox.getChildByName("items").getChildByName("qiezizz_base").active = false;
          }

          if (type === 3) {
            myPackBox.getChildByName("items").getChildByName("huluobozz").destroy();
            myPackBox.getChildByName("items").getChildByName("huluobozz_base").active = false;
          } //果实成熟 减去背包
          //因为用的场景中的Node 克隆的节点所以使用active来控制克隆节点的显示和隐藏


          if (type === 10) {
            mySaleBox.getChildByName("items").getChildByName("fanqie").destroy();
            mySaleBox.getChildByName("items").getChildByName("fanqie_base").active = false;
          }

          if (type === 11) {
            mySaleBox.getChildByName("items").getChildByName("pingguo").destroy();
            mySaleBox.getChildByName("items").getChildByName("pingguo_base").active = false;
          }

          if (type === 12) {
            mySaleBox.getChildByName("items").getChildByName("qiezi").destroy();
            mySaleBox.getChildByName("items").getChildByName("qiezi_base").active = false;
          }

          if (type === 13) {
            mySaleBox.getChildByName("items").getChildByName("huluobo").destroy();
            mySaleBox.getChildByName("items").getChildByName("huluobo_base").active = false;
          }
        } //出售果实  减去背包


        salePlant(event) {
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
        } //播种，一次播6个种子,并且修改genPlant种子类型，土地添加种子


        boZhong(event) {
          let plants = find("MainCanvas/plant");
          let arrIndex = plants.children.findIndex(item => {
            return item.name === "huluobo" || item.name === "qiezi" || item.name === "pingguo" || item.name === "fanqie";
          });

          if (event.currentTarget.parent.parent.name === "fanqiezz") {
            if (arrIndex > -1) {
              this.showMsg("请将成熟的果实收获！");
              return;
            }

            (_crd && genPlant === void 0 ? (_reportPossibleCrUseOfgenPlant({
              error: Error()
            }), genPlant) : genPlant)._genPlant.addPlants({
              name: "fanqie",
              img: "fanqiezz",
              chengshuImg: "fanqie"
            }); //播种后种子库移除，种子背包items数量减1，否则不能继续购买种子了


            this.removePack(0);
            main.addPackCount -= 1;
          }

          if (event.currentTarget.parent.parent.name === "pingguozz") {
            if (arrIndex > -1) {
              this.showMsg("请将成熟的果实收获！");
              return;
            }

            (_crd && genPlant === void 0 ? (_reportPossibleCrUseOfgenPlant({
              error: Error()
            }), genPlant) : genPlant)._genPlant.addPlants({
              name: "pingguo",
              img: "pingguozz",
              chengshuImg: "pingguo"
            });

            this.removePack(1);
            main.addPackCount -= 1;
          }

          if (event.currentTarget.parent.parent.name === "qiezizz") {
            if (arrIndex > -1) {
              this.showMsg("请将成熟的果实收获！");
              return;
            }

            (_crd && genPlant === void 0 ? (_reportPossibleCrUseOfgenPlant({
              error: Error()
            }), genPlant) : genPlant)._genPlant.addPlants({
              name: "qiezi",
              img: "qiezizz",
              chengshuImg: "qiezi"
            });

            this.removePack(2);
            main.addPackCount -= 1;
          }

          if (event.currentTarget.parent.parent.name === "huluobozz") {
            if (arrIndex > -1) {
              this.showMsg("请将成熟的果实收获！");
              return;
            }

            (_crd && genPlant === void 0 ? (_reportPossibleCrUseOfgenPlant({
              error: Error()
            }), genPlant) : genPlant)._genPlant.addPlants({
              name: "huluobo",
              img: "huluobozz",
              chengshuImg: "huluobo"
            });

            this.removePack(3);
            main.addPackCount -= 1;
          }

          const Timer = find("MainCanvas/Timer"); //播种完成需要重置生长时间

          Timer.active = true;
          (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
            error: Error()
          }), timer) : timer).time = (_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
            error: Error()
          }), param) : param).levelTime;
          (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
            error: Error()
          }), timer) : timer).isStart = true;
          this.showMsg("播种完成！");
        } //看激励视频随机增加金币


        adCalcTime(event, customEventData) {
          let currentMoney = parseInt(jinbi.getComponent(Label).string);
          currentMoney = currentMoney + (_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
            error: Error()
          }), param) : param).adGiveMoney;

          if (sys.platform === sys.Platform.WECHAT_GAME) {
            //种子背包点击激励视频广告
            let videoAd = wx.createRewardedVideoAd({
              adUnitId: (_crd && wechatAd === void 0 ? (_reportPossibleCrUseOfwechatAd({
                error: Error()
              }), wechatAd) : wechatAd)[3 + parseInt(customEventData)].adid
            });

            if (videoAd !== null) {
              // 用户触发广告后，显示激励视频广告
              videoAd.show();
              videoAd.onError(err => {
                console.log(err);
              });
              videoAd.onClose(res => {
                //看完广告后增加10金币
                if (res && res.isEnded || res === undefined) {
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
        } //分享成功随机增加金币，暂时不做


        share() {
          this.showMsg("分享成功！");
        }

      }, _class2.addSalePackCount = 0, _class2.addPackCount = 0, _class2.saleBox = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=26600e29beefbc76c5117e0e3dc5c6b5ba21e66b.js.map