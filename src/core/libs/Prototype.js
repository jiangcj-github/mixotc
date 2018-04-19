let config = {};

//百分数显示
Number.prototype.toPercent = function(prefixType) {
  let number = config.toPercent.number || 2;
  let type = 0;
  if (this < 0) type = 1;
  type = prefixType || type;
  return (
    config.toPercent.perfix[type] +
    Math.abs(parseFloat((this * 100).toFixed(number))) +
    "%"
  );
};

String.prototype.shearStr = function(number, suffix = "...") {
  typeof number === "boolean" && !number && (number = this.length);
  return this.slice(0, number) + suffix;
};

// 倒计时显示
Number.prototype.resetTime = function () { // 倒计时操作
  let timer = null;
  let m = 0;
  let s = 0;
  m = Math.floor(this / 60 % 60);
  // m < 10 && (m = '0' + m);
  s = Math.floor(this % 60);
  function countDown() {
    s--;
    s < 10 && ( s= '0' + s);
    if (s.length >= 3) {
      s = 59;
      m = "0" + (Number(m) - 1);
    }
    if(m.length >= 3) {
      m = '00';
      s = '00';
      clearInterval(timer);
    }
    return `还剩${m}分钟${s}秒`
  }
  timer = setInterval(countDown, 1000);
}

Number.prototype.toDate = function(fmt) {
  let date = new Date(this * 1000);
  return date.dateHandle(fmt);
};

//格式化秒
/*
 * 传入：124
 * 返回：2min4s
 */
Number.prototype.formatSecord=function(){
  let h,m,s;
  if(this<60){
    s=this;
    return "${s}s";
  }else if(this>=60&&this<3600){
    let m=Math.floor(this/60);
    let s=this-m*60;
    return "${m}min${s}s";
  }else{
    let h=Math.floor(this/3600);
    let m=Math.floor((this-h*3600)/60);
    let s=this-h*3600-m*60;
    return "${h}h${m}min${s}s";
  }


    return "${h}h${m}min${s}s"
};
// xxxx-yy-zz, hh:mm:ss
/**
 * {
 *    date: ''
 * }
 *
 *
 * @returns {string}
 */
Date.prototype.dateHandle = function(fmt) {
  fmt = fmt || "yyyy-MM-dd HH:mm:ss";
  let obj = {
    y: this.getFullYear(), // 年份，注意必须用getFullYear
    M: this.getMonth() + 1, // 月份，注意是从0-11
    d: this.getDate(), // 日期
    w: this.getDay(),
    H: this.getHours(), // 24小时制
    h: this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 12小时制
    m: this.getMinutes(), // 分钟
    s: this.getSeconds(), // 秒
    S: this.getMilliseconds() // 毫秒
  };
  let week = ["日", "一", "二", "三", "四", "五", "六"];
  for (let i in obj) {
    fmt = fmt.replace(new RegExp(i + "+", "g"), function(wfy) {
      let val = obj[i] + "";
      if (i === "w") return (wfy.length > 2 ? "星期" : "周") + week[val];
      for (let j = 0, len = val.length; j < wfy.length - len; j++)
        val = "0" + val;
      return wfy.length === 1 ? val : val.substring(val.length - wfy.length);
    });
  }
  return fmt;
};

export default {
  install(app, configCache) {
    config = configCache;
  }
};
