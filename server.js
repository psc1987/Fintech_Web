/*
* Copyright by Dayyoung You (dryudryu@gmail.com)
*/

var express = require('express')
, http = require('http')
, fs = require('fs')
,connect = require('connect')
,cookieParser = require('cookie-parser')
,bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var COMMON = require('./modules/common');
var router = require('./modules/router');
var session = require('express-session');
var request = require('request');

var i18n = require('i18n');

i18n.configure({
  locales: ['en','ko','zh','ja'],
  defaultLocale: 'en',
  directory: __dirname + '/locales'
});

var app = express();
var server = http.createServer(app);

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({
  secret: 'keyboard warrior',
  resave: false,
  saveUninitialized: true
}));

app.use(i18n.init);

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.get('/signup', function(req, res){
  res.render('signup');
})


app.get('/getData', function (req, res) {
  var getUserDataURI = 'https://testapi.open-platform.or.kr/user/me?user_seq_no=1100034706'; // 토큰을 받을 수 있는 restful url
  var options = {
      url: getUserDataURI,
      method : 'GET',
      headers: {
          'Authorization' : 'Bearer deea0163-b4de-402c-8e66-1af4ffacb78a'
      }
  };
  request(options, function (error, response, body) {
      console.log(JSON.parse(body));
      res.send(body);
  })
})

app.get('/authResult', function(req, res){
  var code = req.query.code;
  //res.json(code);
  var option = {
      method: 'POST',
      url: 'https://testapi.open-platform.or.kr/oauth/2.0/token',
      header: 'Content-type: application/x-www-form-urlencoded; charset=UTF-8',
      form: {
          code : code,
          client_id : "l7xx62153d086573456a832a6fb43ba65b64",
          client_secret: "458bd766bfc74fa391c662d41a7a4abf",
          redirect_uri : 'http://localhost:3000/authResult',
          grant_type : 'authorization_code'
      }
  }
  request(option,function(err,response,body){
      console.log(body);
      res.send(body);
  })

})

router.setRestUrl(app);

server.listen(process.env.PORT || 7777, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server running on " +  COMMON.HOST_URL + ":" + addr.port);
});
