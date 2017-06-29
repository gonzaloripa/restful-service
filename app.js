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
	res.json([     //retornar arreglo de productos
			{
				id:1,
				cont: content
			}
		]);
});

app.use('/noticia',router); //publica url /products
server = http.createServer(app); //crea servidor http, usa instancia de express
server.listen(4567,'https://restfulapi-notice.herokuapp.com', function(){
	console.log('https://restfulapi-notice.herokuapp.com/noticia');
});
