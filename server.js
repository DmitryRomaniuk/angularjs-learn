var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic(path.join(__dirname, 'node_modules')))
app.use(serveStatic(path.join(__dirname, 'public')))
app.listen(3000)
console.log('server started on port: 3000')
