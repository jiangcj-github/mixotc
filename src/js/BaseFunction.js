export default {
  install(Vue) {
    Object.keys(this).forEach(v => Vue.prototype[v] = (...paras) => this[v](Vue.prototype, ...paras))
  },

  /**
   * 轮循数据
   * @param app vue实例 实际调用不需要
   * @param _this 调用的vue组件中的this
   * @param key 在组件中绑定的存储数据的key
   * @param callBack1 同组数据处理回调
   * @param callBack2 3s后的回调
   * @returns {Promise<void>}
   */
  symbolsRefresh(app, _this, key, callBack1, callBack2) {
    // let params = obj.map(v => {
    //   return {
    //     mid: v.marketId,
    //     sid: v.symbolId
    //   }
    // console.log( _this[key], callBack1, callBack2)
    // })
    let func1 = async () => {
      // let data = await app.Proxy.symbolsRefresh(params)
      let data = JSON.parse(JSON.stringify(_this[key])).map((v, index) => {
        v.price.cny = v.price.cny + 1 * Math.pow(-1, index % 2)
        return v
      })
      callBack1 && data.forEach((newValue, index) => callBack1(newValue, _this[key][index]))
      // console.log(data)
      _this[key] = JSON.parse(JSON.stringify(_this[key]))
    }

    let func2 = async () => {
      callBack2 && _this[key].forEach(v => callBack2(v))
    }

    app.Loop.symbolsRefresh.clear()
    app.Loop.symbolsRefresh.setDelayTime(3000)
    app.Loop.symbolsRefresh.set(func1, 3000)
    app.Loop.symbolsRefresh.set(func2, 2000)
    app.Loop.symbolsRefresh.start()

  },
  optionHandle(app, content) {
    //1.uid  /v1/home/symbolList
    // 2. 根据synbole marketid 返回按照顺序的信息
    // 3.     /v1/home/saveMyOption
    // 4.  synbole marketid  uid  op: 0 + 1 -

    let obj = {
      mid: content.marketId,
      sid: content.symbolId
    }, suc
    //如果登录，则调接口保存
    // suc = ...

    //否则存storage
    suc = app.Storage.optional.handler(obj, !content.isMyOptional)
    if (suc) {
      content.isMyOptional = !content.isMyOptional;
    }
    return true
  },

  // 筛选自选
  selectSel(app, obj) {
    // console.log('app.Storage.optional.get()',app.Storage.optional.get() ) //null
    // if (app.Storage.optional.get()) {
    // console.log(11111)
    let localList = app.Storage.optional.get();
    localList.forEach(v => {
      obj.find((content) => {
        content.isMyOptional = false;
        if (content.marketId === v.mid && content.symbolId === v.sid) {
          content.isMyOptional = true
        }
      })
    })
  }
  // }
}
