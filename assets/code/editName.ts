import { _decorator, Component, Node, find, EditBox } from "cc";
import { httpRequest, proxyUrl } from "./http";
import { Dialog } from "./dialog";
import { GlobalData } from "./globalData";
import { GenInfo } from "./genInfo";
import { i18n } from "./loadData";
const { ccclass, property } = _decorator;

@ccclass("EditName")
export class EditName extends Component {
  @property(EditBox)
  UNickname: EditBox = null; // 用户名

  // 更新用户昵称
  async requestUpdateNickname() {
    const dialog = Dialog.getInstance();
    const globalData = GlobalData.getInstance();
    const genInfo = GenInfo.getInstance();

    let nickname = this.UNickname.string;
    if (!nickname) {
      globalData.setMessageLabel(i18n.nicknameEmpty);
      return;
    }
    try {
      const response = await httpRequest(`/api/v1/farm/u/nickname`, {
        method: "POST",
        body: {
          nickname,
        },
      });
      if (response.ok) {
        globalData.userInfo.nickname = nickname;
        genInfo.updateUserInfo();
        globalData.setMessageLabel(i18n.modifyNicknameSuccess);
        dialog.closeDialog(null, "EditName");
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
