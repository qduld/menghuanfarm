System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, param, paiHang, wechatAd;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "23eafoQ2X9IdIEqFsEuDvzt", "loadData", undefined);

      _export("param", param = {
        //生长周期单位秒
        levelTime: 30,
        //昵称
        avata: "box1/spriteFrame",
        //头像
        nickname: "甜蜜蜜",
        //初始金钱
        money: 900,
        //看广告单次奖励金币数量
        adGiveMoney: 50
      }); //排行榜数据


      _export("paiHang", paiHang = [{
        nickName: "甜蜜蜜",
        top: 1,
        userAvata: "ppp/spriteFrame"
      }, {
        nickName: "举高高",
        top: 2,
        userAvata: "ddd/spriteFrame"
      }, {
        nickName: "打屁屁",
        top: 3,
        userAvata: "bbb/spriteFrame"
      }]);

      _export("wechatAd", wechatAd = [//login场景顶部banner广告
      {
        type: "banner",
        adid: "adunit-8235b2e7c8415834"
      }, //main场景底部banner广告
      {
        type: "banner",
        adid: "adunit-fa55e6aad38cde96"
      }, //main场景插屏广告
      {
        type: "chapin",
        adid: "adunit-5ebac372a08f34a7"
      }, //main场景点击激励视频广告
      {
        type: "video",
        adid: "adunit-05671e3e1cff80a2"
      }, //种子背包点击激励视频广告
      {
        type: "video1",
        adid: "adunit-792cb1dd9f9dc143"
      }, //果实背包点击激励视频广告
      {
        type: "video2",
        adid: "adunit-f55d5b037708a34f"
      }, //农贸市场点击激励视频广告
      {
        type: "video3",
        adid: "adunit-935505da4d930fd5"
      }, //排行榜点击激励视频广告
      {
        type: "video4",
        adid: "adunit-1a236fbeb155b427"
      }, //种子背包原生模板广告
      {
        type: "custom ",
        adid: "adunit-a75a38bf1901f5b5"
      }, //果实背包原生模板广告
      {
        type: "custom ",
        adid: "adunit-8e9a24da85808431"
      }]);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=35a27f3d1725ee4b4a910b166a9876852bbc7831.js.map