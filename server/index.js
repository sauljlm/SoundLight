const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');

const url = 'mongodb+srv://saul:sjlm2000@cluster0-wije2.mongodb.net/test?retryWrites=true&w=majority';
const app = express();
app.use(bodyParser.json());
app.use('/', routes);

mongoose.connect(url, 
{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('conected to dataBase');
})

app.listen(1234);
