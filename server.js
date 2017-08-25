//Indica en que puerto debe escuchar la app
var app = require('./app');
var port = 3000//process.env.PORT;//||3000
var ip = 'localhost'//process.env.IP;// || 'localhost'
var http = require('http'); 

var server = http.createServer(app); //crea servidor http, usa instancia de express
server.listen(port, ip, function() {  //Arranca el server
  console.log('Express server listening on port ' + port +'. Open: ' +'https://restfulapi-notice.herokuapp.com/noticia');
});

