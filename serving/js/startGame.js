
//Start game functions (called from index.hmtl)
function setupGUI(){
	
	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	///////  HP! (max = 400)  ///////
	var noHpBar = new BABYLON.GUI.Rectangle();
	noHpBar.width = "400px";
	noHpBar.height = "35px";
	noHpBar.color = "Black";
	noHpBar.background = "Black";
	noHpBar.thickness = 5;
	noHpBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	noHpBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	noHpBar.top = -60;
	noHpBar.left = -15;
	advancedTexture.addControl(noHpBar);    

	hpBar = new BABYLON.GUI.Rectangle();
	hpBar.width = "400px";	////////////	  *Player's health*
	hpBar.height = "35px";
	hpBar.color = "Red";
	hpBar.background = "Red";
	hpBar.thickness = 5;
	hpBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	hpBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	hpBar.top = -60;
	hpBar.left = -15;
	advancedTexture.addControl(hpBar);
	
	///////  Stamina! (max = 400)  ///////
	var noStamBar = new BABYLON.GUI.Rectangle();
	noStamBar.width = "400px";
	noStamBar.height = "25px";
	noStamBar.color = "Black";
	noStamBar.background = "Black";
	noStamBar.thickness = 5;
	noStamBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	noStamBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	noStamBar.top = -15;
	noStamBar.left = -15;
	advancedTexture.addControl(noStamBar);    

	stamBar = new BABYLON.GUI.Rectangle();
	stamBar.width = "400px";	////////////	  *Player's stamina*
	stamBar.height = "25px";
	stamBar.color = "Green";
	stamBar.background = "Green";
	stamBar.thickness = 5;
	stamBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	stamBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	stamBar.top = -15;
	stamBar.left = -15;
	advancedTexture.addControl(stamBar);
	
}

function setupPlayer(nickname){
	
	// Clear spectator camera rotation
	clearInterval(spectatorCameraRotate);
	
	
	if(!spectate){
		playerCameraSetup();
		playerTrackingBoxSetup();
		playerCharacterSetup();
		movementControls();
		attackingControls();
		checkForLavaDeath();
		
		// On click event, request pointer lock
		canvas.addEventListener("click", function (evt) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
			if (canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		});
	}else{
		spectateCamera();
	}
	
	function spectateCamera(){
		camera.dispose();
		camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
		camera.attachControl(canvas, true);
		camera.speed = 3;
	}
	
	function playerCameraSetup(){
		//Overwrite spectator camera with FPS cam!
		camera.dispose();
		
		//Static camera radius
		var cameraRadius = 3;
		
		//camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 9.1, 0), scene);
		camera = new BABYLON.ArcRotateCamera("myCamera", Math.PI * 0.75, Math.PI/2, cameraRadius, new BABYLON.Vector3(0, 0, 0), scene);
		
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
		
		//Limit vertical viewing angle
		camera.upperBetaLimit = 2.55;
		
		//Disable camera zoom
		camera.lowerRadiusLimit = cameraRadius;
		camera.upperRadiusLimit = cameraRadius;
		
		//Add control to camera (Only rotation)
		camera.attachControl(canvas, true);
		
		//Play Respawn sound
		respawn.play();
		
		//Respawn effect (only after characterMesh has been setup)
		/*if(charMeshIsSetup){
			respawnParticles(players[mySocketId].characterMesh);
		}else{
			charMeshIsSetup = true;
		}*/
		
	}
	
	function playerTrackingBoxSetup(){
		
		players[mySocketId] = [];
		
		//Create player's Mesh
		players[mySocketId].trackingBox = BABYLON.Mesh.CreateBox("me", 1, scene);
		
		//Define player's collision ZONE!
		players[mySocketId].trackingBox.ellipsoid = new BABYLON.Vector3(0.75, 2.0, 0.75);
		
		//Player doesn't need to see their own mesh
		players[mySocketId].trackingBox.visibility = false;
		
		//Configure player's tracking box
		players[mySocketId].trackingBox.position = respawnPoints[Math.floor(Math.random() * 4)];
		players[mySocketId].trackingBox.isPickable = false;
		
		//Package player data
		var playerData = {};
		
		playerData.nickname = nickname;
		
		// Get random color for player
		playerData.color = players[mySocketId].color = new Array(randomNumber(0,2), randomNumber(0,2), randomNumber(0,2));
		
		
		//Let the server know the player has been created
		socket.emit('playerInit', playerData);
		
		//Update active client list
		updateActiveClients();
	}
	
	function playerCharacterSetup(){
		
		BABYLON.SceneLoader.ImportMesh("", "/serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		
			//Imported mesh results
			playerMesh = newMeshes[0];
			playerSkeleton = skeletons[0];
			swordMesh = newMeshes[1];
			
			//Player material
			var playerMat = new BABYLON.StandardMaterial("mat_" + mySocketId, scene);
			playerMat.emissiveColor = new BABYLON.Color3(0,0,0);
			playerMat.diffuseColor = new BABYLON.Color3(players[mySocketId].color[0],players[mySocketId].color[1],players[mySocketId].color[2]);
			playerMat.specularColor = new BABYLON.Color3(0,0,0);
			
			//Sword material
			var swordMat = new BABYLON.StandardMaterial("swordMat_" + mySocketId, scene);
			swordMat.emissiveColor = new BABYLON.Color3(0.6,0.6,0.6);
			swordMat.diffuseColor = new BABYLON.Color3(0,0,0);
			swordMat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
			
			//Player model
			playerMesh.material = playerMat;
			playerMesh.checkCollisions = false;
			playerMesh.isPickable = false;
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
			players[mySocketId].characterMesh = playerMesh;
			players[mySocketId].skeleton = playerSkeleton;
			players[mySocketId].weapon = swordMesh;
			players[mySocketId].curBodyAnimation = 0;
			players[mySocketId].curArmAnimation = 0;
			players[mySocketId].attackCheckInterval;
			players[mySocketId].swingComplete = false;
			
			
			// Setup arm proxy handler (setting events for 'armPrepped', 'armLock', and 'prevArmAnimation')
			let armHandler = {
				set: function(obj, prop, value){
					if(prop === 'armPrepped'){
						if(value){
							// Standard functionality
							obj[prop] = value;
			
							// If arm is locked and the user has released left click... engage swing animation when arm is prepped
							if(obj['armLock'] && players[mySocketId].curArmAnimation==0){
								
								let startFrame = 0;
								let endFrame = 0;
								let animationCode = "00";
								
								// The current arm animation is 0, so we have to use another var to store the type of swing
								switch(obj['prevArmAnimation']) {
									// Up
									case 1:
										startFrame = uAttackE-24;
										endFrame = uAttackE;
										animationCode = setCharAt(animationCode, 1, '1');
										break;
									// Down
									case 2:
										startFrame = dAttackE-24;
										endFrame = dAttackE;
										animationCode = setCharAt(animationCode, 1, '2');
										break;
									// Left
									case 3:
										startFrame = lAttackE-24;
										endFrame = lAttackE;
										animationCode = setCharAt(animationCode, 1, '3');
										break;
									// Right
									case 4:
										startFrame = rAttackE-24;
										endFrame = rAttackE;
										animationCode = setCharAt(animationCode, 1, '4');
										break;
								}
								
								loop = false;
								players[mySocketId].curArmAnimation = 0;
							
								for(var x=14; x<22; x++){
									scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, false, 1.0);
								}
								
								//Package animation data
								data = {};
								data.userID = mySocketId;
								data.animationCode = animationCode;
								data.animationType = "armAnimation";
								
								//broadcast to other players
								socket.emit('changePlayerAnimation', data);
							}
							
						}else{
							// Standard functionality for change to FALSE
							obj[prop] = value;
						}
					}else
					if(prop === 'armLock'){
						obj[prop] = value;
					}else
					if(prop === 'prevArmAnimation'){
						obj[prop] = value;
					}
				}
			}
			
			// The armProxy! (Uses handler above)
			players[mySocketId].armProxy = new Proxy({armPrepped: false, armLock: false, prevArmAnimation: 0}, armHandler);

			
			// Set animation events

			// 1. arm prep
			var prepEventR = new BABYLON.AnimationEvent(rAttackE-26, function() { players[mySocketId].armProxy.armPrepped = true;}, true);
			var prepEventL = new BABYLON.AnimationEvent(lAttackE-26, function() { players[mySocketId].armProxy.armPrepped = true;}, true);
			var prepEventD = new BABYLON.AnimationEvent(dAttackE-26, function() { players[mySocketId].armProxy.armPrepped = true;}, true);
			var prepEventU = new BABYLON.AnimationEvent(uAttackE-26, function() { players[mySocketId].armProxy.armPrepped = true; }, true);
			
			playerSkeleton.bones[14].animations[0].addEvent(prepEventR);
			playerSkeleton.bones[14].animations[0].addEvent(prepEventL);
			playerSkeleton.bones[14].animations[0].addEvent(prepEventU);
			playerSkeleton.bones[14].animations[0].addEvent(prepEventD);
			
			// 2. arm unprep
			var unprepEventR = new BABYLON.AnimationEvent(rAttackE-24, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50); swing.play();}, true);
			var unprepEventL = new BABYLON.AnimationEvent(lAttackE-24, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50); swing.play();}, true);
			var unprepEventD = new BABYLON.AnimationEvent(dAttackE-24, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50); swing.play();}, true);
			var unprepEventU = new BABYLON.AnimationEvent(uAttackE-24, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50); swing.play();}, true);
			
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventR);
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventL);
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventD);
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventU);
			
			// 3. arm lock
			var lockEventR = new BABYLON.AnimationEvent(rAttackS, function() { players[mySocketId].armProxy.armLock = true;}, true);
			var lockEventL = new BABYLON.AnimationEvent(lAttackS, function() { players[mySocketId].armProxy.armLock = true; }, true);
			var lockEventD = new BABYLON.AnimationEvent(dAttackS, function() { players[mySocketId].armProxy.armLock = true; }, true);
			var lockEventU = new BABYLON.AnimationEvent(uAttackS, function() { players[mySocketId].armProxy.armLock = true; }, true);
			
			playerSkeleton.bones[14].animations[0].addEvent(lockEventR);
			playerSkeleton.bones[14].animations[0].addEvent(lockEventL);
			playerSkeleton.bones[14].animations[0].addEvent(lockEventU);
			playerSkeleton.bones[14].animations[0].addEvent(lockEventD);
			
			// 4. arm unlock
			var unlockEventR = new BABYLON.AnimationEvent(rAttackE, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval); players[mySocketId].swingComplete = false;}, true);
			var unlockEventL = new BABYLON.AnimationEvent(lAttackE, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval); players[mySocketId].swingComplete = false;}, true);
			var unlockEventD = new BABYLON.AnimationEvent(dAttackE, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval); players[mySocketId].swingComplete = false;}, true);
			var unlockEventU = new BABYLON.AnimationEvent(uAttackE, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval); players[mySocketId].swingComplete = false;}, true);
			
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventR);
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventL);
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventU);
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventD);
			
			// Character mesh will follow tracking box
			engine.runRenderLoop(function () {
				players[mySocketId].characterMesh.position.x = players[mySocketId].trackingBox.position.x;
				players[mySocketId].characterMesh.position.y = players[mySocketId].trackingBox.position.y - 2;
				players[mySocketId].characterMesh.position.z = players[mySocketId].trackingBox.position.z;
				players[mySocketId].characterMesh.rotation.y = players[mySocketId].trackingBox.rotation.y + Math.PI;
			});
			
			//Set interval for sending player 1's position to others
			setInterval(function() {
				var data = {};

				data.posX = players[mySocketId].characterMesh.position.x;
				data.posY = players[mySocketId].characterMesh.position.y;
				data.posZ = players[mySocketId].characterMesh.position.z;
				
				data.rotY = players[mySocketId].characterMesh.rotation.y;

				socket.emit('updatePos', data);
			}, 20);
			
			// Start idle animation
			scene.beginAnimation(playerSkeleton, idleS, idleE, true, 1.0);
		});
		
	}
	
	function movementControls(){
		
		// Movement Vars
		var gravity = -0.2;
		
		// What kind of surface is the player on?
		var canJump = false;
		var onUnevenSurface = false;
		

		//Keypress manager
		scene.actionManager = new BABYLON.ActionManager(scene);
		
		//*onDown*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
			// No action if player1 is dead
			if(!player1IsDead){
				switch(evt.sourceEvent.keyCode){
					//spacebar
					case 32:
						if(canJump){
							playerJump();
						}
							break;
					// W
					case 87:
							if(!moveForward){
								moveForward = true;
								updatePlayer1Animation(1, "wholeBodyAnimation");
							}
							break;
					// S
					case 83:
							if(!moveBack){
								moveBack = true;
								updatePlayer1Animation(2, "wholeBodyAnimation");
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
			}
		}));
		
		//*onUp*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
			// No action if player1 is dead
			if(!player1IsDead){
				switch(evt.sourceEvent.keyCode){
					// W
					case 87:
							moveForward = false;
							updatePlayer1Animation(0, "wholeBodyAnimation");
							break;
					// S
					case 83:
							moveBack = false;
							updatePlayer1Animation(0, "wholeBodyAnimation");
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
			}
		}));
		
		
		// Raycast from player's tracking box
		// 1. can player jump?
		// 2. is the player on an uneven surface?
		function checkPlayersSurface() {
			// Origin, Direction, Length
			var surfaceCheckRay = new BABYLON.Ray(players[mySocketId].trackingBox.position, new BABYLON.Vector3(0, -1, 0), 2.2);

			if (scene.pickWithRay(surfaceCheckRay).pickedMesh) {
				canJump = true;
			} else {
				canJump = false;
			}
			
			onUnevenSurface = scene.pickWithRay(surfaceCheckRay, function (mesh) {
				for(var x=0; x<unevenMeshes.length; x++){
					if(mesh==unevenMeshes[x]){
						return true;
					}
				}
				return false;
			});			
		}
		

		// If player is on an uneven surface... determine the player's next Y position so that they move smoothly down those surfaces
		function nextPosOnUnevenMesh() {
			// Origin, Direction, Length
			var surfaceCheckRay = scene.pickWithRay(new BABYLON.Ray(players[mySocketId].trackingBox.position, new BABYLON.Vector3(0, -1, 0), 2.35));
			var originToGroundRatio = 2.11;
			
			if(surfaceCheckRay.hit){
				// If player is still on mesh... send new position
				return surfaceCheckRay.pickedPoint.y + originToGroundRatio;
			}else{
				// else... ignore
				return players[mySocketId].trackingBox.position.y;
			}
		}
		
	
		function playerJump() {
				var jump = new BABYLON.Animation(
					"jump",
					"position.y", 60,
					BABYLON.Animation.ANIMATIONTYPE_FLOAT,
					BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

				// Animation keys
				var keys = [];
				keys.push({ frame: 0, value: players[mySocketId].trackingBox.position.y });
				keys.push({ frame: 25, value: players[mySocketId].trackingBox.position.y + 2 });
				jump.setKeys(keys);

				// Easing function
				var easingFunction = new BABYLON.CircleEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
				jump.setEasingFunction(easingFunction);

				// Push animation over... and go!
				players[mySocketId].trackingBox.animations.push(jump);
				scene.beginAnimation(players[mySocketId].trackingBox, 0, 20, false);
		}
		
	
		// Register main render loop
		engine.runRenderLoop(function () {
		
			// Player movement per frame
			var xMovement = 0;
			var zMovement = 0;
			var animRatio = scene.getAnimationRatio();
			
			// Calculate player's movement (WASD)
			if(moveForward){
				xMovement += Math.sin(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
				zMovement += Math.cos(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
			}
			
			if(moveBack){
				// If forward is also being held, then give the backwards movement enough power to negate it, else allow the backpeddle to be slower
				if(moveForward){
					xMovement -= Math.sin(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
					zMovement -= Math.cos(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
				}else{
					xMovement -= Math.sin(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.075);
					zMovement -= Math.cos(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.075);
				}
			}
			
			if(moveLeft){
				zMovement += Math.sin(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
				xMovement -= Math.cos(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
			}	

			if(moveRight){
				zMovement -= Math.sin(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
				xMovement += Math.cos(players[mySocketId].trackingBox.rotation.y)*(playerSpeed*0.15);
			}
			
			// If diagonal movement, then half the player's speed
			if((moveForward&&moveRight) || (moveForward&&moveLeft) || (moveBack&&moveRight) || (moveBack&&moveLeft)){
				xMovement *= 0.5;
				zMovement *= 0.5;
			}
			
			// Cast ray to check player's surface
			checkPlayersSurface();
			
			// Make the move!
			if(onUnevenSurface.hit){
				// Without gravity
				players[mySocketId].trackingBox.moveWithCollisions(new BABYLON.Vector3(xMovement*animRatio, 0, zMovement*animRatio));
				// Adjust y position so that player smoothly traverses
				players[mySocketId].trackingBox.position.y = nextPosOnUnevenMesh();
			}else{
				// With gravity
				players[mySocketId].trackingBox.moveWithCollisions(new BABYLON.Vector3(xMovement*animRatio, gravity, zMovement*animRatio));
			}
			
			// Camera will follow player's tracking box
			camera.target.x = players[mySocketId].trackingBox.position.x;
			camera.target.y = players[mySocketId].trackingBox.position.y;
			camera.target.z = players[mySocketId].trackingBox.position.z;
			
			// Player rotation
			players[mySocketId].trackingBox.rotation.y = (camera.alpha + Math.PI/2) * -1;
			
		}); 
	}
	
	function attackingControls(){
		
		// Vars for determining attack dir
		var prevBeta = 0;
		var prevAlpha = 0;
		
		
		// Mouse click events!
		
		//	DOWN
		canvas.addEventListener('pointerdown', function (e){
			// No action if player1 is dead
			if(!player1IsDead){
				whichButton(e, false);
			}
		});
		
		//	UP
		canvas.addEventListener('pointerup', function (e){
			// No action if player1 is dead
			if(!player1IsDead){
				whichButton(e, true);
			}
		});

		var whichButton = function (e, isMouseUp) {
			// Handle different event models (for IE?)
			var e = e || window.event;
			var btnCode;

			if ('object' === typeof e) {
				btnCode = e.button;

				switch (btnCode) {
					//Left Click
					case 0:
						// If mouse is up and the player has not already swung
						if(isMouseUp && players[mySocketId].curArmAnimation != 0){
							// Swing!
							updatePlayer1Animation(0, "armAnimation");
						// If the player's arm is not already locked
						}else if(!players[mySocketId].armProxy.armLock){
							attack();
						}
						break;
						
					//Middle Button Click
					case 1:
						//console.log('Middle button clicked.');
						break;
						
					//Right Click
					case 2:
						if(isMouseUp){
							// Unlock arm
							players[mySocketId].armProxy.armLock = false;
							//Stop blocking
							updatePlayer1Animation(0, "armAnimation");
						}else{
							block();
						}
						break;

					default:
						console.log('Unexpected code: ' + btnCode);
				}
			}
		}
		
		
		// Attack & block direction checking
		setInterval(function() {
			prevBeta = camera.beta;
			prevAlpha = camera.alpha;
		}, 250);
		
		
		function getDirection(){
			// Ratios to compare which axis had more movement
			var betaRotRatio = Math.abs(camera.beta - prevBeta);
			var alphaRotRatio = Math.abs(camera.alpha - prevAlpha);
			
			//Vertical attack!
			if(betaRotRatio >= alphaRotRatio){
				//Upwards
				if(camera.beta > prevBeta){
					return 1;
				}
				//Downwards
				else
				{
					return 2;
				}
			}
			//Horizontal attack!
			else{
				//Left
				if(camera.alpha > prevAlpha){
					return 3;
				}
				//Right
				else
				{
					return 4;
				}
			}
		}
		
		
		function attack(){
			var movementDir = getDirection();
			
			switch (movementDir) {
					//UP
					case 1:
						if(!actionDelay){
							updatePlayer1Animation(1, "armAnimation");
						}
						break;
					//DOWN
					case 2:
						if(!actionDelay){
							updatePlayer1Animation(2, "armAnimation");
						}
						break;
					//LEFT
					case 3:
						if(!actionDelay){
							updatePlayer1Animation(3, "armAnimation");
						}
						break;	
					//RIGHT
					case 4:
						if(!actionDelay){
							updatePlayer1Animation(4, "armAnimation");
						}
						break;

					default:
						console.log('Unexpected direction?? ' + movementDir);
				}
		}
		
		function block(){
			
			// Cancel attack check interval if it exists
			if(players[mySocketId].attackCheckInterval){
				clearInterval(players[mySocketId].attackCheckInterval);
			}
			
			// Lock arm
			players[mySocketId].armProxy.armLock = true;
			
			var movementDir = getDirection();
			
			switch (movementDir) {
					//UP
					case 1:
						if(!actionDelay){
							updatePlayer1Animation(5, "armAnimation");
						}
						break;
					//DOWN
					case 2:
						if(!actionDelay){
							updatePlayer1Animation(6, "armAnimation");
						}
						break;
					//RIGHT
					case 4:
						if(!actionDelay){
							updatePlayer1Animation(7, "armAnimation");
						}
						break;	
					//LEFT
					case 3:
						if(!actionDelay){
							updatePlayer1Animation(8, "armAnimation");
						}
						break;

					default:
						console.log('Unexpected direction?? ' + movementDir);
				}
		}
		
	}
	
	function checkForLavaDeath(){
	
		engine.runRenderLoop(function () {
			// DEATH
			if(camera.position.y<-17){
				player1Death(true);
			}
		});
		
	}
	
	function checkAttackIntersection(){
		
		for(var x=0; x<activeClients[0].length; x++){
			// If P1 has not hit a player on their current swing and the target player is not them, then check if a hit has occurred
			if(!players[mySocketId].swingComplete && activeClients[0][x][0]!=mySocketId){
				// If a hit occurred between the two players
				if(players[mySocketId].weapon.intersectsMesh(players[activeClients[0][x][0]].characterMesh, false)){
					
					// A hit has occurred, therefore the swing is complete
					players[mySocketId].swingComplete = true;
					
					// Was the player blocking correctly?
					if(players[mySocketId].armProxy.prevArmAnimation + 4 != players[activeClients[0][x][0]].curArmAnimation){
						
						// Tell server player 1 hit another player
						let data = {};
						data.uID = activeClients[0][x][0];
						
						socket.emit('playerHit', data);						
						
						
					// The other player blocked the attack!
					}else{
						
						// P1's attack was blocked! Delay actions for 3/4s
						delayActions(gotBlockedDelay);
						
						let data = {};
						data.uID = activeClients[0][x][0];
						data.soundID = 1;
						
						socket.emit('playerBlocked', data);
					}
				}
			}
		}
		
	}
}
