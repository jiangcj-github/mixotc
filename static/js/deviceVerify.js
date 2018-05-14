(function(){
  var system = { win: false, mac: false, xll: false };
  //检测平台
  var p = navigator.platform;
  console.log(p)
  system.win = p.indexOf("Win") == 0;
  system.mac = p.indexOf("Mac") == 0;
  system.xll = p == "Xll" || p.indexOf("Linux") == 0;
  var local = location.href;
  //跳转语句
  // PC端
  if (system.win || system.mac || system.xll) return;
  //若用PC端网址路径访问则自动跳转到对应移动端路径
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if(isAndroid) {
    window.localtion.href = "./com.mixotc.app_v1.0.0_debug.apk";
  }
})()