// import httpFilter from '@/common/js/filter/HttpFilter'


/**
 * 代理相关配置
 * 包括http，websocket，storage
 */
export default {
  /**
   * 使用方法
   *  1.在ProxyConfig配置好相关参数
   *  2.直接this.Proxy.XXX生成链接，返回promise
   *      注：若需要参数，this.Proxy.XXX（params）
   */
  useHttp: true,// 是否开启http
  /**
   * name:请求标识
   * data:请求数据
   *  url:路径
   *  method:请求方式
   *  。。。
   * 注：其他fetch可以传入的参数，也在data里面传入
   */
  httpConfig: {
    // httpFilter,
    httpProxyList: [
      //test
      // {name: 'test', data: {url: '/exchange/info', method: 'get'}},
      // {name: 'getHomeData2', data: {url: '/home/data/zhexian2', method: 'get'}},
      // {name: 'test1', data: {url: '/v1/home/mySymbolList', method: 'get'}},

    ]
  },
  /**
   * 使用方法
   *  1.在ProxyConfig配置好相关参数
   *  2.直接this.WebSocket.XXX生成链接，返回promise 为true
   *      注：若需要参数，this.WebSocket.XXX（params）
   *  3.调用this.WebSocket.XXX.get方法获得连接或连接组
   *  4.调用this.WebSocket.getAll返回所有连接
   */
  useWebSocket: false,  // 是否开启websocket
  /**
   * name:连接标识，名称
   * url:连接路径
   * size:连接数量，可选，默认为1
   */
  webSocketConfig: [
    // {name: 'getHomeData', url: '/home'},
  ],

  /**
   * 使用方法
   *  1.在ProxyConfig配置好相关参数
   *  2.直接this.Storage.XXX.XX()执行
   *  3.set：存Storage
   *    add：添加一项
   *    del：删除一项，或者根据某一条件删除部分
   *    get：取Storage
   *    handler：最后一个参数为true，则调add，第二个参数为false则调del
   *    removeAll：删除所有
   *     【具体操作查看libs/Storage.js】
   */
  useStorage: true,// 是否开启Storage
  /**
   * name:标识，名称
   * duration:失效间隔
   * expiryTime:到期时间
   */
  storageConfig: [
    // // {name: 'test', duration:0, expiryTime: 0, default:[], useDefault:false, arrPath:['a'] },
    // {name: 'optional', duration: 0, expiryTime: 0, default: [], useDefault: true},
    // {name: 'marketList', duration: 0, expiryTime: 0}, //首页交易所列表排序
    // {name: 'filterItems', duration: 0, expiryTime: 0}//首页时间和币种维度筛选
    // // {name: 'optional1', duration:1, expiryTime: 1 },
  ]
}

