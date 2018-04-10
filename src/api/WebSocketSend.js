import sendConfig from '@/api/SendConfig.js';

function WebSocketProxy(ws) {
  this.ws=ws;
}

WebSocketProxy.prototype.seq=0;

WebSocketProxy.prototype.send=function(op,action,data){
  this.seq=this.ws.seq;
  this.ws.send(sendConfig(op,{
    seq: this.seq,
    body:{action:action, data:data}
  }));
  return this;
};

WebSocketProxy.prototype.message=function(func){
  this.ws.onMessage[this.seq]= {
    callback:(data)=>{
      func(data);
    },
    date:new Date()
  };
  return this;
};

export default WebSocketProxy;
