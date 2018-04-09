/**
 * 使用方法
 *  1.在ProxyConfig配置好相关参数
 *  2.直接this.Proxy.XXX生成链接，返回promise
 *      注：若需要参数，this.Proxy.XXX（params）
 */

import Fetch from "../libs/Fetch"; //引入Fetch

let host, port;

const HTTP_PROXY = {
  install(app, ServerConfig, httpList, httpPreHandler, httpAfterHandler) {
    host = ServerConfig.host;
    port = ServerConfig.port;
    httpList.forEach(v => {
      HTTP_PROXY[v.name] = async params => {
        let req = {},
          res = {};
        req.data = { ...v.data };
        req.params = params;
        // console.log('0', req.params)
        if (httpPreHandler) {
          httpPreHandler(app, req);
        }
        // console.log('1', req.params)
        // data.headers = new Headers({'tes1t': '1111'})//自定义请求头
        if (req.data.url.indexOf(":") > 0) {
          let urlArr = req.data.url.split(":"),
            url = urlArr[0],
            replaceKey = urlArr[1];
          // console.log(
          //   "req.data.url.indexOf",
          //   req.data.url,
          //   req.data.url.indexOf(":"),
          //   urlArr,
          //   url,
          //   replaceKey
          // );
          req.data.url = `${url}${req.params[replaceKey]}`;
          delete req.params[replaceKey];
        }
        req.data.url &&
          (req.data.url = `http://${host}:${port}${req.data.url}`);
        if (req.params && req.data.method === "post")
          Object.keys(req.params).length > 0 &&
            (req.data.body = JSON.stringify(req.params));
        if (req.params && req.data.method === "get")
          Object.keys(req.params).length > 0 &&
            (req.data.url += `?`) &&
            Object.keys(req.params).forEach(
              (key, index) =>
                (req.data.url += `${key}=${req.params[key]}`) &&
                Object.keys(req.params).length - 1 !== index &&
                (req.data.url += "&")
            );
        // console.log({...req.data})
        res.result = await Fetch({ ...req.data });
        // console.log(data.url, !result, result.code !== 200, result.msg !== 'ok', result,httpFilter)
        if (httpAfterHandler) {
          httpAfterHandler(app, req, res);
        }
        return res.result;
      };
    });
  },
  fetch: Fetch
};

export default HTTP_PROXY;
