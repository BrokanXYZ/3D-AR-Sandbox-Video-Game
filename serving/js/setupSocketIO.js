
function setupSocketIO(){
	
	socket.emit('onconnected', function(data) {

		mySocketId = data[0];
		activeClients = data[1];
		
		console.log("You successfully connected! \nYour ID is " + mySocketId);
		
		for(x=0; x<activeClients.length; x++){
			//Client vars
			var uID = activeClients[x][0];
			//var uPosition = activeClients[x][2];
			var uColor = activeClients[x][3];
			
			//Create player mesh
			createAnotherPlayer(uID, uColor);
		}
		
	});

	
	socket.on('playerConnected', function(data) {
		
		//get new player's data
		var uID = data[0];
		//var uPosition = data[2];
		var uColor = data[3];
		
		console.log('++ User ' + uID + ' has joined!');
			
		//Create player mesh
		createAnotherPlayer(uID, uColor);
			
		//Spawn effect
		setTimeout(function(){
			respawnParticles(players[uID]);
		}, 100);
		
		
		//Update active clients
		updateActiveClients();
		
	});
	
	
	socket.on('playerDisconnect', function(data) {
		
		var playerID = data;
		
		console.log("-- player " + playerID + " has left the game");
		
		if(players[playerID]) {
			//Delete weapon mesh
			players[playerID].weapon.dispose();
			players[playerID].weapon = null;
			
			//Delete player mesh
			players[playerID].characterMesh.dispose();
			players[playerID] = null;
		}
		
		//Update active clients
		updateActiveClients();
	});
	

	socket.on('move', function(args) {
		var userID = args.userID;
		
		if(players[userID] != undefined) {
			
			
			players[userID].characterMesh.position.x = args.posX;
			players[userID].characterMesh.position.y = args.posY;
			players[userID].characterMesh.position.z = args.posZ;
			
			players[userID].characterMesh.rotation.y = args.rotY
		}
	});
	
	
	socket.on('playerDeath', function(data) {
		console.log("player " + data.userID + " has died.");
		players[data.userID].characterMesh.isVisible = false;
		players[data.userID].weapon.isVisible = false;
		
		//Death effect
		deathParticles(data.location);
		
		//using this instead of an ON_RESPAWN (more efficient*)
		setTimeout(function(){
			players[data.userID].characterMesh.isVisible = true;
			players[data.userID].weapon.isVisible = true;
			respawnParticles(players[data.userID]);
		}, 10000);
	});
	
	
	socket.on('updateAnimation', function(data) {
		
		animationCode = data.animationCode;
		animationType = data.animationType;
		userID = data.userID;
		
		updateOtherPlayersAnimation(animationCode, animationType, userID);
	});
	
	
	socket.on('lostHealth', function() {
		
		// P1 was hit, therefore action lock for 1/2s
		delayActions(gotHitDelay);
		
		// Update Health
		switch(hpBar.width){
			case "400px":
				hpBar.width = "300px";
				break;
			case "300px":
				hpBar.width = "200px";
				break;
			case "200px":
				hpBar.width = "100px";
				break;
			case "100px":
				// DEATH!
				player1Death(false);
				hpBar.width = "400px";
				break;
		}
		
		
		
	});
	
	socket.on('playerGotHit', function(uID) {
		// Player color flash
		playerColorFlash(uID);
		gotHit.play();
	});
	
	socket.on('playSound', function(data) {
		
		switch(data.soundID){
			// Swing
			case 0:
				swing.play();
				break;
			// Block
			case 1:
				block.play();
				break;
			// Hit
			case 2:
				gotHit.play();
				break;
		}
		
	});
	
	function createAnotherPlayer(uID, uColor){
		BABYLON.SceneLoader.ImportMesh("", "/serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		
			//Imported mesh results
			playerMesh = newMeshes[0];
			playerSkeleton = skeletons[0];
			swordMesh = newMeshes[1];
			
			//Player material
			var playerMat = new BABYLON.StandardMaterial("mat_" + uID, scene);
			playerMat.emissiveColor = new BABYLON.Color3(0,0,0);
			playerMat.diffuseColor = new BABYLON.Color3(uColor[0],uColor[1],uColor[2]);
			playerMat.specularColor = new BABYLON.Color3(0,0,0);
			
			//Sword material
			var swordMat = new BABYLON.StandardMaterial("swordMat_" + uID, scene);
			swordMat.emissiveColor = new BABYLON.Color3(0.6,0.6,0.6);
			swordMat.diffuseColor = new BABYLON.Color3(0,0,0);
			swordMat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
			
			//Player model
			playerMesh.material = playerMat;
			playerMesh.checkCollisions = true;
			//playerMesh.isPickable = false;
			playerMesh.scaling = new BABYLON.Vector3(1.25,1.25,1.25);
			
			//Sword setup
			swordMesh.material = swordMat;
			swordMesh.attachToBone(playerSkeleton.bones[20], playerMesh);
			
			//Offset sword so its in correct position
			swordMesh.rotation.x = 2.984;
			swordMesh.rotation.y = 3.078;
			swordMesh.rotation.z = 1.602;
			swordMesh.position.x = 0.265;
			swordMesh.position.y = 0.031;
			swordMesh.position.z = 0.045;
			
			// Set blending speed on all bones
			for(var x=0; x<43; x++){
					playerSkeleton.bones[x].animations[0].blendingSpeed = 0.08;
			}
			// Enable blending on skeleton animations (EXCLUDING RIGHT ARM)
			for(var x=0; x<14; x++){
					playerSkeleton.bones[x].animations[0].enableBlending = true;
			}
			for(var x=23; x<43; x++){
					playerSkeleton.bones[x].animations[0].enableBlending = true;
			}
			
			//Save player variables to global array
			players[uID] = [];
			players[uID].characterMesh = playerMesh;
			players[uID].skeleton = playerSkeleton;
			players[uID].weapon = swordMesh;
			players[uID].curBodyAnimation = 0;
			players[uID].curArmAnimation = 0;
			players[uID].armProxy = [];
			players[uID].armProxy.armPrepped = true;
			players[uID].armProxy.armLock = false;
			
			// Start idle animation
			scene.beginAnimation(playerSkeleton, idleS, idleE, true, 1.0);
			
		});
	}
}

function playerColorFlash(socketID){
	players[socketID].characterMesh.material.emissiveColor.r = 1;
	setTimeout(function(){ players[socketID].characterMesh.material.emissiveColor.r = 0; }, 500);
}
