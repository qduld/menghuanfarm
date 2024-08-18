// /api/v1/farmland 农田列表
export interface ISeed {
  id: Number;
  name: String;
  type: Number;
  level: Number;
  points: Number;
  maturityTime: Number;
  sort: Number;
  price: Number;
  status: Number;
  ttlSeconds: Number; // 最小为0, 还有多久可以收获
}

export interface IFarmland {
  id: Number;
  userId: Number;
  number: Number;
  status: Number;
  seed: ISeed;
  farmStatus: Number; // 0-未种植,1-种植中, 如果是种植中的话看seed.ttlSeconds
}

// /api/v1/farmland/plant 播种
export interface IRequestFarmlandPlant {
  farmlandId: Number;
  seedId: Number;
}

// /api/v1/farmland/harvest 收获
export interface IRequestFarmlandHarvest {
  farmlandId: Number;
  seedId: Number;
}

export interface IHarvest {
  farmlandId: Number;
  amount: Number;
}

// /api/v1/seed/list 种子商店列表
export interface ISeedList {
  id: Number;
  name: String;
  type: Number;
  level: Number;
  points: Number;
  maturityTime: Number;
  sort: Number;
  price: Number;
  status: Number;
  unLocked: Number;
}

// /api/v1/seed/package 种子商店列表
export interface ISeedPackage {
  id: Number;
  name: String;
  type: Number;
  level: Number;
  points: Number;
  maturityTime: Number;
  sort: Number;
  price: Number;
  status: Number;
  unLocked: Number;
  quantity: Number;
  userSeedId: Number;
}

// /api/v1/seed/buy 种子购买
export interface IRequestSeedBuy {
  seedId: Number;
  quantity: Number;
}

// /farm/u/login 登录
export interface IrequestLogin {
  inviter: Number;
}

export interface ILogin {
  id: Number;
  tgFirstName: String;
  tgLastName: String;
  tgUsername: String;
  pointsBalance: Number;
  level: Number;
}

// /farm/u/userInfo 用户信息
export interface IUserInfo {
  id: Number;
  tgFirstName: String;
  tgLastName: String;
  tgUsername: String;
  pointsBalance: Number;
  level: Number;
}

// /c/config 系统配置
export interface IConfig {}
