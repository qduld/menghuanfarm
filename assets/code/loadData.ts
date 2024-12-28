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

export const userFilter = [
  "id",
  "firstName",
  "lastName",
  "username",
  "languageCode",
  "allowsWriteToPm",
];

export const authFilter = ["authDate", "hash"];

export const tokenSort = [
  "user",
  "chat_instance",
  "chat_type",
  "auth_date",
  "hash",
];

export const i18n = {
  stealSuccess: "Steal Success!",
  stealFailed: "Steal Failed!",
};

export const tokenMock =
  "query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787731%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinEight%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785";
// "query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787730%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinSeven%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785";
// "query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787729%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinSix%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785";
// "query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787728%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinFour%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785";
// "query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787727%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinThree%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785";
// ("query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787726%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinZELO%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785");
// "query_id=AAFNCHk7AAAAAE0IeTtP7RMw&user=%7B%22id%22%3A997787725%2C%22first_name%22%3A%22Franklin%22%2C%22last_name%22%3A%22Zelo%22%2C%22username%22%3A%22franklinyiqi%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FVPWnV7PoxyMCwkPeMUnbj5ISWwjyAf0W0d1i8cKqjGk.svg%22%7D&auth_date=1734449112&signature=opXIYnBU_2ZOnJeRIpEqjwgUFzMpYGv5b-vDK2u3YE7ojcnhPvAzQ5UtEluRwTuEPflKqC8bcTnqnJpWc2KCAg&hash=0c5a480bdf6dc2a33c0f8d7d94779ca91442078ee409ed5f2bcb37e531489785";
// "user=%7B%22id%22%3A5418325938%2C%22first_name%22%3A%22fff%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22kkkkkkkykyyyyyyyy%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-4022452127639754575&chat_type=private&auth_date=1723811494&hash=2076a7a2ad61896f70961d27a826bd45f4c949a0a6ba716f9f16491ab2c65325";
// "user%3D%7B%22id%22%3A5418325935%2C%22first_name%22%3A%22fff%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ldldldlldldld%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D%26chat_instance%3D-4022452127639754575%26chat_type%3Dprivate%26auth_date%3D1723811494%26hash%3D2076a7a2ad61896f70961d27a826bd45f4c949a0a6ba716f9f16491ab2c65325";
// "user%3D%7B%22id%22%3A5418325931%2C%22first_name%22%3A%22fff%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22heleleleh%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D%26chat_instance%3D-4022452127639754575%26chat_type%3Dprivate%26auth_date%3D1723811494%26hash%3D2076a7a2ad61896f70961d27a826bd45f4c949a0a6ba716f9f16491ab2c65325";
// "user%3D%7B%22id%22%3A5418325933%2C%22first_name%22%3A%22fff%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22rongrongrong%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D%26chat_instance%3D-4022452127639754575%26chat_type%3Dprivate%26auth_date%3D1723811494%26hash%3D2076a7a2ad61896f70961d27a826bd45f4c949a0a6ba716f9f16491ab2c65325";

export const blockList = [
  {
    id: 1,
    plantId: "1",
    userId: 5418325938,
    number: 1,
    points: 11769,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 2,
    plantId: "2",
    userId: 5418325938,
    number: 2,
    points: 13000,
    status: 1,
    seed: {
      id: 1,
      name: "玉米",
      type: 1,
      level: 8,
      points: 10000,
      maturityTime: 10,
      sort: 100010001,
      price: 1,
      status: 1,
      ttlSeconds: 0,
    },
    farmStatus: 1,
    stealAvailable: null,
  },
  {
    id: 3,
    plantId: "3",
    userId: 5418325938,
    number: 3,
    points: 13000,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 4,
    plantId: "4",
    userId: 5418325938,
    number: 4,
    points: 13000,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 5,
    plantId: "5",
    userId: 5418325938,
    number: 5,
    points: 13000,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 6,
    plantId: "6",
    userId: 5418325938,
    number: 6,
    points: 13000,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 7,
    plantId: "7",
    userId: 5418325938,
    number: 7,
    points: 13000,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 8,
    plantId: "8",
    userId: 5418325938,
    number: 8,
    points: 13000,
    status: 1,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 9,
    plantId: null,
    userId: 5418325938,
    number: 9,
    points: 13000,
    status: 0,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 10,
    plantId: null,
    userId: 5418325938,
    number: 10,
    points: 13000,
    status: 0,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 11,
    plantId: null,
    userId: 5418325938,
    number: 11,
    points: 13000,
    status: 0,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
  {
    id: 12,
    plantId: null,
    userId: 5418325938,
    number: 12,
    points: 13000,
    status: 0,
    seed: null,
    farmStatus: 0,
    stealAvailable: null,
  },
];

export const uAggResponse = {
  mePointSum: 10,
  friendPointSum: 750,
  stealPointSum: 0,
};

export const squadList = [
  {
    id: 1,
    name: "test",
    memberCount: 4,
  },
  {
    id: 2,
    name: "test2",
    memberCount: 1,
  },
  {
    id: 3,
    name: "HelloBTC",
    memberCount: 0,
  },
  {
    id: 4,
    name: "HelloB",
    memberCount: 0,
  },
  {
    id: 5,
    name: "HelloC",
    memberCount: 0,
  },
];

export const membersList = [
  {
    id: "1",
    tgFirstName: "fff1",
    tgLastName: "",
    tgUsername: "111",
    pointsBalance: 2081,
    level: 4,
    stealAvailable: 1,
    totalCollectPoints: 0,
  },
  {
    id: "3",
    tgFirstName: "fff",
    tgLastName: "",
    tgUsername: "333",
    pointsBalance: 850,
    level: 1,
    stealAvailable: 0,
    totalCollectPoints: 0,
  },
  {
    id: "5418325938",
    tgFirstName: "fff",
    tgLastName: "",
    tgUsername: "kkkkkkkykyyyyyyyy",
    pointsBalance: 219502696,
    level: 10,
    stealAvailable: 1,
    totalCollectPoints: 605,
  },
  {
    id: "54183259",
    tgFirstName: "fff",
    tgLastName: "",
    tgUsername: "kkkkkkky",
    pointsBalance: 219502696,
    level: 10,
    stealAvailable: 1,
    totalCollectPoints: 605,
  },
];

export const seedList = [
  {
    id: 1,
    name: "玉米",
    type: 1,
    level: 8,
    points: 10000,
    maturityTime: 10,
    sort: 100010001,
    price: 1,
    status: 1,
    quantity: 9,
    userSeedId: 1,
  },
  {
    id: 2,
    name: "西红柿",
    type: 1,
    level: 8,
    points: 12000,
    maturityTime: 15,
    sort: 100010002,
    price: 2,
    status: 1,
    quantity: 2,
    userSeedId: 2,
  },
  {
    id: 2,
    name: "茄子",
    type: 1,
    level: 8,
    points: 10000,
    maturityTime: 10,
    sort: 100010001,
    price: 1,
    status: 1,
    quantity: 29,
    userSeedId: 1,
  },
  {
    id: 3,
    name: "玉米",
    type: 1,
    level: 8,
    points: 10000,
    maturityTime: 10,
    sort: 100010001,
    price: 1,
    status: 1,
    quantity: 9,
    userSeedId: 1,
  },
];

export const harvestList = [
  {
    createdAt: 1728811268236,
    updatedAt: 1728811268236,
    id: 1,
    userId: 5418325938,
    skillType: "SOIL",
    ratio: 10,
    upNum: 1,
    cost: 2000,
  },
  {
    createdAt: null,
    updatedAt: null,
    id: null,
    userId: 5418325938,
    skillType: "IRRIGATE",
    ratio: 0,
    upNum: 0,
    cost: 1000,
  },
  {
    createdAt: null,
    updatedAt: null,
    id: null,
    userId: 5418325938,
    skillType: "PLANT",
    ratio: 0,
    upNum: 0,
    cost: 1000,
  },
  {
    createdAt: null,
    updatedAt: null,
    id: null,
    userId: 5418325938,
    skillType: "GROW",
    ratio: 0,
    upNum: 0,
    cost: 1000,
  },
  {
    createdAt: null,
    updatedAt: null,
    id: null,
    userId: 5418325938,
    skillType: "MANURE",
    ratio: 0,
    upNum: 0,
    cost: 1000,
  },
  {
    createdAt: null,
    updatedAt: null,
    id: null,
    userId: 5418325938,
    skillType: "DITCH",
    ratio: 0,
    upNum: 0,
    cost: 1000,
  },
];

export const coinList = [
  {
    id: 1,
    name: "10000积分",
    price: 1,
    discount: 0,
    points: 10000,
  },
  {
    id: 2,
    name: "63200积分",
    price: 6,
    discount: 95,
    points: 63200,
  },
  {
    id: 3,
    name: "88900积分",
    price: 8,
    discount: 90,
    points: 88900,
  },
  {
    id: 4,
    name: "211800积分",
    price: 18,
    discount: 85,
    points: 211800,
  },
  {
    id: 5,
    name: "350000积分",
    price: 28,
    discount: 80,
    points: 350000,
  },
  {
    id: 6,
    name: "1400000积分",
    price: 98,
    discount: 70,
    points: 1400000,
  },
];
