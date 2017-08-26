//En el controlador se crean las rutas de la aplicacion y se enganchan con las acciones
var express = require('express');
var router = express.Router();//Permite crear el subconjunto de rutas que son independientes de la aplicacion completa
//router = express.Router(); //crea objeto tipo express.Router, que permite procesar peticiones http
var bodyParser = require('body-parser');//Utilizado para manejar los datos, util para cuando se envien datos a traves de http post por un formulario

router.use(bodyParser.urlencoded({ extended: true }));
//var Content = require('./Content'); //Modelo de user (del módulo mongoose). Se obtienen automaticamente todos los metodos necesarios para interactuar con la bbdd, incluyendo create, read, update y delete

var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();

global.content="";

body.on('update', function (url,className,res) {
    console.info('\n\nCall completed '+ url + className); // HOORAY! THIS WORKS!
    
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

body.on("ready",function(){

});

//Operaciones CRUD para interactuar con la base en REST: se usan los request HTTP para las acciones
/*
// CREATES A NEW USER
router.post('/', function (req, res) { //Post: envia datos al servidor. Tiene 2 parametros: el primero la ruta asignada a la funcion anonima que es el segundo parametro.
                                       //La funcion tiene 2 parametros, uno representa el request al servidor y el otro la response 
    User.create({  //"Metodo create del modelo, 2 parametros:el primero un objeto que contiene los valores a insertar en la base (misma estructura que el esquema definido en "db.js")
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) { //El segundo parametro es una funcion callback, la cual se invoca con 2 parametros: un valor de error y otro de success si es que se pudo agregar al nuevo usuario
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user); //En la respuesta se muestran los datos del nuevo usuario
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) { //Get: obtiene datos del servidor. Mismos dos parametros que .post(). Dentro de la funcion se invoca al metodo find() del modelo user para retornar valores de la BBDD.
    User.find({}, function (err, users) { //2 parametros: un objeto que define que requisitos deben cumplir los valores a retornar, es un filtro tipo la clausula Where de sql (como en este caso es vacio, se devuelven todos los usuarios de la base)  y una funcion callback
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users); //Se muestran los datos de todos los usuarios
    });
});
*/
router.post('/direc', function(req,res){
    console.log("Post was called.");
    //res.writeHead(200, {"Content-Type": "text/plain"});
    //res.write("Obteniendo el texto de la url solicitada...");
    //res.end();
    //body.data = querystring.parse(postData).text;
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


// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) { // Se obtiene info en base al valor que se pasa como parametro de query o de ruta :id, que será un valor que se envía junto con el request
    User.findById(req.params.id, function (err, user) { //Se obtiene el valor mediante el objeto req.params, donde el nombre del parametro se asigna a un campo del objeto con el mismo nombre
                                                        //El metodo de mongoose findById obtiene un registro pasandole solo el valor de id. La funcion callback se invoca siempre que se devuelva un valor en la consulta a la base
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) { //Delete: eliminar datos del servidor
    User.findByIdAndRemove(req.params.id, function (err, user) { //El metodo de mongoose elimina un usuario pasandole un id
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE  Put: enviar y actualizar datos en el servidor.
router.put('/:id', function (req, res) { //Ademas de recibir un id, toma los parametros del body del request como en POST. Solo en estos dos metodos http tienen body
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) { //El metodo de mongoose necesita de 3 parametros: el id del query parameter, un objeto que corresponde con el usuario al cual se van a actualizar sus valores y la funcion callback
                                                                //Se agrega un cuarto parametro, el objeto {new :true} que representa la opción de qué version del usuario retornar: si es false será la version anterior y si es true la version actualizada , para luego poder devolver los valores actualizados del usuario
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;