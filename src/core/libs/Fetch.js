/**
 * fetch请求api
 * @param invoke 为对象，{url, paras}, paras为fetch其他参数，亦可为多个invoke对象，参数相同
 * @returns {*} 返回请求的data，或者[data, data]
 */
import JsonBig from "json-bigint";
import 'whatwg-fetch';

export default async (url, params) => {
  return await fetch(url, params).then(response => response.text()).then(results => JsonBig.parse(results), (reject, obj) => obj = {code:0,msg:'JSON解析出错',data:reject})
}
