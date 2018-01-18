
//Essential vars
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Config vars
var port = 6969;
var verbose = false;

//User specific vars
var UUID = require('uuid/v1');
var IP = 'N/A';



app.get('/', function(req, res){
	IP = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('trying to load %s', __dirname + '/serving/index.html');
	res.sendFile(__dirname + '/serving/index.html');
});


app.get( '/*' , function(req, res, next) {
	//This is the current file they have requested
	var file = req.params[0]; 

	//For debugging, we can track what files are requested.
	if(verbose) console.log('\t :: Express :: file requested : ' + file);

	//Send the requesting client the file.
	res.sendFile( __dirname + '/' + file );
});




//////////// SOCKET.IO Definitions ////////////




//**List of players who are currently PLAYING the game**
//
// Active clients
//		0 = userID
//		1 = IP
//		2 = position
//		3 = color
//		4 = nickname
clients = [];


io.on('connection', function(socket){

	//Initialize user vars
	socket.userID = UUID();
	socket.userIP = IP;
	socket.nickname = "BananaMan";
	socket.playerInit = false;
	socket.userPosition = [0, 0, 0]; 
	socket.userColor = [0, 0, 0];
	
	//tell the server someone connected
	console.log('++ User ' + socket.userID + ' has connected with the IP: ' + socket.userIP);
	

	//tell the player they connected, giving them their id
    socket.on('onconnected', function(onSuccess) {
		//Package data
		var data = [socket.userID, clients];
		
		//Send data to client
		onSuccess(data);
    });
	
	//send list of current clients to the requesting client
    socket.on('updateActiveClients', function(onSuccess) {
		//Package data
		var data = [clients];
		
		//Send data to client
		onSuccess(data);
    });
	
	
	//Player has successfully entered a nickname and is now a player!
	socket.on('playerInit', function(playerData){
		
		//Give server the player's nickname and color
		socket.nickname = playerData.nickname;
		socket.userColor = playerData.color;
		
		//Push new client to our list
		clients.push([socket.userID, socket.userIP, socket.userPosition, socket.userColor, socket.nickname]);
	
		//player is now initialized and playing the game!
		socket.playerInit = true;
	
		//Let all clients know a new player has connect (except this socket that is sending it!)
		socket.broadcast.emit('playerConnected', clients[clients.length -1]);
	});
	
	
	// Each client emits this every 20ms
	// args contains vector3 position
	socket.on('updatePos', function(args) {
		args.name = socket.userID;
		socket.broadcast.emit('move', args);
    });
	
	
	//Called when a player dies
	socket.on('playerDeath', function(data) {
		socket.broadcast.emit('playerDeath', data);
    });
	
	
	//Player has changed their character's animation... send broadcast to all other clients
	socket.on('changePlayerAnimation', function(data) {
		socket.broadcast.emit('updateAnimation', data);
    });
	
	
	//Called when client disconnects
	socket.on('disconnect', function(){
		console.log('-- User ' + socket.userID + ' disconnected (' + socket.userIP + ')');

		//Remove this player from active list
		for(var x=0; x<clients.length; x++){
			if(clients[x][0] == socket.userID){
				clients.splice(x,1);
				break;
			}
		}
		
		//Let other clients know this player disconnected
		io.emit('playerDisconnect', socket.userID);
	});
	
});


http.listen(port, function(){
	console.log('listening on *: ' + port);
});