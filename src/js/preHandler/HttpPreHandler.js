const httpPreHandler = function(app, req) {
  /*
  if (app.Storage.token.get()) {
    // console.log('app.prototype.Stroage', req.params instanceof Object)
    req.params instanceof Object &&
      (req.params.userId = app.Storage.token.get());
  }
  */
  if(req.url.path === '/v1/otc/'){
    let headers = new Headers();
    headers.set("Token", app.$store.state.token);
    req.data.headers = headers;
  }

};

export default httpPreHandler;
