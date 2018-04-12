import state from "../store/state"; // 这里引入state
import actions from "../store/actions"; // 这里引入actions
import mutations from "../store/mutations"; // 这里引入mutations

// 引入其他vuex配置件，如module也是在此处，传入下面的对象即可

const plugins = {
  // https://github.com/championswimmer/vuex-persist
  // vuex 持久化配置
  // test:1
};

export default {
  state,
  actions,
  mutations,
  plugins
};
