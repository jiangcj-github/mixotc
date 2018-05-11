//定时器函数，自动释放
let timer=null;
let timeout=function(callback,delay){
  if(timer){
    clearTimeout(timer);
  }
  timer=setTimeout(()=>{
    callback();
  },delay);
};

export default timeout;
