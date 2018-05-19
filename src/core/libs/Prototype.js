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

String.prototype.limit = function (number) {
  let arr = this.split(""),
    length = 0,
    index = 0;
  for (let i = 0; i < arr.length; i++) {
    /[\u4e00-\u9fa5]/.test(arr[i]) && (length += 2);
    !/[\u4e00-\u9fa5]/.test(arr[i]) && (length += 1);
    if (length > number) {
      index = i;
      break;
    }
  }
  if(index > 0) {
    return arr.slice(0, index).join("");
  }
  return this;
}
// 处理换行
String.prototype.br = function(){
  let result = this.split("").map(item => {
    if (item === "\n") item = "<br>";
    return item;
  }).join('');
  return result;
};
// 显示银行卡号
String.prototype.showBank = function(){
  return `****${this.slice(-4)}`;
}
// 显示身份证等卡号格式：123****128
String.prototype.showOther = function() {
  return this.length > 6 ? `${this.slice(0, 3)}****${this.slice(-3)}` : this;
};
// 显示邮箱账号123***@163.com
String.prototype.showEmail = function() {
  let index = this.indexOf('@');
  let left = this.slice(0, index);
  let right = this.slice(index, this.length);
  if(left.length >3) {
    left = left.slice(0,3);
    return `${left}***${right}`;
  };
  return this;
};
// 输入银行卡显示
String.prototype.formatCard = function() {
  let str = '';
  for (let i = 0; i < this.length; i++) {
    if(i !== 0 && i%4 === 0){
      str += ' '
    }
    str += this[i]
  }
  return str;
}

//格式化秒-短格式
/*
 * 传入：124
 * 返回：2min
 */
Number.prototype.formatSecord=function(){
  let h,m,s;
  if(this<60){
    s=this;
    return s+"s";
  }else if(this>=60&&this<3600){
    let m=Math.floor(this/60);
    let s=this-m*60;
    return m+"m"+s+"s";
  }else{
    let h=Math.floor(this/3600);
    let m=Math.floor((this-h*3600)/60);
    let s=this-h*3600-m*60;
    return h+"h"+m+"m"+s+"s";
  }
};

Number.prototype.formatSecord2=function(){
  let h,m,s;
  if(this<60){
    s=this;
    return s+"s";
  }else if(this>=60&&this<3600){
    let m=Math.floor(this/60);
    return m+"min";
  }else{
    let h=Math.floor(this/3600);
    return h+"h";
  }
};

//保留小数点后n位
String.prototype.formatFixed=function(n){
  if(n<0) return;
  let i=this.indexOf(".");
  if(i<=0) return this;
  return this.substr(0,i+n+1);
};

// 时间格式化
Number.prototype.toDate = function (fmt) {
  let date = new Date(this * 1000);
  return date.dateHandle(fmt)
};
// 时间戳转化为min:second，早于今天转化为xx月xx日min:second
Number.prototype.formatTime = function() {
  let time = new Date(this);
  let ms = `${time.getHours() > 9 ? time.getHours() : "0" + time.getHours()}:${time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()}`;
  if (this < new Date() - 0 && time.getDate() !== new Date().getDate()) {
    return (time.getMonth() + 1) + "月" + time.getDate() + "日" + ms;
  }
  return ms;
};
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
