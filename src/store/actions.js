import * as types from "./mutation-types";
import JsonBig from "json-bigint";

// // 异步改变状态时
export default {
  async [types.moneyAddress]({ commit, state }, { ws }) {
    // 收款地址
    await ws
      .send("wallet", "my_accounts", {
        uid: state.userInfo.uid,
        origin: 0
      })
      .then(data => {
        let arr = [];
        data.accounts && (arr = data.accounts);
        commit({ type: "moneyAddress", data: arr });
      })
      .catch(error => {});
  },

  async [types.getFriendList]({ commit, state }, { ws }) {
    // 更新好友信息
    await ws
      .send("control", "friend_list", {
        uid: state.userInfo.uid
      })
      .then(data => {
        if (!data) data = [];
        console.log("friendlistOver");
        commit({ type: "getFriendList", data });
      })
      .catch(error => {});
  },

  async [types.getGroupList]({ commit, state }, { ws }) {
    // 更新群组信息
    await ws
      .send("control", "group_list", {
        uid: state.userInfo.uid
      })
      .then(data => {
        if (!data) data = [];
        commit({ type: "getGroupList", data });
        console.log("grouplistOver");
      })
      .catch(error => {});
  },

  async [types.updateUserInfo]({ commit, state }, { ws }) {
    // 更新群组信息
    await ws
      .send("control", "user_info", {
        id: state.userInfo.uid
      })
      .then(({ name, phone, email, icon, verify, btverify }) => {
        commit({
          type: "updateUserInfo",
          data: {
            name,
            phone,
            email,
            icon,
            verify,
            btverify
          }
        });
      })
      .catch(error => {});
  },
  async [types.getService]({ commit, state }, { ws }) {
    // 收款地址
    await ws
      .send('control', 'client_service').then(data => { 
        commit({ type: "getService", data: data });
      }).catch(error => {});
  }
};
