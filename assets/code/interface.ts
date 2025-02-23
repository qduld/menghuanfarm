// /api/v1/farmland 农田列表
export interface ISeed {
  id: number;
  name: string;
  type: number;
  level: number;
  points: number;
  maturity_time: number;
  sort: number;
  price: number;
  status: number;
  ttl_seconds: number; // 最小为0, 还有多久可以收获
}

export interface IFarmland {
  id: number;
  userId: number;
  number: number;
  status: number;
  seed: ISeed;
  plantId: string;
  unlocked: number;
  farm_status: number; // 0-未种植,1-种植中, 如果是种植中的话看seed.ttl_seconds
}

// /api/v1/farmland/plant 播种
export interface IRequestFarmlandPlant {
  farmland_Id: number;
  seed_id: number;
}

// /api/v1/farmland/harvest 收获
export interface IRequestFarmlandHarvest {
  farmland_Id: number;
  seed_id: number;
}

export interface IHarvest {
  farmland_Id: number;
  amount: number;
}

// /api/v1/seed/list 种子商店列表
export interface ISeedList {
  id: number;
  name: string;
  type: number;
  level: number;
  points: number;
  maturity_time: number;
  sort: number;
  price: number;
  status: number;
  unlocked: number;
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
  maturity_time: number;
  sort: number;
  price: number;
  status: number;
  unLocked: number;
  quantity: number;
  userSeedId: number;
}

// /api/v1/seed/buy 种子购买
export interface IRequestSeedBuy {
  seed_id: number;
  quantity: number;
}

// /farm/u/login 登录
export interface IrequestLogin {
  inviter: number;
}

export interface ILogin {
  id: number;
  tg_first_name: string;
  tg_last_name: string;
  tg_username: string;
  points_balance: number;
  level: number;
  created_at: number;
  last_login_at: number;
}

export interface IExpand {
  created_at: string;
  expansion_id: number;
  id: number;
  name: string;
  ratio: number;
  total_count: number;
  used_count: number;
  user_id: string;
}

// /farm/u/userInfo 用户信息
export interface IUserInfo {
  id: string;
  tg_first_name: string;
  tg_last_name: string;
  tg_username: string;
  nickname: string;
  points_balance: number; // 金币数量
  squad_id: number; // 组织ID
  level: number; // 等级
  radio: number; // 加成
  avatar: string;
  expansion_card?: IExpand;
}

// /farm/u/agg 我今日的收益统计
export interface IUagg {
  me_point_sum: number; // 我今日累计收取数量
  friend_point_sum: number; // 我的今日收取好友数量
  steal_point_sum: number; // 我的今日被累计收取数量
}

// /c/config 系统配置
export interface IConfig {}

// /api/v1/squad/list 推荐队伍
export interface ISquadList {
  id: number;
  name: string;
  member_count: number;
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
  points_balance: number;
  /**
   * 我是否可以偷取ta: 0-不可以, 1-可以
   */
  steal_available: number;
  tg_first_name: string;
  tg_last_name: string;
  tg_username: string;
  nickname: string;
  /**
   * 该用户今日收取数量=今日偷取数量+今日收取数量
   */
  totalCollectPoints: number;
  is_leader: number;
}

export interface ISquadInfo {
  id: number;
  name: string;
  created_at: number;
  total_points: number;
  member_count: number;
  notice: string;
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
  created_at: number | null;
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

export interface IHarvestListItem {
  id: number;
  name: string;
  ratio: number;
  points: number;
  created_at: string;
}
