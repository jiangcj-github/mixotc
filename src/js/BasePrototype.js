let config = {}

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

//价格前后缀
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


export default {
  install(configCache) {
    config = configCache
  }
}
