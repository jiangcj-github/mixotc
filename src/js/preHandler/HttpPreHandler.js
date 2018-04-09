const httpPreHandler = function (app, req) {
  // console.log('httpPreHandler', app.prototype.Storage.token.get())
  if (app.prototype.Storage.token.get()) {
    // console.log('app.prototype.Stroage', req.params instanceof Object)
    req.params instanceof Object && (req.params.userId = app.prototype.Storage.token.get())
  }
}

export default httpPreHandler
