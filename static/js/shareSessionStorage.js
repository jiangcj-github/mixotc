(function(){
if(!sessionStorage.getItem('otcToken')) {
// 这个调用能触发目标事件，从而达到共享数据的目的
 localStorage.setItem("getSessionStorage", Date.now());
};

// 该事件是核心
window.addEventListener('storage', function(event){
if (event.key == "getSessionStorage") {
  // 已存在的标签页会收到这个事件
  localStorage.setItem(
    "otcToken",
    JSON.stringify(sessionStorage.getItem("otcToken"))
  );
  localStorage.removeItem("otcToken");
} else if (event.key == "otcToken" && !sessionStorage.getItem("otcToken")) {
  // 新开启的标签页会收到这个事件
  //  var data = JSON.parse(event.newValue);
  if(event.newValue === 'null') return;
  //  for (key in data) {
     event.newValue && sessionStorage.setItem("otcToken", event.newValue.substring(1, event.newValue.length - 1));
  //  }
    }
 });
})();