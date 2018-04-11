import sendConfig from '@/api/SendConfig.js';

function WebSocketProxy(ws) {
  this.ws=ws;
}

WebSocketProxy.prototype.seq=0;

WebSocketProxy.prototype.send=function(op,action,sendData){
  let _this=this;
  return new Promise(function(resolve,reject){
    _this.seq=_this.ws.seq;
    _this.ws.send(sendConfig(op,{
      seq: _this.seq,
      body:{action:action, data:sendData}
    }));
    _this.ws.onMessage[_this.seq]= {
      callback:(data)=>{
        if(!data||!data.body){
          reject();
          return;
        }
        else if(data.body.ret !== 0){
          reject(data.body.msg);
          return;
        }
        resolve(data.body.data);
      },
      date:new Date()
    };
  });
};

export default WebSocketProxy;
