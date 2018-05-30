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
    let userId = JsonBig.stringify(state.userInfo.uid);
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
  // 好友对应的gid,返回对象key为uid，value为gid
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
  // 返回数组 所有好友的uid字符串数组
  friendIds: state => {
    return state.friendList.map(item => {
      return JsonBig.stringify(item.id);
    });
  },

  title: (state, getters) => {
    let result = "";
    let infoDiction = getters.infoDiction;
    state.chat.forEach(item => {
      if (item.id === state.curChat) {
        item.nickName && (result = item.nickName);
        item.isSingle &&
          (result = infoDiction[item.uid] && infoDiction[item.uid].name);
        !item.nickName &&
          !item.isSingle &&
          (result = infoDiction[item.id] && infoDiction[item.id].name);
        item.group && (result += `(${item.length})`);
      }
    });
    return result;
  },
  groupLength: state => {
    let obj = {};
    state.groupList
      .filter(item => {
        return item.type === 1;
      })
      .forEach(item => {
        obj[JsonBig.stringify(item.id)] = item.members.length;
      });
    return obj;
  }
};
