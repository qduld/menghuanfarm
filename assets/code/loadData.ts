export const param = {
  //生长周期单位秒
  levelTime: 30,
  //昵称
  avata: "box1/spriteFrame",
  //头像
  nickname: "甜蜜蜜",
  //初始金钱
  money: 900,
  //看广告单次奖励金币数量
  adGiveMoney: 50,
};
//排行榜数据
export const paiHang = [
  { nickName: "甜蜜蜜", top: 1, userAvata: "ppp/spriteFrame" },
  { nickName: "举高高", top: 2, userAvata: "ddd/spriteFrame" },
  { nickName: "打屁屁", top: 3, userAvata: "bbb/spriteFrame" },
];

export const wechatAd = [
  //login场景顶部banner广告
  { type: "banner", adid: "adunit-8235b2e7c8415834" },
  //main场景底部banner广告
  { type: "banner", adid: "adunit-fa55e6aad38cde96" },
  //main场景插屏广告
  { type: "chapin", adid: "adunit-5ebac372a08f34a7" },
  //main场景点击激励视频广告
  { type: "video", adid: "adunit-05671e3e1cff80a2" },
  //种子背包点击激励视频广告
  { type: "video1", adid: "adunit-792cb1dd9f9dc143" },
  //果实背包点击激励视频广告
  { type: "video2", adid: "adunit-f55d5b037708a34f" },
  //农贸市场点击激励视频广告
  { type: "video3", adid: "adunit-935505da4d930fd5" },
  //排行榜点击激励视频广告
  { type: "video4", adid: "adunit-1a236fbeb155b427" },
  //种子背包原生模板广告
  { type: "custom ", adid: "adunit-a75a38bf1901f5b5" },
  //果实背包原生模板广告
  { type: "custom ", adid: "adunit-8e9a24da85808431" },
];

export const tokenMock =
  "user=%7B%22id%22%3A5418325938%2C%22first_name%22%3A%22fff%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22kkkkkkkykyyyyyyyy%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-4022452127639754575&chat_type=private&auth_date=1723811494&hash=2076a7a2ad61896f70961d27a826bd45f4c949a0a6ba716f9f16491ab2c65325";
