import {
  _decorator,
  Component,
  Node,
  Label,
  UITransform,
  instantiate,
  resources,
  SpriteAtlas,
  Sprite,
  Color,
  ScrollView,
  Widget,
} from "cc";
import { taskList, dayList, i18n } from "./loadData";
import {
  ICheckInHistory,
  ICheckInStatus,
  IDayItem,
  ITaskListItem,
} from "./interface";
import { GlobalData } from "./globalData";
import { httpRequest } from "./http";
import { LoadingUI } from "./loadingUI";
import { DrawRoundedRect } from "./drawRoundedRect";
import { getStartOfDayTimestamp, isDifferenceBetweenTimes } from "./utils";
import { Dialog } from "./dialog";

const { ccclass, property } = _decorator;

const taskTypes = [
  "HARVEST",
  "JOIN_SQUAD",
  "STEAL",
  "CREATE_SQUAD",
  "BUY_SEED",
  "CONTINUOUS_CHECKIN",
] as const;

// 通过 typeof 和数组元素推导出联合类型
type TaskTypes = (typeof taskTypes)[number]; // 'typeA' | 'typeB' | 'typeC'

@ccclass("task")
export class task extends Component {
  @property(Node)
  UDayTitle: Node = null; // UDayTitle

  @property(Node)
  UDayList: Node = null; // UDayList

  @property(Node)
  UDayItem: Node = null; // UDayItem

  @property(Number)
  daySpacingX: number = 35; // daySpacingX

  @property(Node)
  UDayContainer: Node = null; // UTaskContainer

  @property(Node)
  UTaskContainer: Node = null; // UTaskContainer

  @property(Node)
  UTaskList: Node = null; // UTaskList

  @property(Node)
  UTaskItem: Node = null; // UTaskItem

  @property
  dayList: IDayItem[];

  @property
  taskList: ITaskListItem[];

  @property(Number)
  taskSpacingY: number = 35; // taskSpacingY

  private _checkInHistory: ICheckInHistory;
  private _checkInStatus: ICheckInStatus;
  private _currentDayIndex: number = 0;
  private _isFirstLoop: boolean = true;
  protected onLoad(): void {
    this.init();
  }
  async init() {
    this.getCheckInData();
    this.getTaskList();

    const taskLoadingUI = this.UTaskContainer.getComponent(LoadingUI);
    taskLoadingUI.show();

    const dayLoadingUI = this.UDayContainer.getComponent(LoadingUI);
    dayLoadingUI.show();
  }

  orgDayList() {
    const dayListClone = [...dayList];

    // 获取签到历史并按时间从小到大排序
    const checkInDays = this._checkInHistory.checkin_days
      .map(getStartOfDayTimestamp)
      .sort((a, b) => a - b);

    // 当前时间（当天的起始时间戳）
    const currentDay = getStartOfDayTimestamp(this._checkInHistory.current_day);

    // 如果签到历史为空，直接返回默认的 dayList
    if (checkInDays.length === 0) {
      this.dayList = dayListClone;
      return;
    }

    // 只要不是连续签到就重置
    const lastCheckInDay = checkInDays[checkInDays.length - 1]; // 签到历史里最后一次签到
    const currentLastBetweenDays = isDifferenceBetweenTimes(
      currentDay,
      lastCheckInDay
    );

    // 只要签到时间大于一天就重置   isDifferenceBetweenTimes计算天数时加了1
    if (currentLastBetweenDays > 2) {
      this.dayList = dayListClone;
      return;
    }

    // 连续签到 更新签到状态
    const firstCheckInDay = checkInDays[0];
    let currentFirstBetweenDays = isDifferenceBetweenTimes(
      currentDay,
      firstCheckInDay
    );

    this._currentDayIndex = currentFirstBetweenDays - 1;

    if (this._checkInStatus.has_checked_in_today) {
      currentFirstBetweenDays++;
    }
    dayListClone.forEach((item, index) => {
      if (index < currentFirstBetweenDays - 1) {
        item.checkIn = 1;
      }
    });

    this.dayList = dayListClone;

    // 计算当前时间与第一次签到的时间间隔（单位：天）
    // const firstCheckInDay = checkInDays[0];
    // const currentBetweenDays = isDifferenceBetweenTimes(
    //   currentDay,
    //   firstCheckInDay
    // );

    // // 如果时间间隔大于30天，直接返回默认的 dayList
    // if (currentBetweenDays > 30) {
    //   this.dayList = dayList;
    //   return;
    // }

    // // 转换签到日期为相对天数
    // const relativeDays = this.convertToRelativeDays(checkInDays);

    // let currentTimestamp = 0;

    // if (this._checkInStatus.has_checked_in_today) {
    //   currentTimestamp = this._checkInHistory.current_day * 1000;
    // } else {
    //   currentTimestamp =
    //     this._checkInHistory.current_day * 1000 - 24 * 60 * 60 * 1000;
    // }

    // // 处理前缀天数列表
    // const prefixDayList = this.processDays(
    //   relativeDays,
    //   dayList,
    //   currentTimestamp,
    //   checkInDays[0]
    // );

    // const continusDays = this.calculateContinuousDays(
    //   relativeDays,
    //   new Date(currentTimestamp),
    //   new Date(checkInDays[0])
    // );

    // this.UDayTitle.getChildByName("Main")
    //   .getChildByName("Number")
    //   .getComponent(Label).string = continusDays + "";

    // // 计算前缀天数和后缀天数
    // let prefixDays, suffixDays;
    // if (this._checkInStatus.has_checked_in_today) {
    //   prefixDays = currentBetweenDays - continusDays;
    //   this._currentDayIndex = prefixDayList.length - 1;
    // } else {
    //   prefixDays = currentBetweenDays - continusDays - 1;
    //   this._currentDayIndex = prefixDayList.length;
    // }
    // suffixDays = 30 - prefixDayList.length;

    // // 截取后缀天数列表
    // const suffixDayList = dayList.slice(
    //   continusDays,
    //   continusDays + suffixDays
    // );

    // let currentDayItem = null;
    // if (this._checkInStatus.has_checked_in_today) {
    //   currentDayItem = dayList.slice(continusDays - 1)[0];
    // } else {
    //   currentDayItem = dayList.slice(continusDays)[0];
    // }

    // const nextBigReward = this.getNextBigRewardFromSuffix(
    //   currentDayItem.id,
    //   suffixDayList
    // );

    // if (nextBigReward) {
    //   this.UDayTitle.getChildByName("Sub")
    //     .getChildByName("Number")
    //     .getComponent(Label).string = nextBigReward.daysUntilReward + "";
    // }

    // // 拼接前缀和后缀天数列表
    // this.dayList = prefixDayList.concat(suffixDayList);
  }

  getNextBigRewardFromSuffix(currentDay, suffixDayList) {
    // 定义大奖的 rewardType
    const bigRewardTypes = [2, 3, 4, 5, 6];

    // 遍历 suffixDayList，找到第一个大奖
    for (let i = 0; i < suffixDayList.length; i++) {
      const day = suffixDayList[i];
      if (bigRewardTypes.indexOf(day.rewardType) !== -1) {
        // 计算距离下一个大奖的天数
        const daysUntilReward = day.id - currentDay;
        return {
          daysUntilReward,
          reward: day.reward,
          rewardType: day.rewardType,
        };
      }
    }

    // 如果没有找到大奖，返回 null
    return null;
  }

  calculateContinuousDays(relativeDays, currentDate, startDate) {
    if (relativeDays.length === 0) return 0;

    // Step 1: 转换relativeDays为实际日期数组
    const dates = relativeDays.map((day) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day);
      return date;
    });

    // Step 2: 找到最后一个签到日期
    const lastSignedDate = dates[dates.length - 1];
    const timeDiff = currentDate - lastSignedDate;
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Step 3: 判断最后一天是否连续（允许最后一天是今天或昨天）
    if (dayDiff > 1) return 0; // 超过1天未签到

    // Step 4: 从今天开始往前统计连续天数
    let continuousDays = 0;
    let checkDate = new Date(currentDate);

    while (true) {
      // 检查当前日期是否在签到日期中
      const isSigned = dates.some(
        (d) =>
          d.getDate() === checkDate.getDate() &&
          d.getMonth() === checkDate.getMonth() &&
          d.getFullYear() === checkDate.getFullYear()
      );

      if (isSigned) {
        continuousDays++;
        checkDate.setDate(checkDate.getDate() - 1); // 前一天
      } else {
        break;
      }
    }

    return continuousDays;
  }

  // 转换时间戳数组为相对天数数组
  convertToRelativeDays(timestamps) {
    const firstTimestamp = timestamps[0]; // 转换为毫秒级
    return timestamps.map((ts) =>
      Math.floor((ts - firstTimestamp) / (1000 * 60 * 60 * 24))
    );
  }

  getCurrentDayDifference(currentTimestamp, firstTimestamp) {
    const differenceInMilliseconds = currentTimestamp - firstTimestamp;
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)); // 转换为天数差
  }

  processDays(relativeDays, dayList, currentTimestamp, firstTimestamp) {
    // 默认对象：基于 dayList 的第一个元素，添加 checkIn 属性
    const defaultObject = JSON.parse(JSON.stringify(dayList[0]));
    defaultObject.checkIn = 2;

    // Step 1: 获取第一个签到日期的相对天数（即0）
    const firstDay = relativeDays[0];

    // Step 2: 计算当前日期与第一个签到日期的天数差
    const currentDayDifference = this.getCurrentDayDifference(
      currentTimestamp,
      firstTimestamp
    );

    // Step 3: 生成完整的天数范围 [0, 1, 2, ..., currentDayDifference]
    const fullRange = Array.from(
      { length: currentDayDifference + 1 },
      (_, i) => i
    );

    // Step 4: 初始化结果数组
    const result = [];

    // Step 5: 遍历完整范围，填充对象
    let i = 0;
    while (i <= currentDayDifference) {
      if (relativeDays.includes(i)) {
        // 当前天数存在于 relativeDays 中
        let j = i + 1;

        // 找到连续的天数段
        while (j <= currentDayDifference && relativeDays.includes(j)) {
          j++;
        }

        const segmentLength = j - i; // 当前连续段的长度

        // 根据连续段长度填充对象
        for (let k = 0; k < segmentLength; k++) {
          const obj = { ...dayList[k], checkIn: 1 };
          obj.title = `Day ${k + 1}`; // 动态设置 title，从 Day 1 开始累加
          result.push(obj);
        }

        // 跳过已处理的连续段
        i = j;
      } else {
        // 当前天数不存在于 relativeDays 中，用默认对象填充，checkIn 设为 2
        const obj = { ...defaultObject, id: result.length + 1, checkIn: 2 };
        obj.title = "Day 1"; // 不连续时，始终显示为 Day 1
        result.push(obj);
        i++;
      }
    }

    return result;
  }

  createDayList() {
    this.orgDayList();
    // 获取预制体的宽度和高度
    const sectionWidth =
      this.UDayItem.getComponent(UITransform).contentSize.width;

    // 计算起始点，以保证整个布局居中
    const startX = this.UDayItem.position.x;
    const startY = this.UDayItem.position.y;

    this.dayList.forEach((dayItem, index) => {
      const posX = startX + index * (sectionWidth + this.daySpacingX);

      let daySection = instantiate(this.UDayItem);
      this.UDayList.addChild(daySection);

      daySection.active = true;
      daySection.setPosition(posX, startY);

      daySection.getChildByName("Title").getComponent(Label).string =
        dayItem.title;

      if (this._currentDayIndex === index) {
        daySection
          .getChildByName("Border")
          .getComponent(DrawRoundedRect).fillColor = new Color(255, 205, 92);
        daySection
          .getChildByName("Border")
          .getComponent(DrawRoundedRect)
          .reRender();
      }

      if (dayItem.checkIn === 1 || dayItem.checkIn === 2) {
        daySection.getChildByName("Mask").active = true;
        if (dayItem.checkIn === 1) {
          daySection.getChildByName("Mask").getChildByName("Correct").active =
            true;
          daySection.getChildByName("Mask").getChildByName("Error").active =
            false;
        }

        if (dayItem.checkIn === 2) {
          daySection.getChildByName("Mask").getChildByName("Correct").active =
            false;
          daySection.getChildByName("Mask").getChildByName("Error").active =
            true;
        }
      } else {
        daySection.getChildByName("Mask").active = false;
      }

      if (dayItem.extra) {
        daySection.getChildByName("Extra").active = true;
        daySection
          .getChildByName("Extra")
          .getChildByName("Label")
          .getComponent(Label).string = `+${dayItem.extra}`;

        this.scheduleOnce(() => {
          const labelWidth = daySection
            .getChildByName("Extra")
            .getChildByName("Label")
            .getComponent(UITransform).width;

          daySection
            .getChildByName("Extra")
            .getChildByName("Border")
            .getComponent(DrawRoundedRect).rectWidth = labelWidth + 10;
          daySection
            .getChildByName("Extra")
            .getChildByName("Border")
            .getComponent(DrawRoundedRect)
            .reRender();
        }, 0);

        daySection["hasExtra"] = true;

        if (this._isFirstLoop) {
          if (dayItem.rewardType === 3 || dayItem.rewardType === 4) {
            daySection.getChildByName("Extra").active = false;
          }
        }
      } else {
        daySection.getChildByName("Extra").active = false;
      }

      var spritePath = "";
      var showNumberList = [1, 2, 5, 6];
      var extraContent = "";
      if (this._isFirstLoop) {
        showNumberList = [1, 2, 5, 6];
        switch (dayItem.rewardType) {
          case 1:
            spritePath = "gold";
            break;
          case 2:
            spritePath = "gold";
            extraContent = `+${dayItem.extra}`;
            break;
          case 3:
            spritePath = "oneKeyHarvest";
            extraContent = "one-click harvest";
            break;
          case 4:
            spritePath = "scarecrow";
            extraContent = "scarecrow";
            break;
          case 5:
            spritePath = "gold";
            extraContent = `+${dayItem.extra}`;
            break;
          case 6:
            spritePath = "gold";
            extraContent = `+${dayItem.extra}`;
            break;
          default:
            spritePath = "gold";
        }
      } else {
        if (dayItem.rewardType !== 1) {
          extraContent = `+${dayItem.extra}`;
        }
        spritePath = "gold";
        showNumberList = [1, 2, 3, 4, 5, 6];
      }

      daySection["extraContent"] = extraContent;

      daySection["spritePath"] = spritePath;

      resources.load("iconList", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        const spriteUITransform = daySection
          .getChildByName("Icon")
          .getComponent(Sprite)
          .getComponent(UITransform);

        if (
          showNumberList.findIndex((item) => item === dayItem.rewardType) !== -1
        ) {
          spriteUITransform.width = 40;
          spriteUITransform.height = 40;
          daySection.getChildByName("Icon").setPosition(-2, -4, 0);
          daySection.getChildByName("Number").active = true;
          daySection
            .getChildByName("Number")
            .getComponent(Label).string = `+${dayItem.reward}`;
        } else {
          daySection.getChildByName("Icon").setPosition(-2, -12, 0);
          spriteUITransform.width = 60;
          spriteUITransform.height = 60;
          daySection.getChildByName("Number").active = false;
        }
        daySection.getChildByName("Icon").getComponent(Sprite).spriteFrame =
          atlas.getSpriteFrame(spritePath);
      });
    });
  }

  findNextDayNumber(currentDay) {
    const dayNumbers = [3, 7, 12, 20, 30];

    // 查找第一个大于 currentDay 的数字
    const found = dayNumbers.find((num) => num > currentDay);

    // 如果没找到（即 currentDay >= 30），返回 33
    // 否则返回找到的数字
    return found !== undefined
      ? found
      : dayNumbers[0] + dayNumbers[dayNumbers.length - 1];
  }

  // 更新天数Tips
  updateDayTips() {
    this.UDayTitle.getChildByName("Main")
      .getChildByName("Number")
      .getComponent(Label).string = this._currentDayIndex + 1 + "";

    let currentDay = this._currentDayIndex;
    if (this._checkInStatus.has_checked_in_today) {
      currentDay += 1;
    }
    const firstRewardDay = this.findNextDayNumber(currentDay);
    const betweenDays =
      firstRewardDay < 30
        ? firstRewardDay - currentDay
        : firstRewardDay - currentDay - 30;
    const subNode = this.UDayTitle.getChildByName("Sub");
    subNode.getChildByName("Number").getComponent(Label).string =
      betweenDays + "";
    const rewardNode = subNode.getChildByName("Reward");

    let spritePath = "";
    let rewardLabel = "";
    switch (firstRewardDay) {
      case 3:
        spritePath = "gold";
        rewardLabel = "150";
        break;
      case 7:
        if (this._isFirstLoop) {
          spritePath = "oneKeyHarvest";
          rewardLabel = "on-click harvest";
        } else {
          spritePath = "gold";
          rewardLabel = "300";
        }
        break;
      case 12:
        if (this._isFirstLoop) {
          spritePath = "scarecrow";
          rewardLabel = "scarecrow";
        } else {
          spritePath = "gold";
          rewardLabel = "500";
        }
        break;
      case 20:
        spritePath = "gold";
        rewardLabel = "1000";
        break;
      case 30:
        spritePath = "gold";
        rewardLabel = "5%";
        break;
    }

    rewardNode.getChildByName("Label").getComponent(Label).string = rewardLabel;
    resources.load("iconList", SpriteAtlas, (err, atlas) => {
      if (err) {
        console.error("Failed to load sprite:", err);
        return;
      }

      rewardNode.getChildByName("Icon").getComponent(Sprite).spriteFrame =
        atlas.getSpriteFrame(spritePath);

      // 调整Title字位置
      this.scheduleOnce(() => {
        const mainNode = this.UDayTitle.getChildByName("Main");

        mainNode
          .getChildByName("Suffix")
          .setPosition(
            mainNode.getChildByName("Prefix").position.x +
              mainNode.getChildByName("Prefix").getComponent(UITransform)
                .width +
              mainNode.getChildByName("Number").getComponent(UITransform)
                .width +
              50,
            mainNode.getChildByName("Suffix").position.y
          );

        const numberWidth = subNode
          .getChildByName("Number")
          .getComponent(UITransform).contentSize.width;
        const prefixX = subNode.getChildByName("Prefix").position.x;
        const prefixWidth = subNode
          .getChildByName("Prefix")
          .getComponent(UITransform).width;
        subNode.getChildByName("Number");
        subNode
          .getChildByName("Suffix")
          .setPosition(
            prefixX + prefixWidth + numberWidth + 30,
            subNode.getChildByName("Suffix").position.y
          );

        subNode
          .getChildByName("Reward")
          .setPosition(
            prefixX +
              prefixWidth +
              numberWidth +
              66 +
              subNode.getChildByName("Suffix").getComponent(UITransform).width,
            subNode.getChildByName("Reward").position.y
          );
      }, 0);
    });
  }

  createTaskList() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.UTaskItem.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.UTaskItem.position.x;
    const startY = this.UTaskItem.position.y;

    this.taskList.forEach((taskItem, index) => {
      const posY = startY - index * (sectionHeight + this.taskSpacingY);

      let taskSection = instantiate(this.UTaskItem);
      this.UTaskList.addChild(taskSection);

      taskSection.active = true;
      taskSection.setPosition(startX, posY);

      taskSection
        .getChildByName("Content")
        .getChildByName("Left")
        .getChildByName("Title")
        .getComponent(Label).string = i18n.task[taskItem.id];

      const UProgressBar = taskSection
        .getChildByName("Content")
        .getChildByName("Left")
        .getChildByName("ProgressBar");

      const progressbarWidth =
        UProgressBar.getComponent(UITransform).contentSize.width;

      if (taskItem.status === 1) {
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Claim").active = true;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("InProgress").active = false;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Completed").active = false;

        const button = taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Claim")
          .getChildByName("Button");

        button[`task_id`] = taskItem.id;
      } else if (taskItem.status === 0) {
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Claim").active = false;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("InProgress").active = true;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Completed").active = false;
      } else {
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Claim").active = false;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("InProgress").active = false;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Completed").active = true;
      }

      UProgressBar.getChildByName("Label").getComponent(
        Label
      ).string = `${taskItem.progress}/${taskItem.target_progress}`;

      UProgressBar.getChildByName("Bar")
        .getComponent(UITransform)
        .setContentSize(
          (progressbarWidth * Number(taskItem.progress)) /
            Number(taskItem.target_progress),
          UProgressBar.getComponent(UITransform).contentSize.height
        );
    });
  }

  async getCheckInData() {
    try {
      // 使用 Promise.all 并行执行两个请求
      const [historyResponse, statusResponse, userInfoResponse] =
        await Promise.all([
          httpRequest("/api/v1/task/checkin/history", { method: "GET" }),
          httpRequest("/api/v1/task/checkin/status", { method: "GET" }),
          httpRequest("/api/v1/farm/u/userInfo", { method: "GET" }),
        ]);

      // 处理 check-in status 请求结果
      if (statusResponse.ok && statusResponse.data.code === 200) {
        this._checkInStatus = statusResponse.data.data as ICheckInStatus;
      } else {
        console.error(
          "Check-in status request failed with status:",
          statusResponse.status
        );
      }

      // 获取用户信息中的items，根据是否有道具判断是否是首轮签到
      if (userInfoResponse.ok && userInfoResponse.data.code === 0) {
        if (userInfoResponse.data.data.items.length > 0) {
          this._isFirstLoop = false;
        } else {
          this._isFirstLoop = true;
        }
      } else {
        console.error(
          "Get userinfo request failed with status:",
          userInfoResponse.status
        );
      }

      // 处理 check-in history 请求结果
      if (historyResponse.ok && historyResponse.data.code === 200) {
        this._checkInHistory = historyResponse.data.data as ICheckInHistory;
        this.createDayList(); // 确保 createDayList 方法被调用
        this.updateDayTips();

        const loadingUI = this.UDayContainer.getComponent(LoadingUI);
        loadingUI.hide();
        this.UDayContainer.getChildByName("Title").active = true;
        this.UDayContainer.getChildByName("Button").active = true;
        this.UDayContainer.getChildByName("ScrollView").active = true;
      } else {
        console.error(
          "Check-in history request failed with status:",
          historyResponse.status
        );
      }
    } catch (error) {
      // 捕获并记录错误
      console.error("Error fetching check-in data:", error);
    }
  }

  async checkIn() {
    const globalData = GlobalData.getInstance();
    const dialog = Dialog.getInstance();
    try {
      const response = await httpRequest("/api/v1/task/checkin", {
        method: "POST",
      });
      if (response.ok) {
        if (response.data.code === 200) {
          globalData.setTipsLabel(i18n.checkInSuccess);

          const currentDayItem = this.UDayList.children.find(
            (item, index) => index === this._currentDayIndex + 1
          );

          if (currentDayItem["hasExtra"]) {
            dialog.extraRewardBox
              .getChildByName("Reward")
              .getChildByName("Name")
              .getComponent(Label).string = currentDayItem["extraContent"];
            resources.load("iconList", SpriteAtlas, (err, atlas) => {
              if (err) {
                console.error("Failed to load sprite:", err);
                return;
              }

              dialog.extraRewardBox
                .getChildByName("Reward")
                .getChildByName("Photo")
                .getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(
                currentDayItem["spritePath"]
              );
            });

            dialog.showDialog(null, "ExtraReward");

            setTimeout(() => {
              dialog.closeDialog(null, "ExtraReward");
            }, 2000);
          }

          // 签到更新tips
          this._checkInStatus.has_checked_in_today = true;
          this.updateDayTips();

          currentDayItem.getChildByName("Mask").active = true;
          currentDayItem
            .getChildByName("Mask")
            .getChildByName("Correct").active = true;
          currentDayItem.getChildByName("Mask").getChildByName("Error").active =
            false;
        }
        this.UTaskList.removeAllChildren();
        this.getTaskList();
      } else {
        globalData.setTipsLabel(i18n.todayChecked);
      }
    } catch (error) {
      globalData.setTipsLabel(i18n.todayChecked);
      console.error("Error:", error);
    }
  }

  // 获取任务列表
  async getTaskList() {
    try {
      const response = await httpRequest("/api/v1/task/list", {
        method: "GET",
      });
      if (response.ok) {
        const loadingUI = this.UTaskContainer.getComponent(LoadingUI);
        loadingUI.hide();

        this.taskList = response.data.data as ITaskListItem[];
        this.createTaskList();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 完成任务
  async completeTask(event) {
    const globalData = GlobalData.getInstance();
    try {
      const response = await httpRequest(`/api/v1/task/claim`, {
        method: "POST",
        body: {
          task_id: event.target.task_id,
        },
      });
      if (response.ok) {
        globalData.setTipsLabel(i18n.taskCompleted);
        const taskItemIdx = this.taskList.findIndex(
          (item) => item.id === event.target.task_id
        );

        const taskSection = this.UTaskList.children[taskItemIdx + 1];

        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Claim").active = false;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("InProgress").active = false;
        taskSection
          .getChildByName("Content")
          .getChildByName("Right")
          .getChildByName("Completed").active = true;
      } else {
        globalData.setTipsLabel(i18n.taskUnCompleted);
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      globalData.setTipsLabel(i18n.taskUnCompleted);
      console.error("Error:", error);
    }
  }
}
