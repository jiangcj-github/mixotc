let config = {}

//百分数显示
Number.prototype.toPercent = function (prefixType) {
  let number = config.toPercent.number || 2
  let type = 0
  if (this < 0) type = 1
  type = prefixType || type
  return config.toPercent.perfix[type] + Math.abs(parseFloat((this * 100).toFixed(number))) + '%';
};

//价格格式化
Number.prototype.formatNumber = function () {
  let type = this > 0 ? 1 : -1
  let numberValue = config.format.numberValue;
  let number = Math.abs(this), flag = config.format.numberFunc.length - 1;
  for (let i = 0; i < numberValue.length; i++) {
    if (number >= numberValue[i]) {
      flag = i;
      break
    }
  }
  return type*config.format.numberFunc[flag](number);
};

Number.prototype.format = function (para) {
  if (this === 0)
    return '?'
  let obj = para instanceof Object && para || (typeof para === 'string' && config.format.moneyFix[para] || {});
  let prefix = obj.prefix !== undefined ? obj.prefix : "";
  let suffix = obj.suffix !== undefined ? obj.suffix : "";
  let numberValue = config.format.numberValue;
  let number = Math.abs(this), flag = config.format.numberFunc.length - 1;
  for (let i = 0; i < numberValue.length; i++) {
    if (number >= numberValue[i]) {
      flag = i;
      break
    }
  }
  number = Math.abs(this.formatNumber())
  // console.log(number)
  let numberArr = number.toString().split('.'), negative = this < 0 ? "-" : "", decimal = '.', thousand = ', ',
    i = numberArr[0],
    j = (j = i.length) > 3 ? j % 3 : 0,
    numberSuffix = config.format.numberSuffixArr[flag] || '';
  suffix += numberSuffix;
  return prefix + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (numberArr.length > 1 ? decimal + numberArr[1] : '') + suffix;
}


String.prototype.shearStr = function (number, suffix = '...') {
  typeof number === 'boolean' && !number && (number = this.length)
  return this.slice(0, number) + suffix;
};

Number.prototype.toDate = function (fmt) {
  let date = new Date(this);
  return date.dateHandle(fmt)
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
Date.prototype.dateHandle = function (fmt) {
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  let obj =
    {
      'y': this.getFullYear(), // 年份，注意必须用getFullYear
      'M': this.getMonth() + 1, // 月份，注意是从0-11
      'd': this.getDate(), // 日期
      'w': this.getDay(),
      'H': this.getHours(), // 24小时制
      'h': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 12小时制
      'm': this.getMinutes(), // 分钟
      's': this.getSeconds(), // 秒
      'S': this.getMilliseconds() // 毫秒
    };
  let week = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (wfy) {
      let val = obj[i] + '';
      if (i === 'w') return (wfy.length > 2 ? '星期' : '周') + week[val];
      for (let j = 0, len = val.length; j < wfy.length - len; j++) val = '0' + val;
      return wfy.length === 1 ? val : val.substring(val.length - wfy.length);
    });
  }
  return fmt;
};


export default {
  install(configCache) {
    config = configCache
  }
}





