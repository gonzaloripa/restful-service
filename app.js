<<<<<<< HEAD
var express = require('express'), 
		bodyParser = require('body-parser'), 
		http = require('http'), 
		app, 
		router, 
		server;

app = express(); // crea instancia del framework express
app.use(bodyParser.json()); //se procesan tramas json

var phantom = require("phantom");
var _ph, _page, _outObj;

phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
}).then(page => {
    _page = page;
    return _page.open('http://cielosports.com/nota/73329/no_logra_levantar_cabeza/');
}).then(status => {
    console.log(status);
    return _page.evaluate(function() {
        return document.getElementsByClassName("cuerpo-nota")[0].getElementsByTagName("p")[0].innerHTML;
    }).then(function(html){
        console.log(html);
        global.content = html;
    }); 
    _page.close();
    _ph.exit()
}).catch(e => console.log(e));


router = express.Router(); //crea objeto tipo express.Router, que permite procesar peticiones http
router.get('/', function(req, res){
	res.json([     //retornar arreglo de noticias
			{
				id:1,
				cont: content
			}
		]);
});

app.use('/noticia',router); //publica url /noticia
server = http.createServer(app); //crea servidor http, usa instancia de express
server.listen(8888,'localhost', function(){  //process.env.PORT,process.env.IP
	console.log('https://restfulapi-notice.herokuapp.com/noticia');
});
=======
//Contiene la info de configuración de la app
var express = require('express');
var bodyParser = require('body-parser');
var app = express(); // crea instancia del framework express
//var db = require('./db'); //La app sabe que hay una conexion a la base disponible

var ContentController = require('./content/ContentController'); //Requerimos el Router del controlador de usuarios
app.use(bodyParser.json()); //se procesan tramas json
app.use('/noticia', ContentController); //Con app.use()lo vinculamos a la ruta /noticia. Ahora la ruta / definida en el controlador se va a mapear a /noticia


module.exports = app;







>>>>>>> e4396652462373c556ffb3ea2d8b203156b079ad
