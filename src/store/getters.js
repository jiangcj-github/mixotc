import JsonBig from "json-bigint";
import HostUrl from "../core/hostUrl";
export default {
  // 头像，昵称字典
  infoDiction: state => {
    let obj = {};
    state.groupList.forEach(item => {
      item.members.forEach(ite => {
        let id = JsonBig.stringify(ite.id);
        !obj[id] &&
          (obj[id] = {
            icon: ite.icon
              ? `${HostUrl.http}image/${ite.icon}`
              : "/static/images/default_avator.png",
            name: ite.name
          });
      });
    });
    let strangerInfo = state.strangerInfo;
    for (const key in strangerInfo) {
      !obj[key] &&
        (obj[key] = {
          icon: strangerInfo[key].icon,
          name: strangerInfo[key].name
        });
    }
    state.friendList.forEach(item => {
      let id = JsonBig.stringify(item.id);
      !obj[id] &&
        (obj[id] = {
          icon: item.icon
            ? `${HostUrl.http}image/${item.icon}`
            : "/static/images/default_avator.png",
          name: item.name
        });
    });
    let icon = state.userInfo.icon;
    let userId = JsonBig.stringify(state.userInfo.id);
    !obj[userId] &&
      (obj[userId] = {
        icon: icon
          ? `${HostUrl.http}image/${icon}`
          : "/static/images/default_avator.png",
        name: state.userInfo.name
      });
    return obj;
  },
  // chat的Id数组
  chatIds: state => {
    return state.chat.map(item => {
      return item.id;
    });
  },
  friendGid: state => {
    let obj = {};
    state.groupList.forEach(item => {
      if (item.type !== 0) return;
      item.members.forEach(itm => {
        let id = JsonBig.stringify(itm.id);
        if (id !== JsonBig.stringify(state.userInfo.uid)) {
          obj[id] = JsonBig.stringify(item.id);
        }
      });
    });
    return obj;
  },
  friendIds: state => {
    return state.friendList.map(item => {
      return JsonBig.stringify(item.id);
    });
  }
};
