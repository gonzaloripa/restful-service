var express = require('express'), 
		bodyParser = require('body-parser'), 
		http = require('http'), 
		app, 
		router, 
		server;

app = express(); // crea instancia del framework express
app.use(bodyParser.json()); //se procesan tramas json

const phantom = require('phantom');

(async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    });

    const status = await page.open('http://cielosports.com/nota/73329/no_logra_levantar_cabeza/');
    console.log(status);

    page.evaluate(function() {
        return document.getElementsByClassName("cuerpo-nota")[0].getElementsByTagName("p")[0].innerHTML;
    }).then(function(html){
        console.log(html);
        global.content = html;
    });
//    const content = await page.property('content');
//    console.log(content);

    await instance.exit();
}());


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
server.listen(3000, function(){
	console.log('https://restfulapi-notice.herokuapp.com/noticia');
});
