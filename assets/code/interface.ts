// /api/v1/farmland 农田列表
export interface ISeed {
  id: number;
  name: string;
  type: number;
  level: number;
  points: number;
  maturityTime: number;
  sort: number;
  price: number;
  status: number;
  ttlSeconds: number; // 最小为0, 还有多久可以收获
}

export interface IFarmland {
  id: number;
  userId: number;
  number: number;
  status: number;
  seed: ISeed;
  plantId: string;
  farmStatus: number; // 0-未种植,1-种植中, 如果是种植中的话看seed.ttlSeconds
}

// /api/v1/farmland/plant 播种
export interface IRequestFarmlandPlant {
  farmlandId: number;
  seedId: number;
}

// /api/v1/farmland/harvest 收获
export interface IRequestFarmlandHarvest {
  farmlandId: number;
  seedId: number;
}

export interface IHarvest {
  farmlandId: number;
  amount: number;
}

// /api/v1/seed/list 种子商店列表
export interface ISeedList {
  id: number;
  name: string;
  type: number;
  level: number;
  points: number;
  maturityTime: number;
  sort: number;
  price: number;
  status: number;
  unLocked: number;
  quantity: number;
  userSeedId: number;
}

// /api/v1/seed/package 种子商店列表
export interface ISeedPackage {
  id: number;
  name: string;
  type: number;
  level: number;
  points: number;
  maturityTime: number;
  sort: number;
  price: number;
  status: number;
  unLocked: number;
  quantity: number;
  userSeedId: number;
}

// /api/v1/seed/buy 种子购买
export interface IRequestSeedBuy {
  seedId: number;
  quantity: number;
}

// /farm/u/login 登录
export interface IrequestLogin {
  inviter: number;
}

export interface ILogin {
  id: number;
  tgFirstName: string;
  tgLastName: string;
  tgUsername: string;
  pointsBalance: number;
  level: number;
  createdAt: number;
  lastLoginAt: number;
}

// /farm/u/userInfo 用户信息
export interface IUserInfo {
  id: number;
  tgFirstName: string;
  tgLastName: string;
  tgUsername: string;
  pointsBalance: number; // 金币数量
  squadId: number; // 组织ID
  level: number; // 等级
  radio: number; // 加成
  avatar: string;
}

// /farm/u/agg 我今日的收益统计
export interface IUagg {
  mePointSum: number; // 我今日累计收取数量
  friendPointSum: number; // 我的今日收取好友数量
  stealPointSum: number; // 我的今日被累计收取数量
}

// /c/config 系统配置
export interface IConfig {}

// /api/v1/squad/list 推荐队伍
export interface ISquadList {
  id: number;
  name: string;
  memberCount: number;
}

export interface IMembersList {
  /**
   * 用户id
   */
  id: string;
  /**
   * 用户等级
   */
  level: number;
  /**
   * 用户积分余额
   */
  pointsBalance: number;
  /**
   * 我是否可以偷取ta: 0-不可以, 1-可以
   */
  stealAvailable: number;
  tgFirstName: string;
  tgLastName: string;
  tgUsername: string;
  /**
   * 该用户今日收取数量=今日偷取数量+今日收取数量
   */
  totalCollectPoints: number;
}

export interface ISquadInfo {
  id: number;
  name: string;
  createdAt: number;
  totalPoints: number;
  memberCount: number;
}

// /api/v1/skill/list 技能列表
export interface ISkillList {
  /**
   * 下一级升级消耗积分
   */
  cost: number;
  /**
   * 创建时间
   */
  createdAt: number | null;
  id: number | null;
  /**
   * 当前增加比例
   */
  ratio: number;
  /**
   * 技能类型
   */
  skillType: string;
  /**
   * 更新时间
   */
  updatedAt: number | null;
  /**
   * 升级次数
   */
  upNum: number;
  userId: number;
}

export interface ICoinListItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  points: number;
}
