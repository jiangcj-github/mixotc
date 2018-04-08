/**
 * fetch请求api
 * @param invoke 为对象，{url, paras}, paras为fetch其他参数，亦可为多个invoke对象，参数相同
 * @returns {*} 返回请求的data，或者[data, data]
 */
export default async function (params) {
  let url = params.url, obj = {...params}
  delete obj.url
  return await fetch(url, obj).then(response => response.json()).then(results => results, result => obj = {code:0,msg:'JSON解析出错',data:result})
}
