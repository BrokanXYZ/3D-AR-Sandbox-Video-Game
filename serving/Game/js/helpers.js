
/*
-------------------- Helpers --------------------
*/
function delayActions(delay){
	actionDelay = true;
	setTimeout(function(){ actionDelay = false; }, delay);
}
function updateActiveClients(){
	socket.emit('updateActiveClients', function(data) {
		activeClients = data;
	});
}
function respawnParticles(mesh){
		// Custom shader for particles
		BABYLON.Effect.ShadersStore["myParticleFragmentShader"] =
		"#ifdef GL_ES\n" +
		"precision highp float;\n" +
		"#endif\n" +

		"varying vec2 vUV;\n" +                     // Provided by babylon.js
		"varying vec4 vColor;\n" +                  // Provided by babylon.js

		"uniform sampler2D diffuseSampler;\n" +     // Provided by babylon.js

		"void main(void) {\n" +
			"vec2 position = vUV;\n" +

			"float color = 0.0;\n" +
			"vec2 center = vec2(0.5, 0.5);\n" +
		
			"color = sin(distance(position, center) * 10.0 + (10.5 * vColor.g));\n" +

			"vec4 baseColor = texture2D(diffuseSampler, vUV);\n" +

			"gl_FragColor = baseColor * vColor * vec4( vec3(color, color, color), 1.0 );\n" +
		"}\n" +
		"";

		// Effect
		var effect = engine.createEffectForParticles("myParticle");

		// Particles
		var particleSystem = new BABYLON.ParticleSystem("particles", 250, scene, effect);
		particleSystem.particleTexture = new BABYLON.Texture("/serving/Game/textures/flare.png", scene);
		particleSystem.minSize = 0.1;
		particleSystem.maxSize = 1.0;
		particleSystem.minLifeTime = 0.5;
		particleSystem.maxLifeTime = 5.0;
		particleSystem.minEmitPower = 0.5;
		particleSystem.maxEmitPower = 3.0;
		particleSystem.emitter = mesh;
		particleSystem.emitRate = 75;
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
		particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
		particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
		particleSystem.color1 = new BABYLON.Color4(0, 0.4, 1, 1);
		particleSystem.color2 = new BABYLON.Color4(0, 1, 0.1, 1);
		particleSystem.gravity = new BABYLON.Vector3(0, -1.0, 0);
		particleSystem.start();
		
		//Stop particle system and get rid of it
		setTimeout(function() {
			particleSystem.stop();
			
			//Dispose of entire system
			setTimeout(function(){
				particleSystem.dispose();
			}, 4000);
			
		}, 3000);
}
function deathParticles(location){
	//Create invisible emitter at death location
	var deathEmitter = BABYLON.Mesh.CreateBox("deathEmitter", 1.0, scene);
	deathEmitter.position = location;
	deathEmitter.isVisible = false;
	
	// Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 250, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("serving/textures/fire.png", scene);

    // Where the particles come from
    particleSystem.emitter = deathEmitter; 

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 1.0);
    particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(1, 1, 1, 0.0);

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1;

	//Random size
	particleSystem.minSize = 2;
    particleSystem.maxSize = 3;
	
    // Emission rate
    particleSystem.emitRate = 1000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

    // Speed
    particleSystem.minEmitPower = 2;
    particleSystem.maxEmitPower = 6;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();
	
	//Stop particle system and get rid of it
	setTimeout(function() {
		particleSystem.stop();
		
		//Dispose of entire system
		setTimeout(function(){
			particleSystem.dispose();
			deathEmitter.dispose();
		}, 4000);
		
	}, 3000);
	
}
function respawn(){
	
	// Clear death camera rotation
	clearInterval(spectatorCameraRotate);
	
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
	
}
function player1Death(isLavaDeath){
	
	// Disable P1 actions
	player1IsDead = true;
	
	// Reset P1 vars
	moveForward = false;
	moveBack = false;
	moveLeft = false;
	moveRight = false;
	actionDelay = false;
	
	//Save location of death
	var location = camera.position;
	
	//Package data for broadcast
	var data = {};
	data.location = location;
	data.userID = mySocketId;
	
	//Tell others of your death
	socket.emit('playerDeath', data);
	
	//Dispose player camera
	camera.dispose();
	
	//Death camera
	camera = new BABYLON.ArcRotateCamera("myCamera", 0, 0.5, 70, new BABYLON.Vector3(location.x, location.y, location.z), scene);
	spectatorCameraRotate = setInterval(function(){camera.alpha += 0.001;}, 10);
	
	//Death Sound
	death.play();
	
	deathParticles(location);
	
	if(isLavaDeath){
		
		lavaDeath.play();
	}
	
	//Respawn after 10 seconds!
	setTimeout(function(){
		
		
		players[mySocketId].trackingBox.position = respawnPoints[Math.floor(Math.random() * 4)];
		
		// Clear death camera rotation
		clearInterval(spectatorCameraRotate);
		
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
		
		player1IsDead = false;
		
	}, 5000);	
	
}


/*
-------------------- General helpers --------------------
*/
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}
function randomNumber(min,max){
	return Math.random() * (max-min)+min;
}
function setCharAt(targetString, index, setChar){
    return targetString.substr(0, index) + setChar+ targetString.substr(index + setChar.length);
}
