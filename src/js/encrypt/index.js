import stringToBytes from "./stringToBytes.js";
import crypto from "crypto";
export default function getSafePass(plainPass, uid) {
  // '197102307060486144'
  let uidArr = [], // id数组
    sum = 0, // id 求和
    halfPass = "", // 转换密码
    sha1 = crypto.createHash("sha1"), // 创建并返回一个Hash可用于使用给定生成哈希摘要的对象algorithm
    endData = "";
  for (let j = 0; j < uid.length; j++) {
    // 字符串变数组
    uidArr.push(uid[j] * 1);
  }
  // console.log('getSafePass 0', uidArr)
  uidArr.forEach(v => {
    // 数组求和
    sum = sum + v;
    return sum;
  });
  // console.log('getSafePass 1', uidArr, sum, sum%3, plainPass)
  for (let i = 0; i < plainPass.length; i++) {
    // 生成新密码
    if (i % 3 !== sum % 3) {
      //console.log('getSafePass 2',halfPass)
      halfPass += plainPass.substring(i, i + 1);
    }
  }
  halfPass += uid;
  // console.log('getSafePass 3', sha1, halfPass, typeof halfPass, stringToBytes(halfPass))
  sha1.update(stringToBytes(halfPass)); // 更新散列内容
  endData = sha1.digest(); //计算传递给散列的所有数据的摘要
  // console.log('getSafePass 4','plainPass',plainPass, sha1, halfPass, 'salt',endData,plainPass.split('').map(v=>v.charCodeAt()))
  let salt = endData,
    iter = 1005,
    encryptResult = crypto.pbkdf2Sync(
      plainPass.split("").map(v => v.charCodeAt()),
      salt,
      iter,
      32,
      "sha1"
    ); //bit bytes
  // console.log('getSafePass 5',encryptResult,encryptResult.slice(0, 32).toString('base64'), encryptResult.toString('base64'))
  return encryptResult.toString("base64"); // Base64加密再 encode;
}
