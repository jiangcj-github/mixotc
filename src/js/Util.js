let Util={};

//返回浏览器类型
Util.browserType=function(){
  let userAgent = navigator.userAgent;
  let isOpera = false;
  if (userAgent.indexOf('Edge') > -1) {
    return "Edge";
  }
  if (userAgent.indexOf('.NET') > -1) {
    return "IE";
  }
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    isOpera = true;
    return "Opera"
  }
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  }
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  }
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  }
};

//置光标到元素末尾
Util.placeCaretAtEnd=function(el){
  el.focus();
  if (window.getSelection && document.createRange) {
    let range = document.createRange();
    let sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  else if (document.body.createTextRange) {
    let textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
};

export default Util;
