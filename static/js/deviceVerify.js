(function(){
   var u = navigator.userAgent;
   var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
   var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
   if (isAndroid) {
     window.location.href = "./com.mixotc.app_v1.0.0_debug.apk";
     return;
   }
  //  if (isiOS) {
  //    alert("IOS");
  //    return;
  //  }
})()