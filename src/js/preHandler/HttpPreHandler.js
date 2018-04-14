const httpPreHandler = function(app, req) {
  // console.log('httpPreHandler', app.$store)
  if (app.Storage.token.get()) {
    // console.log('app.prototype.Stroage', req.params instanceof Object)
    req.params instanceof Object &&
      (req.params.userId = app.Storage.token.get());
  }
};

export default httpPreHandler;
