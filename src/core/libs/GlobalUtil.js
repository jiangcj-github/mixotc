/**
 * 全局基本方法
 */

export default {
  //完全深拷贝数组和对象
  deepCopy(obj){
    return JSON.parse(JSON.stringify(obj))
  }
}
