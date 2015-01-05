var express = require('express');
var pontos = require('./routes/pontos');
var app = express();

app.get('/pontos', pontos.findAll);
app.listen(3000);
console.log('Escutando na porta 3000...');
