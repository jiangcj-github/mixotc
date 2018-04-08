/**
 * 生成websocket
 * 引入文件执行方法，返回pool实例
 * 调用pool.start方法注册websocket
 * _url, 路径
 * @returns {{}}
 */
import jsonBig from "json-bigint";

const pool = {}; //连接池对象
let heartBeatInterval, url, reConnectInterval;
pool.onMessage = {};
pool.onOpen = {};
pool.reConnectFlag = false;
pool.createConnect = createConnect;
pool.seq = 1;
/**
 * 建立websocket连接方法
 * @param url
 */
function createConnect(url) {
  if (pool.ws) {
    pool.ws.onopen = null;
    pool.ws.onmessage = null;
    pool.ws.onclose = null;
    pool.ws.onerror = null;
  }
  pool.onOpen = {};
  pool.ws = new WebSocket(url);
  pool.reConnectFlag = true;
  // 创建链接
  heartBeatInterval = null;
  //建立连接先发token
  // let token = storage.getLocal("otcToken");
  // token && !pool.onOpen["token"] &&
  //   (pool.onOpen["token"] = () => {
  //     pool.onMessage[pool.seq] = function (data) {
  //       console.log("dddddddddddddd")
  //       if(data.body.ret === 1) {
  //         storage.removeLocal("otcToken");
  //         pool.reConnectFlag = false;
  //       }
  //     };
  //     pool.ws.send(sendToken({ seq: pool.seq++, body: token }));
  //   });
  //webSocket连接之后的操作
  pool.ws.onopen = event => open(pool, event);

  function open(pool, event) {
    console.log("open");
    reConnectInterval && clearInterval(reConnectInterval);
    let obj = pool.onOpen;
    for (const key in obj) {
      obj[key](event.data);
    }
  }

  //webSocket接收信息的操作
  pool.ws.onmessage = event => message(pool, event);

  function message(pool, event) {
    let data = jsonBig.parse(event.data);
    console.log(data);
    // console.log('webSocket接收信息', JSON.parse(event.data))
    if (!heartBeatInterval) {
      heartBeatInterval = setInterval(heartBeat, 5000);
    }
    let obj = pool.onMessage;
    for (const key in obj) {
      //被动消息监听，不主动删除
      if (isNaN(Number(key))) {
        obj[key](data);
        continue;
      }
      //断网后之前的主动请求监听全部删除
      if (data.seq > key && data.body.ret === 0) {
        delete obj[key];
        continue;
      }
      // 处理正常的主动请求监听
      if (data.seq === Number(key)) {
        obj[key](data);
        delete obj[key];
      }
    }
  }

  //webSocket断开之后的操作
  pool.ws.onclose = onClose;

  function onClose(event) {
    console.log("webSocket断开", event.target.url);
    clearInterval(reConnectInterval);
    reConnectInterval = null;
    clearInterval(heartBeatInterval);

    reConnect();
  }

  //webSocket出错之后的操作
  pool.ws.onerror = onError;

  function onError(event) {
    console.log("webSocket出错", event.target.url);
    pool.ws.close();
  }
}

function reConnect() {
  console.log("reConnect 重连");
  if (heartBeatInterval) clearInterval(heartBeatInterval);
  pool.reConnectFlag &&
    !reConnectInterval &&
    (reConnectInterval = setInterval(() => {
      createConnect(url);
    }, 10000)); //10s重连间隔
}

pool.start = function(_url) {
  url = _url;
  pool.reConnectFlag = true; //控制是否开启重连，主动断开不开启重连
  createConnect(url);
};

/**
 * 发送信息调用函数
 * @type {number} 需要发送的信息
 * 传入的text可以不做json处理
 */
pool.send = function(txt) {
  pool.seq++;
  if (pool.ws.readyState !== 1) {
    console.log(pool.ws.readyState);
    return false;
  } //websocket断开返回false
  console.log("send text");
  pool.ws.send(txt);
  return true;
};

/**
 * 关闭连接，
 */
pool.close = function() {
  // console.log('close all connects in pool')
  pool.reConnectFlag = false;
  pool.ws.close();
};

function heartBeat() {
  pool.ws.send(
    JSON.stringify({
      ver: 1,
      op: 2,
      seq: pool.seq++,
      body: {}
    })
  );
}
export default pool;
