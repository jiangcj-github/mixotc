/**
 * 使用方法
 *  1.在ProxyConfig配置好相关参数
 *  2.直接this.Proxy.XXX生成链接，返回promise
 *      注：若需要参数，this.Proxy.XXX（params）
 */

import Fetch from '../libs/Fetch'//引入Fetch

let host, port

const HTTP_PROXY = {
  install(ServerConfig, httpProxyList, httpFilter) {
    host = ServerConfig.host
    port = ServerConfig.port
    httpProxyList.forEach(v => {
      HTTP_PROXY[v.name] = async params => {
        let data = {...v.data}
        // data.headers = news Headers({'tes1t': '1111'})//自定义请求头
        data.url && (data.url = `http://${host}:${port}${data.url}`)
        if (params && data.method === 'post') data.body = JSON.stringify(params)
        if (params && data.method === 'get') (data.url += `?`) && Object.keys(params).forEach((key, index) => (data.url += `${key}=${params[key]}`) && Object.keys(params).length - 1 !== index && (data.url += '&'))
        let result = await Fetch({...data})
        // console.log(data.url, !result, result.code !== 200, result.msg !== 'ok', result,httpFilter)
        if(httpFilter){
          result.httpFilter = httpFilter
          return result.httpFilter(data.url)
        }
        return result
      }
    })
  },
  fetch: Fetch
}

export default HTTP_PROXY
