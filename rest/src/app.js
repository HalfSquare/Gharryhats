var http = require('http');
var url = require('url');

var name = require('./test');

http.createServer(function (req, res) {
  let urlBase = url.parse(req.url, true);
  let path = urlBase.pathname;
  let stuff = urlBase.query;


  console.log("url arg:", path.split("/"));

  console.log("args:", stuff);


  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(name.getName(stuff.myass)));

}).listen(8080);