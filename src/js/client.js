function Client() {
  // var MAX_CONNECT_TIME = 999999999999999999999999999999;
  // var DELAY = 1000;
  this.socket=null;
  this.createConnect();
}

Client.prototype.createConnect = function() {
  this.socket=connect();

  var heartBeatInterval;

  function connect() {
    var heartBeatInterval;
    var ws = new WebSocket("ws://39.106.157.67:8090/sub");
    ws.seq = 1; //序列号每send一次依次加1

    ws.addEventListener('open', function() {
      console.log("Connection open ...");
    });
    ws.addEventListener('message', function(evt) {
      console.log('Received Message: origin\n',evt.data);
      if (!heartBeatInterval) {
        heartBeatInterval = setInterval(heartBeat, 7000);
      }
    });
    
    ws.addEventListener('close', function(evt) {
      console.log("Connection closed.\n", evt);
      if (heartBeatInterval) clearInterval(heartBeatInterval);
      // setTimeout(reConnect, delay);
    });

    function heartBeat() {
      ws.send(JSON.stringify(
        { 
          ver: 1,
          op: 2, 
          seq: ws.seq++, 
          body: {} 
        }
      ));
    }
    return ws;
  }
  // function reConnect() {
  //   self.createConnect(--max, delay);
  // }
};

export default Client;
