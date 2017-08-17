//Indica en que puerto debe escuchar la app
var app = require('./app');
var port = process.env.PORT || 3000;
//var ip = process.env.IP || 'localhost' ;
var https= require('https'); 

server = https.createServer(app); //crea servidor http, usa instancia de express
var server = app.listen(port, function() {  //Arranca el server
  console.log('Express server listening on port ' + port);
});

