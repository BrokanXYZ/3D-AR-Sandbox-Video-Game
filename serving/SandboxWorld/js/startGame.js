
function setupPlayer(){
	
	if(!spectate){
		playerCameraSetup();
		playerTrackingBoxSetup();
		playerCharacterSetup();
		movementControls();
	}else{
		spectateCamera();
	}
	
	function spectateCamera(){
		camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
		camera.attachControl(canvas, true);
		camera.speed = spectateSpeed;
		camera.position.y = 250;
		
		//Aiming
		camera.angularSensibility = 1000;
		camera.inertia = 0.2;
		
		//Min z
		camera.minZ = 0;
	}
	
	function playerCameraSetup(){
		
		// 1st person CAM
		camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 9.1, 0), scene);
		
		//Aiming
		camera.angularSensibility = 1000;
		camera.inertia = 0.2;
		
		//Min z
		camera.minZ = 0;
		
		//Disable camera movement
		camera.keysDown = [9999];
		camera.keysUp = [9999];
		camera.keysLeft = [9999];
		camera.keysRight = [9999];
		
		//Add control to camera 
		camera.attachControl(canvas, true);
	}
	
	

	function playerTrackingBoxSetup(){
		
		players.set(mySocketId, []);
		
		//Create player's Mesh
		players.get(mySocketId).trackingBox = BABYLON.Mesh.CreateBox("me", 1, scene);
		
		//Define player's collision ZONE!
		players.get(mySocketId).trackingBox.ellipsoid = new BABYLON.Vector3(0.75, 2.0, 0.75);
		
		//Player doesn't need to see their own mesh
		players.get(mySocketId).trackingBox.visibility = false;
		
		//Configure player's tracking box
		players.get(mySocketId).trackingBox.position = new BABYLON.Vector3(0,300,0);
		players.get(mySocketId).trackingBox.isPickable = false;
		
		//Package player data
		var playerData = {};
		
		playerData.nickname = "NICKNAME";
		
		// Get random color for player
		playerData.color = players.get(mySocketId).color = new Array(randomNumber(0,1), randomNumber(0,1), randomNumber(0,1));
		
		
		//Let the server know the player has been created
		socket.emit('playerInit', playerData);
		
		//Update active client list
		updateActiveClients();
	}
	
	function playerCharacterSetup(){
		
		players.get(mySocketId).characterMesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
		var playerMat = new BABYLON.StandardMaterial("mat_" + mySocketId, scene);
		playerMat.emissiveColor = new BABYLON.Color3(players.get(mySocketId).color[0],players.get(mySocketId).color[1],players.get(mySocketId).color[2]);
		playerMat.diffuseColor = new BABYLON.Color3(0,0,0);
		playerMat.specularColor = new BABYLON.Color3(0,0,0);
		players.get(mySocketId).characterMesh.material = playerMat;
		players.get(mySocketId).characterMesh.checkCollisions = false;
		players.get(mySocketId).characterMesh.isPickable = false;
		players.get(mySocketId).characterMesh.visibility = 0;
		
		// Character mesh will follow tracking box
		engine.runRenderLoop(function () {
			players.get(mySocketId).characterMesh.position.x = players.get(mySocketId).trackingBox.position.x;
			players.get(mySocketId).characterMesh.position.y = players.get(mySocketId).trackingBox.position.y - 2;
			players.get(mySocketId).characterMesh.position.z = players.get(mySocketId).trackingBox.position.z;
			players.get(mySocketId).characterMesh.rotation.y = players.get(mySocketId).trackingBox.rotation.y + Math.PI;
		});
			
		//Set interval for sending player 1's position to others
		setInterval(function() {
			var data = {};

			data.posX = players.get(mySocketId).characterMesh.position.x;
			data.posY = players.get(mySocketId).characterMesh.position.y;
			data.posZ = players.get(mySocketId).characterMesh.position.z;
			
			data.rotY = players.get(mySocketId).characterMesh.rotation.y;

			socket.emit('updatePos', data);
		}, 20);
		
	}
	
	function movementControls(){
		
		// Movement Vars
		var gravity = -0.2;
		
		// What kind of surface is the player on?
		var onUnevenSurface = false;
		

		//Keypress manager
		scene.actionManager = new BABYLON.ActionManager(scene);
		
		//*onDown*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
			
			switch(evt.sourceEvent.keyCode){
				// W
				case 87:
						if(!moveForward){
							moveForward = true;
						}
						break;
				// S
				case 83:
						if(!moveBack){
							moveBack = true;
						}
						break;
				// A
				case 65:
						moveLeft = true;
						break;
				// D
				case 68:
						moveRight = true;
						break;
			}
			
		}));
		
		//*onUp*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
			
			switch(evt.sourceEvent.keyCode){
				// W
				case 87:
						moveForward = false;
						break;
				// S
				case 83:
						moveBack = false;
						break;
				// A
				case 65:
						moveLeft = false;
						break;
				// D
				case 68:
						moveRight = false;
						break;
			}
			
		}));
		
		

		// If player is on an uneven surface... determine the player's next Y position so that they move smoothly down those surfaces
		function nextPosOnUnevenMesh() {
			// Origin, Direction, Length
			var surfaceCheckRay = scene.pickWithRay(new BABYLON.Ray(players.get(mySocketId).trackingBox.position, new BABYLON.Vector3(0, -1, 0), 295));
			var originToGroundRatio = 5;
			
			if(surfaceCheckRay.hit){
				// If player is still on mesh... send new position
				return surfaceCheckRay.pickedPoint.y + originToGroundRatio;
			}else{
				// else... ignore
				return players.get(mySocketId).trackingBox.position.y;
			}
		}
		
	
		// Register main render loop
		engine.runRenderLoop(function () {
		
			// Player movement per frame
			var xMovement = 0;
			var zMovement = 0;
			var animRatio = scene.getAnimationRatio();
			
			// Calculate player's movement (WASD)
			if(moveForward){
				xMovement += Math.sin(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
				zMovement += Math.cos(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
			}
			
			if(moveBack){
				// If forward is also being held, then give the backwards movement enough power to negate it, else allow the backpeddle to be slower
				if(moveForward){
					xMovement -= Math.sin(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
					zMovement -= Math.cos(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
				}else{
					xMovement -= Math.sin(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.075);
					zMovement -= Math.cos(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.075);
				}
			}
			
			if(moveLeft){
				zMovement += Math.sin(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
				xMovement -= Math.cos(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
			}	

			if(moveRight){
				zMovement -= Math.sin(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
				xMovement += Math.cos(players.get(mySocketId).trackingBox.rotation.y)*(playerSpeed*0.15);
			}
			
			// If diagonal movement, then half the player's speed
			if((moveForward&&moveRight) || (moveForward&&moveLeft) || (moveBack&&moveRight) || (moveBack&&moveLeft)){
				xMovement *= 0.5;
				zMovement *= 0.5;
			}
			
			
			// Make the move!
			
			// Without gravity
			players.get(mySocketId).trackingBox.moveWithCollisions(new BABYLON.Vector3(xMovement*animRatio, 0, zMovement*animRatio));
			// Adjust y position so that player smoothly traverses
			players.get(mySocketId).trackingBox.position.y = nextPosOnUnevenMesh();
			
			// Camera will follow player's tracking box
			camera.position.x = players.get(mySocketId).trackingBox.position.x;
			camera.position.y = players.get(mySocketId).trackingBox.position.y;
			camera.position.z = players.get(mySocketId).trackingBox.position.z;
			
			// Player rotation
			players.get(mySocketId).trackingBox.rotation.y = camera.rotation.y;
			
		}); 
	}
	
	
}
