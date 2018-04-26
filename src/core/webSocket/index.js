/**
 * 生成websocket
 * 引入文件执行方法，返回pool实例
 * 调用pool.start方法注册websocket
 * _url, 路径
 * @returns {{}}
 */
import jsonBig from "json-bigint";

const pool = {}; //连接池对象
let heartBeatInterval, url, reConnectInterval, clearMessageInterval;
pool.onMessage = {};
pool.onOpen = {};
pool.reConnectFlag = false;
pool.createConnect = createConnect;
pool.beforeSend = null
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
  // pool.onOpen = {};
  let obj = pool.onOpen;
  for (const key in obj) {
    if (!isNaN(Number(key))) {
      delete obj[key];
    }
  }
  pool.ws = new WebSocket(url);
  pool.reConnectFlag = true;
  // 创建链接
  clearInterval(heartBeatInterval);
  clearInterval(reConnectInterval);
  heartBeatInterval = null;
  reConnectInterval = null;

  pool.ws.onopen = event => open(pool, event);

  function open(pool, event) {
    console.log("open");
    reConnectInterval && clearInterval(reConnectInterval);
    !clearMessageInterval &&
      (clearMessageInterval = setInterval(clearMessage, 5000));
    let obj = pool.onOpen;
    for (const key in obj) {
      obj[key](event.data);
    }
  }

  //webSocket接收信息的操作
  pool.ws.onmessage = event => message(pool, event);

  function message(pool, event) {
    let data = jsonBig.parse(event.data);
    // console.log(data);
    // console.log('webSocket接收信息', JSON.parse(event.data))
    if (!heartBeatInterval) {
      heartBeatInterval = setInterval(heartBeat, 5000);
    }
    let obj = pool.onMessage;
    for (const key in obj) {
      //被动消息监听，不主动删除
      if (isNaN(Number(key))) {
        obj[key].callback(data);
        continue;
      }
      // 处理正常的主动请求监听
      if (data.seq === Number(key)) {
        obj[key].callback(data);
        delete obj[key];
      }
    }
  }

  //webSocket断开之后的操作
  pool.ws.onclose = onClose;

  function onClose(event) {
    console.log(pool.reConnectFlag);
    console.log("webSocket断开", event.target.url);
    clearInterval(reConnectInterval);
    clearInterval(heartBeatInterval);
    reConnect();
  }

  //webSocket出错之后的操作
  pool.ws.onerror = onError;

  function onError(event) {
    console.log("webSocket出错", event.target.url);
    pool.ws && pool.ws.close();
  }
}

function reConnect() {
  console.log("reConnect 重连");
  heartBeatInterval && clearInterval(heartBeatInterval);
  pool.reConnectFlag &&
    !reConnectInterval &&
    (reConnectInterval = setInterval(() => {
      createConnect(url);
    }, 10000)); //10s重连间隔
}

function clearMessage() {
  let obj = pool.onMessage,
    date = new Date();
  for (const key in obj) {
    if (obj[key].date && date - obj[key].date > 30000) {
      obj[key].callback(false);
      delete obj[key];
    }
  }
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
  if(!(pool.beforeSend && pool.beforeSend(txt))) return;
  if(this.ws.readyState!==WebSocket.OPEN){
    pool.delaySend(txt);
  }else{
    pool.seq++;
    pool.ws.send(txt);
  }
};

pool.delaySend=function(txt){
  if(pool.ws.readyState!==WebSocket.OPEN){
    setTimeout(()=>{
      pool.delaySend(txt);
    },1000);
  }else{
    pool.seq++;
    pool.ws.send(txt);
  }
};

/**
 * 关闭连接，
 */
pool.close = function() {
  // console.log('close all connects in pool')
  pool.reConnectFlag = false;
  pool.ws && pool.ws.close();
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
