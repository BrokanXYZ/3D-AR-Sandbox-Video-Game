// Babylon vars
var canvas; 
var engine; 
var scene; 

//Main camera
var camera;

// List of player meshes
var players = [];
var uID = mySocketId = 0;


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
	
	camera = new BABYLON.ArcRotateCamera("camera", -2, Math.PI/2, 5, new BABYLON.Vector3(0, 1, 0), scene);
	camera.attachControl(canvas, true);
	camera.wheelDeltaPercentage = 0.01;
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

}


function meshSetup(){
	BABYLON.SceneLoader.ImportMesh("", "/serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		
		//Imported mesh results
		playerMesh = newMeshes[0];
		playerSkeleton = skeletons[0];
		swordMesh = newMeshes[1];
		
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
		
		//Save player variables to global array
		players[uID] = playerMesh;
		players[uID].curBodyAnimation = 0;
		players[uID].curArmAnimation = 0;
		players[uID].skeleton = playerSkeleton;
		players[uID].weapon = swordMesh;
		
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

		var whichButton = function (e, mouseUp) {
			// Handle different event models (for IE?)
			var e = e || window.event;
			var btnCode;

			if ('object' === typeof e) {
				btnCode = e.button;
				
				switch (btnCode) {
					//Left Click
					case 0:
						if(mouseUp){
							changeAnimation(0, "armAnimation");
						}else{
							attack();
						}
						
						break;
					//Middle Button Click
					case 1:
						//console.log('Middle button clicked.');
						//console.log(players);
						

						
						
						break;
					//Right Click
					case 2:
						//console.log('Right button clicked.');
						
						
						
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
			
			//Horizontal attack!
			if(xRotRatio >= yRotRatio){
				//Right
				if(camera.alpha < prevCamRotX){
					console.log("Right");
					return 0;
				}
				//Left
				else
				{
					console.log("Left");
					return 1;
				}
			}
			//Vertical attack!
			else
			{
				//Downwards
				if(camera.beta < prevCamRotY){
					console.log("Downwards");
					return 2;
				}
				//Upwards
				else
				{
					console.log("Upwards");
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

					default:
						console.log('Unexpected direction?? ' + movementDir);
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
			if(players[mySocketId].curArmAnimation!=0){
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
			
			// 0) Null
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
				
				loop = false;
				
				
				players[mySocketId].curArmAnimation = 0;
			
			// 1) Right
			}else if(newAnimationNum==1){
				players[mySocketId].curArmAnimation = 1;
				startFrame = 101;
				endFrame = 120;
				loop = true;
				
			// 2) Left
			}else if(newAnimationNum==2){
				players[mySocketId].curArmAnimation = 2;
				startFrame = 51;
				endFrame = 70;
				loop = true;
				
				
			// 3) Down
			}else if(newAnimationNum==3){
				players[mySocketId].curArmAnimation = 3;
				startFrame = 0;
				endFrame = 20;
				loop = true;
				
				
			// 4) Up
			}else if(newAnimationNum==4){
				players[mySocketId].curArmAnimation = 4;
				startFrame = 211;
				endFrame = 230;
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
