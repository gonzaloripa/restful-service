//Indica en que puerto debe escuchar la app
var app = require('./app');
var port = process.env.PORT;//||3000
var ip = process.env.IP;// || 'localhost'
var http = require('http'); 

var server = http.createServer(app); //crea servidor http, usa instancia de express
server.listen(port, ip, function() {  //Arranca el server
  console.log('Express server listening on port ' + port +'. Open: ' +'https://restfulapi-notice.herokuapp.com/noticia');
});

