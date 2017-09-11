//En el controlador se crean las rutas de la aplicacion y se enganchan con las acciones
var express = require('express');
var router = express.Router();//Permite crear el subconjunto de rutas que son independientes de la aplicacion completa

var bodyParser = require('body-parser');//Utilizado para manejar los datos, util para cuando se envien datos a traves de http post por un formulario
// crea application/x-www-form-urlencoded parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false}); //El objeto request que llega por post, contiene pares clave:valor. 

var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();

global.content="";
global.title="";

body.on('update', function (url,className,res) {
    console.info('\n\nCall completed '+ url + className); 
    
    var phantom = require("phantom");

    var _ph, _page, _outObj;
    phantom.create().then(ph => {
        _ph = ph;
        return _ph.createPage();
    }).then(page => {
        _page = page;
        return _page.open(url); //'http://cielosports.com/nota/75036/tuvimos_ese_espiritu_ganador_remarco_fernando_zuqui/'
    }).then(status => {
        console.log(status);
        return _page.evaluate(function(c) {
            var parrafos = document.getElementsByClassName(c)[0].getElementsByTagName("p");//"cuerpo-nota"
            var texto="";
            var titulo = document.getElementsByTagName("title")[0].innerText;
            for(i=0; i< parrafos.length; i++){
                texto += parrafos[i].innerText;
            }
            return [texto,titulo];//"cuerpo-nota"
        },className).then(function(html){
            //console.log("lo hizo " + className);
            content = html[0];
            title= html[1];
            res.redirect('/noticia');
            //body.emit("ready");
          
        });
        _page.close();
        _ph.exit()
    }).catch(e => {console.log("-Error"+e);
                   res.redirect('/noticia'); 
                  });
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
            res.set("Content-Type","application/json");
            res.json([     //retornar arreglo de noticias
                {
                    id:1,
                    cont: content,
                    title: title
                }
            ]);
            
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
    res.status(200);
    res.set("Content-Type","text/html");
    res.write(body);
    res.end();

});


module.exports = router;
