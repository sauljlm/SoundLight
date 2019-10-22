const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');

const url = 'mongodb+srv://saul:sjlm2000@cluster0-wije2.mongodb.net/test?retryWrites=true&w=majority';
const app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/', routes);

app.set('port', process.env.PORT || 1234);

mongoose.connect(url, 
{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('conected to dataBase');
});

app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});
