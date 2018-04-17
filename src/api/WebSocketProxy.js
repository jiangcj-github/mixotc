
import sendConfig from '@/api/SendConfig.js';

function WebSocketProxy(ws) {
  this.ws = ws;
}

WebSocketProxy.prototype.seq=0;

WebSocketProxy.prototype.send=function(op, action, sendData){
  return new Promise((resolve,reject) => {
    this.seq=this.ws.seq;
    this.ws.onMessage[this.seq]= {
      callback:(data) => {
        if (!data) {
          reject(data); //catch超时处理data为false
          return;
        } else if (data.body.ret !== 0) {
          reject(data.body); //catch结果错误，返回body
          return;
        }
        resolve(data.body.data);//正常处理
      },
      date:new Date()
    };
    this.ws.send(sendConfig(op,{
      seq: this.seq,
      body:{action:action, data:sendData}
    }));
  });
};

export default WebSocketProxy;
