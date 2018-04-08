const httpFilter = function (url) {
  if (this.code !== 200 || this.msg !== 'OK') {
    console.error(url, this.msg, this.code, this.data, this)
    return {msg: this.msg, data: this.data, code: this.code}
  }
  return this.data
}

export default httpFilter
