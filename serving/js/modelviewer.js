// Babylon vars
var canvas; 
var engine; 
var scene; 

//Main camera
var camera;

// List of player meshes
var players = [];
var uID = mySocketId = 0;

var hitBox;





function initializeBabylon(){
	canvas = document.getElementById("gameCanvas");
	engine = new BABYLON.Engine(canvas, true);
	scene = new BABYLON.Scene(engine);
	
	// Render scene
	engine.runRenderLoop(function () {
		scene.render();
	});
	
	//Resize window
	window.addEventListener("resize", function () {
		engine.resize();
	});
	
	// On click event, request pointer lock
	canvas.addEventListener("click", function (evt) {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock();
		}
	});
	
}
		
function createScene(){
	
	camera = new BABYLON.ArcRotateCamera("camera", -2, Math.PI/2, 5, new BABYLON.Vector3(0, 1, -0.5), scene);
	camera.attachControl(canvas, true);
	camera.wheelDeltaPercentage = 0.01;
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

	
	
	
	BABYLON.SceneLoader.ImportMesh("", "/serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		//Imported mesh results
		playerMesh = newMeshes[0];
		playerSkeleton = skeletons[0];
		swordMesh = newMeshes[1];
		
		playerMesh.showBoundingBox = true;
		
		//Player material
		var playerMat = new BABYLON.StandardMaterial("mat_" + uID, scene);
		playerMat.emissiveColor = new BABYLON.Color3(0,0,0);
		playerMat.diffuseColor = new BABYLON.Color3(.65,1,0);
		playerMat.specularColor = new BABYLON.Color3(0,0,0);
		
		//Sword material
		var swordMat = new BABYLON.StandardMaterial("swordMat_" + uID, scene);
		swordMat.emissiveColor = new BABYLON.Color3(0.6,0.6,0.6);
		swordMat.diffuseColor = new BABYLON.Color3(0,0,0);
		swordMat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
		
		//Player model
		playerMesh.material = playerMat;
		playerMesh.checkCollisions = true;
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
		
		//Postion Player
		playerMesh.position.z = -1.5;
		playerMesh.rotation.y = 3.14;
		
		//Save player variables to global array
		players[1] = playerMesh;
		players[1].skeleton = playerSkeleton;
		players[1].weapon = swordMesh;
		players[1].curBodyAnimation = 0;
		players[1].curArmAnimation = 0;
		
		// Start idle animation
		scene.beginAnimation(playerSkeleton, 261, 360, true, 1.0);
	});
	
}

function meshSetup(){
	BABYLON.SceneLoader.ImportMesh("", "/serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		
		//Imported mesh results
		playerMesh = newMeshes[0];
		playerSkeleton = skeletons[0];
		swordMesh = newMeshes[1];
		
		swordMesh.showBoundingBox = true;
		
		//Player material
		var playerMat = new BABYLON.StandardMaterial("mat_" + uID, scene);
		playerMat.emissiveColor = new BABYLON.Color3(0,0,0);
		playerMat.diffuseColor = new BABYLON.Color3(1,0.75,0);
		playerMat.specularColor = new BABYLON.Color3(0,0,0);
		
		//Sword material
		var swordMat = new BABYLON.StandardMaterial("swordMat_" + uID, scene);
		swordMat.emissiveColor = new BABYLON.Color3(0.6,0.6,0.6);
		swordMat.diffuseColor = new BABYLON.Color3(0,0,0);
		swordMat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
		
		//Player model
		playerMesh.material = playerMat;
		playerMesh.checkCollisions = true;
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
		players[uID] = playerMesh;
		players[uID].skeleton = playerSkeleton;
		players[uID].weapon = swordMesh;
		players[uID].curBodyAnimation = 0;
		players[uID].curArmAnimation = 0;
		
		// Setup arm proxy handler (setting events for 'armPrepped', 'armLock', and 'prevArmAnimation')
		let armHandler = {
			set: function(obj, prop, value){
				if(prop === 'armPrepped'){
					if(value){
						// Standard functionality
						obj[prop] = value;
		
						// If arm is locked and the user has released left click... engage swing animation when arm is prepped
						if(obj['armLock'] && players[0].curArmAnimation==0){
							
							let startFrame = 0;
							let endFrame = 0;
							
							// The current arm animation is 0, so we have to use another var to store the type of swing
							switch(obj['prevArmAnimation']) {
								case 1:
									startFrame = 120;
									endFrame = 130;
									break;
								case 2:
									startFrame = 70;
									endFrame = 80;
									break;
								case 3:
									startFrame = 20;
									endFrame = 30;
									break;
								case 4:
									startFrame = 230;
									endFrame = 240;
									break;
							}
							
							loop = false;
							players[mySocketId].curArmAnimation = 0;
						
							for(var x=14; x<22; x++){
								scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, false, 1.0);
							}
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
		players[0].armProxy = new Proxy({armPrepped: false, armLock: false, prevArmAnimation: 0}, armHandler);

		
		// Set animation events

		// 1. arm prep
		var prepEventR = new BABYLON.AnimationEvent(119, function() { players[uID].armProxy.armPrepped = true; }, true);
		var prepEventL = new BABYLON.AnimationEvent(69, function() { players[uID].armProxy.armPrepped = true; }, true);
		var prepEventD = new BABYLON.AnimationEvent(19, function() { players[uID].armProxy.armPrepped = true; }, true);
		var prepEventU = new BABYLON.AnimationEvent(229, function() { players[uID].armProxy.armPrepped = true; }, true);
		
		playerSkeleton.bones[14].animations[0].addEvent(prepEventR);
		playerSkeleton.bones[14].animations[0].addEvent(prepEventL);
		playerSkeleton.bones[14].animations[0].addEvent(prepEventU);
		playerSkeleton.bones[14].animations[0].addEvent(prepEventD);
		
		// 2. arm unprep
		var unprepEventR = new BABYLON.AnimationEvent(120, function() { players[uID].armProxy.armPrepped = false; players[0].attackCheckInterval = setInterval(checkAttackIntersection,50);}, true);
		var unprepEventL = new BABYLON.AnimationEvent(70, function() { players[uID].armProxy.armPrepped = false; players[0].attackCheckInterval = setInterval(checkAttackIntersection,50);}, true);
		var unprepEventD = new BABYLON.AnimationEvent(20, function() { players[uID].armProxy.armPrepped = false; players[0].attackCheckInterval = setInterval(checkAttackIntersection,50);}, true);
		var unprepEventU = new BABYLON.AnimationEvent(230, function() { players[uID].armProxy.armPrepped = false; players[0].attackCheckInterval = setInterval(checkAttackIntersection,50);}, true);
		
		playerSkeleton.bones[14].animations[0].addEvent(unprepEventR);
		playerSkeleton.bones[14].animations[0].addEvent(unprepEventL);
		playerSkeleton.bones[14].animations[0].addEvent(unprepEventU);
		playerSkeleton.bones[14].animations[0].addEvent(unprepEventD);
		
		// 3. arm lock
		var lockEventR = new BABYLON.AnimationEvent(101, function() { players[uID].armProxy.armLock = true;}, true);
		var lockEventL = new BABYLON.AnimationEvent(51, function() { players[uID].armProxy.armLock = true; }, true);
		var lockEventD = new BABYLON.AnimationEvent(0, function() { players[uID].armProxy.armLock = true; }, true);
		var lockEventU = new BABYLON.AnimationEvent(211, function() { players[uID].armProxy.armLock = true; }, true);
		
		playerSkeleton.bones[14].animations[0].addEvent(lockEventR);
		playerSkeleton.bones[14].animations[0].addEvent(lockEventL);
		playerSkeleton.bones[14].animations[0].addEvent(lockEventU);
		playerSkeleton.bones[14].animations[0].addEvent(lockEventD);
		
		// 4. arm unlock
		var unlockEventR = new BABYLON.AnimationEvent(130, function() { players[uID].armProxy.armLock = false; clearInterval(players[0].attackCheckInterval);}, true);
		var unlockEventL = new BABYLON.AnimationEvent(80, function() { players[uID].armProxy.armLock = false; clearInterval(players[0].attackCheckInterval);}, true);
		var unlockEventD = new BABYLON.AnimationEvent(30, function() { players[uID].armProxy.armLock = false; clearInterval(players[0].attackCheckInterval);}, true);
		var unlockEventU = new BABYLON.AnimationEvent(240, function() { players[uID].armProxy.armLock = true; clearInterval(players[0].attackCheckInterval);}, true);
		
		playerSkeleton.bones[14].animations[0].addEvent(unlockEventR);
		playerSkeleton.bones[14].animations[0].addEvent(unlockEventL);
		playerSkeleton.bones[14].animations[0].addEvent(unlockEventU);
		playerSkeleton.bones[14].animations[0].addEvent(unlockEventD);
		
		// Start idle animation
		scene.beginAnimation(playerSkeleton, 261, 360, true, 1.0);
		
	});
	
}
	
function movementControls(){
	
	// Movement Vars
	var playerSpeed = 1;
	var gravity = -0.2;
	
	var moveForward = false;
	var moveBack = false;
	var moveLeft = false;
	var moveRight = false;
	
	// What kind of surface is the player on?
	var canJump = false;
	var onUnevenSurface = false;
	

	//Keypress manager
	scene.actionManager = new BABYLON.ActionManager(scene);
	
	//*onDown*
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
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
						changeAnimation(1, "wholeBodyAnimation");
					}
					break;
			// S
			case 83:
					if(!moveBack){
						moveBack = true;
						changeAnimation(2, "wholeBodyAnimation");
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
					changeAnimation(0, "wholeBodyAnimation");
					break;
			// S
			case 83:
					moveBack = false;
					changeAnimation(0, "wholeBodyAnimation");
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
	

	function playerJump() {
			var jump = new BABYLON.Animation(
				"jump",
				"position.y", 60,
				BABYLON.Animation.ANIMATIONTYPE_FLOAT,
				BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

			// Animation keys
			var keys = [];
			keys.push({ frame: 0, value: players[mySocketId].position.y });
			keys.push({ frame: 25, value: players[mySocketId].position.y + 2 });
			jump.setKeys(keys);

			// Easing function
			var easingFunction = new BABYLON.CircleEase();
			easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
			jump.setEasingFunction(easingFunction);

			// Push animation over... and go!
			players[mySocketId].animations.push(jump);
			scene.beginAnimation(players[mySocketId], 0, 20, false);
	}
	

}

function attackingControls(){
		
		// Vars for determining attack dir
		var prevCamRotX = 0;
		var prevCamRotY = 0;
		
		
		// Mouse click events!
		
		//	DOWN
		canvas.addEventListener('pointerdown', function (e){
			whichButton(e, false);
		});
		
		//	UP
		canvas.addEventListener('pointerup', function (e){
			whichButton(e, true);
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
						if(isMouseUp){
							// Swing!
							changeAnimation(0, "armAnimation");
						}else{
							attack();
						}
						
						break;
					//Middle Button Click
					case 1:
		
						break;
					//Right Click
					case 2:
						if(isMouseUp){
							// Stop blocking
							//changeAnimation(0, "armAnimation"); -> stop current animation
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
			prevCamRotX = camera.alpha;
			prevCamRotY = camera.beta;
		}, 250);
		
		
		function getDirection(){
			// Ratios to compare which axis had more movement
			var xRotRatio = Math.abs(camera.alpha - prevCamRotX);
			var yRotRatio = Math.abs(camera.beta - prevCamRotY);
			
			//Horizontal swipe!
			if(xRotRatio >= yRotRatio){
				//Right
				if(camera.alpha < prevCamRotX){
					//console.log("Right");
					return 0;
				}
				//Left
				else
				{
					//console.log("Left");
					return 1;
				}
			}
			//Vertical swipe!
			else
			{
				//Downwards
				if(camera.beta < prevCamRotY){
					//console.log("Downwards");
					return 2;
				}
				//Upwards
				else
				{
					//console.log("Upwards");
					return 3;
				}
			}
		}
		
		
		
		function attack(){
			var movementDir = getDirection();
			
			switch (movementDir) {
				case 0:
					//Right
					changeAnimation(1, "armAnimation");
					break;
				case 1:
					//Left
					changeAnimation(2, "armAnimation");
					break;
				case 2:
					//Down
					changeAnimation(3, "armAnimation");
					break;
				case 3:
					//Up
					changeAnimation(4, "armAnimation");
					break;
			}
		}
		
		function block(){
			var movementDir = getDirection();
			
			switch (movementDir) {
				case 0:
					//Right
					changeAnimation(5, "armAnimation");
					break;
				case 1:
					//Left
					changeAnimation(6, "armAnimation");
					break;
				case 2:
					//Down
					changeAnimation(7, "armAnimation");
					break;
				case 3:
					//Up
					changeAnimation(8, "armAnimation");
					break;
			}
		}
		
	}

function changeAnimation(newAnimationNum, animationType){
		
		// 1. Determine type of animation & animation data
		var startFrame = 0;
		var endFrame = 0;
		var loop = false;
		
		// WHOLE BODY
		if(animationType=="wholeBodyAnimation"){
			// 0) Idle
			if(newAnimationNum==0){
				players[mySocketId].curBodyAnimation = 0;
				startFrame = 261;
				endFrame = 360;
				loop = true;
				
			// 1) Run
			}else if(newAnimationNum==1){
				players[mySocketId].curBodyAnimation = 1;
				startFrame = 175;
				endFrame = 199;	
				loop = true;				
				
			// 2) Back peddle
			}else if(newAnimationNum==2){
				players[mySocketId].curBodyAnimation = 2;
				startFrame = 199;
				endFrame = 175;
				loop = true;
			}
			
			// 2a. Execute full animation
			
			//If arms are currently acting... leave them alone
			if(players[mySocketId].armProxy.armLock){
				for(var x=0; x<14; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop);
				}
				for(var x=23; x<43; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop);
				}
			//Else include all bones
			}else{
				//Cycle Arm animations (loop)
				for(var x=14; x<23; x++){
					playerSkeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
				}
				scene.beginAnimation(players[mySocketId].skeleton, startFrame, endFrame, loop);
			}
			
		// ARM(s) ONLY
		}else if(animationType=="armAnimation"){
			
			//Override arm animations (so that they pause at the final frame)
			for(var x=14; x<23; x++){
				playerSkeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
			}
			
			// 0) Swing/Null
			if(newAnimationNum==0){
				switch(players[mySocketId].curArmAnimation) {
					case 1:
						startFrame = 120;
						endFrame = 130;
						break;
					case 2:
						startFrame = 70;
						endFrame = 80;
						break;
					case 3:
						startFrame = 20;
						endFrame = 30;
						break;
					case 4:
						startFrame = 230;
						endFrame = 240;
						break;
				}
				
				// Only execute animation if arm is prepped. 
				// Otherwise the animation will be deferred to the arm proxy handler.
				if(players[mySocketId].armProxy.armPrepped){
					for(var x=14; x<22; x++){
						scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, false, 1.0);
					}
				}else{
					// The current arm animation is 0, so we have to use another var to store the type of swing
					players[0].armProxy.prevArmAnimation = players[mySocketId].curArmAnimation;
				}
				
				players[mySocketId].curArmAnimation = 0;
			
				// Animation execution logic is within here, so we are done
				return;
			
			// 1) Right Attack
			}else if(newAnimationNum==1){
				players[mySocketId].curArmAnimation = 1;
				startFrame = 101;
				endFrame = 120;
				loop = true;
				
			// 2) Left Attack
			}else if(newAnimationNum==2){
				players[mySocketId].curArmAnimation = 2;
				startFrame = 51;
				endFrame = 70;
				loop = true;
				
			// 3) Down Attack
			}else if(newAnimationNum==3){
				players[mySocketId].curArmAnimation = 3;
				startFrame = 0;
				endFrame = 20;
				loop = true;
				
			// 4) Up Attack
			}else if(newAnimationNum==4){
				players[mySocketId].curArmAnimation = 4;
				startFrame = 211;
				endFrame = 230;
				loop = true;
				
			// 5) Right Block
			}else if(newAnimationNum==5){
				players[mySocketId].curArmAnimation = 5;
				startFrame = 141;
				endFrame = 145;
				loop = true;
				
			// 6) Left Block
			}else if(newAnimationNum==6){
				players[mySocketId].curArmAnimation = 6;
				startFrame = 91;
				endFrame = 95;
				loop = true;
				
			// 7) Down Block
			}else if(newAnimationNum==7){
				players[mySocketId].curArmAnimation = 7;
				startFrame = 41;
				endFrame = 45;
				loop = true;
				
			// 8) Up Block
			}else if(newAnimationNum==8){
				players[mySocketId].curArmAnimation = 8;
				startFrame = 251;
				endFrame = 255;
				loop = true;
				
			}
			
			// 2b. Execute arm animation
			
			for(var x=14; x<22; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop, 1.0)/* 
					(function(index) {
						return function(){
							var tempAnim = scene.beginAnimation(players[mySocketId].skeleton.bones[index], 230, 230, true);
							tempAnim.pause();
						};
					})(x));*/
					
			}
			
			
		}
		
}
	
function checkAttackIntersection(){
	if(players[0].weapon.intersectsMesh(players[1], false))
		console.log("Hit");
}
//Helpers
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}
function randomNumber(min,max){
	return Math.random() * (max-min)+min;
}


//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createScene();
	meshSetup();
	movementControls();
	attackingControls();
});
