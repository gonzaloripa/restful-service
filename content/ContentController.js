//En el controlador se crean las rutas de la aplicacion y se enganchan con las acciones
var express = require('express');
var router = express.Router();//Permite crear el subconjunto de rutas que son independientes de la aplicacion completa

var bodyParser = require('body-parser');//Utilizado para manejar los datos, util para cuando se envien datos a traves de http post por un formulario
// crea application/x-www-form-urlencoded parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false}); //El objeto request que llega por post, contiene pares clave:valor. 

var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();

global.content="";

body.on('update', function (url,className,res) {
    console.info('\n\nCall completed '+ url + className); 
    
    var phantom = require("phantom");

    var _ph, _page, _outObj;
    phantom.create().then(ph => {
        _ph = ph;
        return _ph.createPage();
    }).then(page => {
        _page = page;
        return _page.open(url); //'http://cielosports.com/nota/73329/no_logra_levantar_cabeza/'
    }).then(status => {
        console.log(status);
        return _page.evaluate(function(c) {
            return document.getElementsByClassName(c)[0].getElementsByTagName("p")[0].innerHTML; //"cuerpo-nota"
        },className).then(function(html){
            //console.log("lo hizo " + className);
            content = html;
            res.redirect('/noticia');
            //body.emit("ready");
          
        }); 
        _page.close();
        _ph.exit()
    }).catch(e => console.log(e));
});


// POST /direc obtiene urlencoded bodies
router.post('/direc', urlEncodedParser ,function(req,res){
    console.log("Post was called.");
    //res.writeHead(200, {"Content-Type": "text/plain"});
    //res.write("Obteniendo el texto de la url solicitada...");
    //res.end();
    body.emit('update',req.body.url,req.body.class,res);
});

router.get('/', function(req, res){
        
            if(content == ""){
                console.log("entra");
                res.redirect("/noticia/input");                
            }
            else{
            res.json([     //retornar arreglo de noticias
                {
                    id:1,
                    cont: content
                }
            ]);
            res.end();
            }

});

router.get('/input', function(req, res){
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/noticia/direc" method="post">'+
    '<label for="url">Url:</label>'+
    '<input type="text" name="url" id="url"></input>'+
    '<label for="class">Class name:</label>'+
    '<input type="text" name="class" id="class"></input>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();

});


module.exports = router;