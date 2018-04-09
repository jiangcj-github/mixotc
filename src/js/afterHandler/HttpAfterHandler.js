const httpAfterHandler = function (app, req, res) {
  // console.log('12312313',res, req)
  let result = res.result
  if (result.code !== 200 || result.msg !== 'OK') {
    console.error(req.data.url, result.msg, result.code, result.data, result)
    res.result =  {msg: result.msg, data: result.data, code: result.code}
  }
  res.result = result.data
  // this = this.data
  // console.log('111111111', result)
  // return this.data
}

export default httpAfterHandler
