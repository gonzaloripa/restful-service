//Contiene la info de configuración de la app
var express = require('express');
var app = express(); // crea instancia del framework express

var ContentController = require('./content/ContentController'); //Requerimos el Router del controlador de usuarios

app.use('/noticia', ContentController); //Con app.use()lo vinculamos a la ruta /noticia. Ahora la ruta / definida en el controlador se va a mapear a /noticia

module.exports = app;







