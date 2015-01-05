var express = require('express');
var pontos = require('./routes/pontos');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/pontos/:id', pontos.findAll);
app.listen(3000);
console.log('Escutando na porta 3000...');
