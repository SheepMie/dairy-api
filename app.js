var express = require('express');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/dairy');  <4.11.0
var db = mongoose.connection.openUri('mongodb://localhost:27017/SheepDairy');  
db.on("error", function(error) {
    console.log("数据库连接失败：" + error);
});
db.on("open", function() {
    console.log("------数据库连接成功！------");    //数据模板创建用Schema模块去创建 
});

var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

var routes = require('./routes/index');

var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(morgan({stream: accessLog}));

app.use('/public', express.static(path.join(__dirname, 'public')));

routes(app);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;