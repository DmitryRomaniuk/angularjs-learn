var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
var router = require('express').Router()

var app = express()

app.use(serveStatic(path.join(__dirname, 'node_modules')))
router.get('/todo.json', function(req, res) {
  console.log(req.url);
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  res.sendFile('/todo.json', options, function (err) {
    if (err) next(err);
  });
})
router.all('*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    var match = req.url.match(/(\.js)|(\.css)|(\.woff)|(\.svg)|(\.png)|(\.map)|(\.ttf)|(\.\w+\?_etag)/i);
    var file = (!match || req.url === '/') ? 'index.html' : req.url.slice(1);
    var options = {
        root: __dirname + '/public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };

    res.sendFile(file, options, function (err) {
      if (err) next(err);
    });
});
app.use(router)
app.listen(3000)
console.log('server started on port: localhost:3000')
