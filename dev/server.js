"use strict";
//
// yakkety - server example
//
// Version: 0.0.1
// Author: Mark W. B. Ashcroft (mark [at] fluidecho [dot] com)
// License: MIT or Apache 2.0.
//
// Copyright (c) 2016 Mark W. B. Ashcroft.
// Copyright (c) 2016 FluidEcho.
//


const yakkety = require('../');


var options = {
	protocol: 'ws',						// or 'wss' for secure.
	slowHandshake: true,			// true: can do your own authorization and handshake or close socket.
	port: 8989,
	//key: fs.readFileSync(__dirname + '/keys/key.pem'),
  //cert: fs.readFileSync(__dirname + '/keys/cert.pem'),	
  //rejectUnauthorized: false,
	//requestCert: true
};


var server = new yakkety.server();

server.bind(options);

// auth clients:
server.on('authorize', function(client) {
  console.log('authorize client');
  
 	if ( !client.headers.authorization ) {
		client.goodbye(401);
	} else if ( client.headers.authorization.password === 'password' ) {
		client.handshake();
	} else {
		client.goodbye(401);
	} 
  
});

server.on('connected', function(client) {
  console.log('client connected');
	client.request('yakMethod', 'yakkety yak?', function(err, reply) {
		if ( err ) {
			console.log('client.request reply error', err);
			return;
		}
		console.log('got reply back:', reply.toString());
		client.message('this is rock and roll.');
	});		
});

server.on('message', function(message, meta) {
  console.log('server got message:', message.toString());
});

server.on('request', function(meta, req, rep) {
  console.log('got request, method: ' + meta.method + ', req:', req.toString());
  rep('yak!');
});

server.on('close', function(client) {
  console.log('client close-ed');
});

