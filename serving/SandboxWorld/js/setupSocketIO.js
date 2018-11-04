
function setupSocketIO(){

	socket.emit('onconnected', function(data) {

		mySocketId = data[0];
		activeClients = data[1];
		
		console.log("You successfully connected! \nYour ID is " + mySocketId);
		
		//		***SETUP PLAYER START***
		setupPlayer();
		
		
		
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
		
		//Update active clients
		updateActiveClients();
		
	});
	
	socket.on('playerDisconnect', function(data) {
		
		var playerID = data;
		
		console.log("-- player " + playerID + " has left the game");
		
		players.get(playerID).characterMesh.dispose();
		players.get(playerID).weapon.dispose();
		players.delete(playerID);
		
		
		//Update active clients
		updateActiveClients();
	});
	
	socket.on('move', function(args) {
		var userID = args.userID;
		
		if(players.get(userID) != undefined && players.get(userID).characterMesh != undefined) {
			
			players.get(userID).characterMesh.position.x = args.posX;
			players.get(userID).characterMesh.position.y = args.posY;
			players.get(userID).characterMesh.position.z = args.posZ;
			
			players.get(userID).characterMesh.rotation.y = args.rotY
		}
	});
	
	socket.on('updateAnimation', function(data) {
		
		animationCode = data.animationCode;
		animationType = data.animationType;
		userID = data.userID;
		
		updateOtherPlayersAnimation(animationCode, animationType, userID);
	});

	socket.on('update3DTerrain', function() {
		if(typeof nextTerrain != 'undefined'){
			nextTerrain.dispose();
		}
		
		var nextTerrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "/serving/TerrainViewer3D/grassOutput/out.png", 1000*terrainSize, 750*terrainSize, numSubdiv, 0, 150*terrainSize, scene, false, 
		function(){
			nextTerrain.visibility = false;
			updateTerrain(nextTerrain.getVerticesData(BABYLON.VertexBuffer.PositionKind));
		});
		
		console.log('*Terrain update');
	});
	
}


function createAnotherPlayer(uID, uColor){
	
	players.set(uID, []);
	
	/*players.get(uID).characterMesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	var playerMat = new BABYLON.StandardMaterial("mat_" + uID, scene);
	playerMat.diffuseColor = new BABYLON.Color3(uColor[0],uColor[1],uColor[2]);
	playerMat.emissiveColor = new BABYLON.Color3(uColor[0]/2,uColor[1]/2,uColor[2]/2);
	playerMat.specularColor = new BABYLON.Color3(1,1,1);
	players.get(uID).characterMesh.material = playerMat;*/
	
	
	BABYLON.SceneLoader.ImportMesh("", "/serving/Game/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		
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
		players.get(uID).characterMesh = playerMesh;
		players.get(uID).skeleton = playerSkeleton;
		players.get(uID).weapon = swordMesh;
		players.get(uID).curBodyAnimation = 0;
		players.get(uID).curArmAnimation = 0;
		players.get(uID).armProxy = [];
		players.get(uID).armProxy.armPrepped = true;
		players.get(uID).armProxy.armLock = false;

		// Start idle animation
		scene.beginAnimation(playerSkeleton, idleS, idleE, true, 1.0);
	});
	
}

function updateTerrain(endPositions){

	currentPositions = terrain.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	numVerts = currentPositions.length/3;

	stepCount = 0;
	yDiff = []; 
	yMax = 0;

	//console.log('num vertices: ' + numVerts);

	for(x=0; x<numVerts; x++){

		// Find Y value differences b/w start and end positions
		yDiff.push((endPositions[x*3+1]-currentPositions[x*3+1])/animationSteps);

		// Find Y max
		if(currentPositions[x*3+1]>yMax)
			yMax = currentPositions[x*3+1];

	}

	// Start update loop
	engine.runRenderLoop(changePositions);


}
	
	
function changePositions(){
		// Step Y value of verts
		for(x=0; x<numVerts; x++){
			currentPositions[x*3+1] += yDiff[x];
		}
	
		// Step vertice positions
		terrain.updateVerticesData(BABYLON.VertexBuffer.PositionKind, currentPositions);
		
		// Recalculate Normals
		var normals = [];
		BABYLON.VertexData.ComputeNormals(currentPositions, terrain.getIndices(), normals);
		terrain.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, true);
	
	
		stepCount++;
}

