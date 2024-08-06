System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, find, Layers, UITransform, Sprite, SpriteFrame, resources, Button, instantiate, Label, main, timer, _dec, _class, _class2, _crd, ccclass, property, genPlant;

  function _reportPossibleCrUseOfmain(extras) {
    _reporterNs.report("main", "./main", _context.meta, extras);
  }

  function _reportPossibleCrUseOftimer(extras) {
    _reporterNs.report("timer", "./timer", _context.meta, extras);
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
      Layers = _cc.Layers;
      UITransform = _cc.UITransform;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      resources = _cc.resources;
      Button = _cc.Button;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      main = _unresolved_2.main;
    }, function (_unresolved_3) {
      timer = _unresolved_3.timer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8d18bpu6clDEanbB76tCUTF", "genPlant", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'find', 'Layers', 'UITransform', 'Sprite', 'SpriteFrame', 'resources', 'Button', 'EventTouch', 'Scheduler', 'instantiate', 'tween', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("genPlant", genPlant = (_dec = ccclass('genPlant'), _dec(_class = (_class2 = class genPlant extends Component {
        //当前植物种类。播种的时候修改这个属性，6块地种植一样类型的作物
        addPlants(plantType) {
          var shouhuoQiPao = find("MainCanvas/qipao/time");
          var maps = find("MainCanvas/map").children;
          var shouhuoCount = 0;
          maps.forEach((m, index) => {
            var plants = find("MainCanvas/plant");
            var clone_item = new Node();
            clone_item.layer = Layers.Enum.UI_2D;
            clone_item.setParent(m);
            clone_item.name = plantType.name;
            clone_item.addComponent(UITransform).addComponent(Sprite).addComponent(Button);
            clone_item.getComponent(Button).transition = Button.Transition.SCALE;
            clone_item.setPosition(m.position.x - 10, m.position.y + 112 / 2 - 10, 0);
            clone_item.getComponent(UITransform).setContentSize(89, 112);
            resources.load(plantType.img + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
              clone_item.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
              clone_item.getComponent(Sprite).spriteFrame = spriteFrame;
            });
            var shouhuo = new Node();
            shouhuo = instantiate(shouhuoQiPao);
            shouhuo.layer = Layers.Enum.UI_2D;
            shouhuo.setParent(m);
            shouhuo.active = true;
            shouhuo.addComponent(UITransform).addComponent(Button);
            shouhuo.getComponent(UITransform).setContentSize(50, 50);
            shouhuo.setPosition(clone_item.position.x - 70, clone_item.position.y, 0);

            genPlant._genPlant.schedule(() => {
              if ((_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                error: Error()
              }), timer) : timer).time <= 0) {
                resources.load(plantType.chengshuImg + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                  clone_item.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
                  clone_item.getComponent(Sprite).spriteFrame = spriteFrame;
                });
                shouhuo.getChildByName("txt").getComponent(Label).string = "收获";
              } else {
                shouhuo.getChildByName("txt").getComponent(Label).string = (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                  error: Error()
                }), timer) : timer).time + "秒";
              }
            }, 1); //收获果实 进背包


            shouhuo.on(Node.EventType.TOUCH_END, () => {
              if ((_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                error: Error()
              }), timer) : timer).time < 0) {
                var mySaleBoxItems = find("MainCanvas/popBox/mysalepack/items");

                if (mySaleBoxItems.children.length > 4) {
                  this.showMsg("果实尚未出售完毕！");
                  return;
                } //收获6块地的果实只允许入包一次


                if (clone_item.name === "fanqie") {
                  //场景中默认有4个Node所以从第5个开始属于背包items
                  //并且6个收获按钮都点击后才可以入包
                  if ((_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePackCount === 4) {
                    this.showMsg("果实背包已满！");
                    return;
                  }

                  (_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePack(10); //收获后需要修改初始化计时器

                  (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                    error: Error()
                  }), timer) : timer).isStart = false;
                }

                if (clone_item.name === "pingguo") {
                  if ((_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePackCount === 4) {
                    this.showMsg("果实背包已满！");
                    return;
                  }

                  (_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePack(11); //收获后需要修改初始化计时器

                  (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                    error: Error()
                  }), timer) : timer).isStart = false;
                }

                if (clone_item.name === "qiezi") {
                  if ((_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePackCount === 4) {
                    this.showMsg("果实背包已满！");
                    return;
                  }

                  (_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePack(12); //收获后需要修改初始化计时器

                  (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                    error: Error()
                  }), timer) : timer).isStart = false;
                }

                if (clone_item.name === "huluobo") {
                  if ((_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePackCount === 4) {
                    this.showMsg("果实背包已满！");
                    return;
                  }

                  (_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                    error: Error()
                  }), main) : main).addSalePack(13); //收获后需要修改初始化计时器

                  (_crd && timer === void 0 ? (_reportPossibleCrUseOftimer({
                    error: Error()
                  }), timer) : timer).isStart = false;
                }

                (_crd && main === void 0 ? (_reportPossibleCrUseOfmain({
                  error: Error()
                }), main) : main).saleBox.active = false;
                shouhuo.active = false; //收获后 地块移除所有的克隆果实

                plants.removeChild(clone_item);
              }
            }, this);
            plants.addChild(shouhuo);
            plants.addChild(clone_item);
          });
        } //弹消息


        showMsg(msg) {
          var msgBox = find("MainCanvas/popBox/msgBox");
          var mg = msgBox.getChildByName("msgTxt").getComponent(Label);
          mg.string = msg;
          msgBox.active = true;
          this.scheduleOnce(function callback() {
            msgBox.active = false;
          }, 1);
        }

      }, _class2._genPlant = new _class2(), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f6615a5442871238e79088b387d8fcad31a70c06.js.map