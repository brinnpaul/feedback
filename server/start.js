'use strict';
//require('babel-register')
var chalk = require('chalk');
var db = require('./database');

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
	console.log("app created");
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    require('socket.io')(server);   // Attach socket.io.
};

var startServer = function () {
	console.log("server started");
    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

db.sync().then(createApplication).then(startServer).catch(function (err) {
    console.error(chalk.red(err.stack));
    process.kill(1);
});
