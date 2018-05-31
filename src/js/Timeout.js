//定时器函数，自动释放
let timer={};
let timeout=function(callback,delay,name="timer0"){
  if(timer[name]){
    clearTimeout(timer[name]);
  }
  timer[name]=setTimeout(()=>{
    callback && callback();
  },delay);
};

export default timeout;
