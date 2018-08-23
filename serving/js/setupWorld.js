
// Textures
var stoneMat;
var smoothStoneMat;
var smoothWoodMat;
var bridgeMat;
var lavaMaterial;
var groundMat;
var mountainMat;
var cloud1Mat;
var cloud2Mat;
var cloud3Mat;
var cloud4Mat;
var cloud5Mat;

// Skybox
var skyboxMaterial;



function initializeBabylon(){
	// Define essential elements
	canvas = document.getElementById("gameCanvas");
	engine = new BABYLON.Engine(canvas, true);
	scene = new BABYLON.Scene(engine);
	
	// Enable worker collisions (may not be supported by browser)
	//scene.workerCollisions = true; 
	
	//Resize game on window resize
	window.addEventListener("resize", function () {
		engine.resize();
	});
	
	// 		**************  LOADING  **************
	var assetsManager = new BABYLON.AssetsManager(scene);
	//engine.loadingUIBackgroundColor = "green";

	
	// 1. Textures
	
	stoneMat = new BABYLON.StandardMaterial("stoneMat", scene);
	stoneMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	
	var textureTask1 = assetsManager.addTextureTask("stoneDiffuseTexture", "serving/textures/stone.png");
	textureTask1.onSuccess = function(task) {
		stoneMat.diffuseTexture = task.texture;
		stoneMat.diffuseTexture.uScale = 8.0;
		stoneMat.diffuseTexture.vScale = 5.0;
	}
	
	var textureTask2 = assetsManager.addTextureTask("stoneBumpTexture", "serving/textures/bumpMap.png");
	textureTask2.onSuccess = function(task) {
		stoneMat.bumpTexture = task.texture;
		stoneMat.bumpTexture.uScale = 8.0;
		stoneMat.bumpTexture.vScale = 5.0;
	}
	
	
	smoothStoneMat = new BABYLON.StandardMaterial("smoothStoneMat", scene);
	smoothStoneMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var textureTask3 = assetsManager.addTextureTask("smoothStoneDiffuseTexture", "serving/textures/smoothStone.png");
	textureTask3.onSuccess = function(task) {
		smoothStoneMat.diffuseTexture = task.texture;
		smoothStoneMat.diffuseTexture.uScale = 2.0;
		smoothStoneMat.diffuseTexture.vScale = 2.0;
	}
	
	
	smoothWoodMat = new BABYLON.StandardMaterial("smoothWoodMat", scene);
	smoothWoodMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var textureTask4 = assetsManager.addTextureTask("smoothWoodDiffuseTexture", "serving/textures/smoothWood.png");
	textureTask4.onSuccess = function(task) {
		smoothWoodMat.diffuseTexture = task.texture;
		smoothWoodMat.diffuseTexture.uScale = 3.0;
		smoothWoodMat.diffuseTexture.vScale = 3.0;
	}
	
	
	bridgeMat = new BABYLON.StandardMaterial("bridgeMat", scene);
	bridgeMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var textureTask5 = assetsManager.addTextureTask("bridgeDiffuseTexture", "serving/textures/bridge.png");
	textureTask5.onSuccess = function(task) {
		bridgeMat.diffuseTexture = task.texture;
		bridgeMat.diffuseTexture.uScale = 8.0;
		bridgeMat.diffuseTexture.vScale = 1.0;
	}
	
	
	lavaMaterial = new BABYLON.LavaMaterial("lava", scene);
	lavaMaterial.speed = 0.06;
	lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);	
	
	var textureTask6 = assetsManager.addTextureTask("lavaDiffuseTexture", "serving/textures/lava.png");
	textureTask6.onSuccess = function(task) {
		lavaMaterial.diffuseTexture = task.texture;
		lavaMaterial.diffuseTexture.uScale = 10.0;
		lavaMaterial.diffuseTexture.vScale = 10.0;
	}
	
	var textureTask7 = assetsManager.addTextureTask("lavaNoiseTexture", "serving/textures/noise.png");
	textureTask7.onSuccess = function(task) {
		lavaMaterial.noiseTexture = task.texture;
	}
	
	
	groundMat = new BABYLON.StandardMaterial("groundMat", scene);	
	groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var textureTask8 = assetsManager.addTextureTask("groundDiffuseTexture", "serving/textures/sand.png");
	textureTask8.onSuccess = function(task) {
		groundMat.diffuseTexture = task.texture;
		groundMat.diffuseTexture.uScale = 15.0;
		groundMat.diffuseTexture.vScale = 15.0;
	}
	
	
	mountainMat = new BABYLON.StandardMaterial("mountainMat", scene);
	mountainMat.specularColor = new BABYLON.Color3(0, 0, 0);
	mountainMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
	
	
	cloud1Mat = new BABYLON.StandardMaterial("cloud1Mat", scene);	
	cloud1Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud1Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask9 = assetsManager.addTextureTask("cloud1DiffuseTexture", "serving/textures/cloud1.png");
	textureTask9.onSuccess = function(task) {
		cloud1Mat.diffuseTexture = task.texture;
		cloud1Mat.diffuseTexture.hasAlpha = true;
		cloud1Mat.diffuseTexture.uScale = 1.0;
		cloud1Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud2Mat = new BABYLON.StandardMaterial("cloud2Mat", scene);	
	cloud2Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud2Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask10 = assetsManager.addTextureTask("cloud2DiffuseTexture", "serving/textures/cloud2.png");
	textureTask10.onSuccess = function(task) {
		cloud2Mat.diffuseTexture = task.texture;
		cloud2Mat.diffuseTexture.hasAlpha = true;
		cloud2Mat.diffuseTexture.uScale = 1.0;
		cloud2Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud3Mat = new BABYLON.StandardMaterial("cloud3Mat", scene);	
	cloud3Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud3Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask11 = assetsManager.addTextureTask("cloud3DiffuseTexture", "serving/textures/cloud3.png");
	textureTask11.onSuccess = function(task) {
		cloud3Mat.diffuseTexture = task.texture;
		cloud3Mat.diffuseTexture.hasAlpha = true;
		cloud3Mat.diffuseTexture.uScale = 1.0;
		cloud3Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud4Mat = new BABYLON.StandardMaterial("cloud4Mat", scene);	
	cloud4Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud4Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask12 = assetsManager.addTextureTask("cloud4DiffuseTexture", "serving/textures/cloud4.png");
	textureTask12.onSuccess = function(task) {
		cloud4Mat.diffuseTexture = task.texture;
		cloud4Mat.diffuseTexture.hasAlpha = true;
		cloud4Mat.diffuseTexture.uScale = 1.0;
		cloud4Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud5Mat = new BABYLON.StandardMaterial("cloud5Mat", scene);	
	cloud5Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud5Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask13 = assetsManager.addTextureTask("cloud5DiffuseTexture", "serving/textures/cloud5.png");
	textureTask13.onSuccess = function(task) {
		cloud5Mat.diffuseTexture = task.texture;
		cloud5Mat.diffuseTexture.hasAlpha = true;
		cloud5Mat.diffuseTexture.uScale = 1.0;
		cloud5Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	
	// 2. Skybox
	
	skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.disableLighting = true;
	
	var skyboxTask1 = assetsManager.addCubeTextureTask("skyboxCubeTexture", "serving/skybox/skybox");
	skyboxTask1.onSuccess = function(task) {
		skyboxMaterial.reflectionTexture = task.texture;
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	}
	
	
	
	// 3. Audio
	
	
	var audioTask1 = assetsManager.addBinaryFileTask("blockAudioTask", "serving/sounds/effects/block.wav");
	audioTask1.onSuccess = function (task) {
		block = new BABYLON.Sound("block", task.data, scene, null, {volume: 4});
	}
	
	var audioTask2 = assetsManager.addBinaryFileTask("gotHitAudioTask", "serving/sounds/effects/gotHit.wav");
	audioTask2.onSuccess = function (task) {
		gotHit = new BABYLON.Sound("gotHit", task.data, scene, null, {volume: 4});
	}
	
	var audioTask3 = assetsManager.addBinaryFileTask("lavaDeathAudioTask", "serving/sounds/effects/lavaDeath.wav");
	audioTask3.onSuccess = function (task) {
		lavaDeath = new BABYLON.Sound("lavaDeath", task.data, scene, null, {volume: 6});
	}
	
	var audioTask4 = assetsManager.addBinaryFileTask("swingAudioTask", "serving/sounds/effects/swing.wav");
	audioTask4.onSuccess = function (task) {
		swing = new BABYLON.Sound("swing", task.data, scene, null, {volume: 4});
	}
	
	var audioTask5 = assetsManager.addBinaryFileTask("respawnAudioTask", "serving/sounds/effects/respawn.wav");
	audioTask5.onSuccess = function (task) {
		respawn = new BABYLON.Sound("respawn", task.data, scene, null, {volume: 1});
	}
	
	var audioTask6 = assetsManager.addBinaryFileTask("deathAudioTask", "serving/sounds/effects/death.wav");
	audioTask6.onSuccess = function (task) {
		death = new BABYLON.Sound("death", task.data, scene, null, {volume: 1});
	}
	
	/*var audioTask7 = assetsManager.addBinaryFileTask("song1AudioTask", "serving/sounds/tracks/LightEmUp.mp3");
	audioTask7.onSuccess = function (task) {
		song1 = new BABYLON.Sound("song1", task.data, scene, null, {volume: 0.5, autoplay:true});
		song1.onended = function(){ song2.play();};
	}
	
	var audioTask8 = assetsManager.addBinaryFileTask("song2AudioTask", "serving/sounds/tracks/Mindwarp.mp3");
	audioTask8.onSuccess = function (task) {
		song2 = new BABYLON.Sound("song2", task.data, scene, null, {volume: 0.5});
		song2.onended = function(){ song3.play();};
	}
	
	var audioTask9 = assetsManager.addBinaryFileTask("song3AudioTask", "serving/sounds/tracks/Mirrorball.mp3");
	audioTask9.onSuccess = function (task) {
		song3 = new BABYLON.Sound("song3", task.data, scene, null, {volume: 0.5});
		song3.onended = function(){ song1.play();};
	}*/
	
	
	
	// LOADING FINISHED!
	
	assetsManager.onFinish = function (tasks) {
		engine.runRenderLoop(function () {
			scene.render();
		});
	};
	
	assetsManager.load();
	
}

function createWorld(){
	
	//Scene Background Color
	scene.clearColor = new BABYLON.Color3(1,0.3,0.1);
	
	//Light
	var light0 = new BABYLON.DirectionalLight("light0", new BABYLON.Vector3(0, -1.5, 1), scene);
	light0.position = new BABYLON.Vector3(0, 50, -50);
	light0.diffuse = new BABYLON.Color3(1, 1, 1);
	light0.specular = new BABYLON.Color3(1, 0, 0);
	light0.groundColor = new BABYLON.Color3(0, 0, 0);
	
	///////  Polygon Defs!  ///////
	var polySlopePoints = [new BABYLON.Vector2(0, 0),
	new BABYLON.Vector2(0, 24),
	new BABYLON.Vector2(13, 24),
	new BABYLON.Vector2(13, 0)
	];

	var polySquarePoints = [new BABYLON.Vector2(0, 0),
	new BABYLON.Vector2(0, 13),
	new BABYLON.Vector2(13, 13),
	new BABYLON.Vector2(13, 0)
	];

	var polySlopeSidePoints = [new BABYLON.Vector2(0, 0),
	new BABYLON.Vector2(58.8, 0),
	new BABYLON.Vector2(35.9, 7),
	new BABYLON.Vector2(22.9, 7)
	];

	var polyBridgePoints = [new BABYLON.Vector2(0, 0),
	new BABYLON.Vector2(74, 0),
	new BABYLON.Vector2(74, 9),
	new BABYLON.Vector2(0, 9)
	];

	var polySlope = new BABYLON.PolygonMeshBuilder("polySlope", polySlopePoints, scene);
	var polySquare = new BABYLON.PolygonMeshBuilder("polySquare", polySquarePoints, scene);
	var polySlopeSide = new BABYLON.PolygonMeshBuilder("polySlopeSide", polySlopeSidePoints, scene);
	var polyBridge = new BABYLON.PolygonMeshBuilder("polyBridge", polyBridgePoints, scene);
	
	
	///////  Right Side  ///////
	var slope1 = polySlope.build(null, 0);
	slope1.position = new BABYLON.Vector3(37, 7, 6.5);
	slope1.rotation.x = degToRad(17);
	slope1.checkCollisions = true;

	var slope2 = polySlope.build(null, 0);
	slope2.position = new BABYLON.Vector3(50, 7, -6.5);
	slope2.rotation.x = degToRad(17);
	slope2.rotation.y = degToRad(180);
	slope2.checkCollisions = true;

	var slopeSide1 = polySlopeSide.build(null, 0);
	slopeSide1.position = new BABYLON.Vector3(37, 0, 29.4);
	slopeSide1.rotation.y = degToRad(90);
	slopeSide1.rotation.x = degToRad(-90);
	slopeSide1.checkCollisions = true;
	
	var slopeSide3 = polySlopeSide.build(null, 0);
	slopeSide3.position = new BABYLON.Vector3(50, 0, -29.4);
	slopeSide3.rotation.y = degToRad(-90);
	slopeSide3.rotation.x = degToRad(-90);
	slopeSide3.checkCollisions = true;
	
	var square1 = polySquare.build(null, 0);
	square1.position = new BABYLON.Vector3(37, 7, -6.5);
	square1.checkCollisions = true;
	
	
	///////  Left Side  ///////
	var slope3 = polySlope.build(null, 0);
	slope3.position = new BABYLON.Vector3(-50, 7, 6.5);
	slope3.rotation.x = degToRad(17);
	slope3.checkCollisions = true;

	var slope4 = polySlope.build(null, 0);
	slope4.position = new BABYLON.Vector3(-37, 7, -6.5);
	slope4.rotation.x = degToRad(17);
	slope4.rotation.y = degToRad(180);
	slope4.checkCollisions = true;

	var slopeSide2 = polySlopeSide.build(null, 0);
	slopeSide2.position = new BABYLON.Vector3(-37, 0, -29.4);
	slopeSide2.rotation.y = degToRad(-90);
	slopeSide2.rotation.x = degToRad(-90);
	slopeSide2.checkCollisions = true;
	
	var slopeSide4 = polySlopeSide.build(null, 0);
	slopeSide4.position = new BABYLON.Vector3(-50, 0, 29.4);
	slopeSide4.rotation.y = degToRad(90);
	slopeSide4.rotation.x = degToRad(-90);
	slopeSide4.checkCollisions = true;

	var square2 = polySquare.build(null, 0);
	square2.position = new BABYLON.Vector3(-50, 7, -6.5);
	square2.checkCollisions = true;
	
	//Assign textures to both sides
	slope1.material = smoothStoneMat;
	slope2.material = smoothStoneMat;
	slope3.material = smoothStoneMat;
	slope4.material = smoothStoneMat;
	square1.material = smoothStoneMat;
	square2.material = smoothStoneMat;
	slopeSide1.material = smoothStoneMat;
	slopeSide2.material = smoothStoneMat;
	slopeSide3.material = smoothStoneMat;
	slopeSide4.material = smoothStoneMat;
	
	
	///////  Bridge!  ///////
	var bridgeMain = polyBridge.build(null, 1);
	bridgeMain.position = new BABYLON.Vector3(-37, 7, -4.5);
	bridgeMain.checkCollisions = true;
	bridgeMain.material = bridgeMat;
	
	
	///////  Wooden Posts  ///////
	var post1 = BABYLON.Mesh.CreateCylinder("post1", 14, 2.5, 2.5, 6, 1, scene, false);
	post1.position = new BABYLON.Vector3(-35.7, 7, -5.6);
	post1.checkCollisions = true;

	var post2 = BABYLON.Mesh.CreateCylinder("post2", 14, 2.5, 2.5, 6, 1, scene, false);
	post2.position = new BABYLON.Vector3(-35.7, 7, 5.6);
	post2.checkCollisions = true;

	var post3 = BABYLON.Mesh.CreateCylinder("post3", 14, 2.5, 2.5, 6, 1, scene, false);
	post3.position = new BABYLON.Vector3(35.7, 7, 5.6);
	post3.checkCollisions = true;

	var post4 = BABYLON.Mesh.CreateCylinder("post4", 14, 2.5, 2.5, 6, 1, scene, false);
	post4.position = new BABYLON.Vector3(35.7, 7, -5.6);
	post4.checkCollisions = true;
	
	post1.material = smoothWoodMat;
	post2.material = smoothWoodMat;
	post3.material = smoothWoodMat;
	post4.material = smoothWoodMat;
	
	
	///////  Stone Foundations  ///////
	var foundation1 = BABYLON.Mesh.CreateCylinder("foundation1", 6, 6, 6, 6, 1, scene, false);
	foundation1.position = new BABYLON.Vector3(19, 3, 0);
	foundation1.checkCollisions = true;

	var foundation2 = BABYLON.Mesh.CreateCylinder("foundation2", 6, 6, 6, 6, 1, scene, false);
	foundation2.position = new BABYLON.Vector3(-19, 3, 0);
	foundation2.checkCollisions = true;

	foundation1.material = stoneMat;
	foundation2.material = stoneMat;
		
		
	///////  Stone Jumping Pillars  ///////
	var pillar1 = BABYLON.Mesh.CreateCylinder("pillar1", 7, 9, 9, 5, 1, scene, false);
	pillar1.position = new BABYLON.Vector3(0, 3.5, -10.5);
	pillar1.rotation = new BABYLON.Vector3(0, degToRad(18), 0);
	pillar1.checkCollisions = true;

	var pillar2 = BABYLON.Mesh.CreateCylinder("pillar2", 7, 9, 9, 5, 1, scene, false);
	pillar2.position = new BABYLON.Vector3(0, 3.5, 10.5);
	pillar2.rotation = new BABYLON.Vector3(0, degToRad(-18), 0);
	pillar2.checkCollisions = true;

	pillar1.material = smoothStoneMat;
	pillar2.material = smoothStoneMat;
	
	
	///////  Wooden Logs  ///////
	var longLog1 = BABYLON.Mesh.CreateCylinder("longLog1", 17, 2, 2, 5, 1, scene, false);
	longLog1.position = new BABYLON.Vector3(-25.9, 6.5, -4.8);
	longLog1.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	longLog1.checkCollisions = true;

	var log1 = BABYLON.Mesh.CreateCylinder("log1", 9.5, 2, 2, 5, 1, scene, false);
	log1.position = new BABYLON.Vector3(-12.3, 6.5, -4.8);
	log1.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	log1.checkCollisions = true;

	var longLog2 = BABYLON.Mesh.CreateCylinder("longLog2", 17, 2, 2, 5, 1, scene, false);
	longLog2.position = new BABYLON.Vector3(-25.9, 6.5, 4.8);
	longLog2.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	longLog2.checkCollisions = true;

	var log2 = BABYLON.Mesh.CreateCylinder("log2", 9.5, 2, 2, 5, 1, scene, false);
	log2.position = new BABYLON.Vector3(-12.3, 6.5, 4.8);
	log2.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	log2.checkCollisions = true;

	var longLog3 = BABYLON.Mesh.CreateCylinder("longLog3", 17, 2, 2, 5, 1, scene, false);
	longLog3.position = new BABYLON.Vector3(25.9, 6.5, 4.8);
	longLog3.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	longLog3.checkCollisions = true;

	var log3 = BABYLON.Mesh.CreateCylinder("log3", 9.5, 2, 2, 5, 1, scene, false);
	log3.position = new BABYLON.Vector3(12.3, 6.5, 4.8);
	log3.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	log3.checkCollisions = true;

	var longLog4 = BABYLON.Mesh.CreateCylinder("longLog4", 17, 2, 2, 5, 1, scene, false);
	longLog4.position = new BABYLON.Vector3(25.9, 6.5, -4.8);
	longLog4.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	longLog4.checkCollisions = true;

	var log4 = BABYLON.Mesh.CreateCylinder("log4", 9.5, 2, 2, 5, 1, scene, false);
	log4.position = new BABYLON.Vector3(12.3, 6.5, -4.8);
	log4.rotation = new BABYLON.Vector3(degToRad(180), 0, degToRad(90));
	log4.checkCollisions = true;

	log1.material = smoothWoodMat;
	log2.material = smoothWoodMat;
	log3.material = smoothWoodMat;
	log4.material = smoothWoodMat;
	longLog1.material = smoothWoodMat;
	longLog2.material = smoothWoodMat;
	longLog3.material = smoothWoodMat;
	longLog4.material = smoothWoodMat;
	
	
	///////  Lava  ///////
	var lava = BABYLON.Mesh.CreateGround("lava", 1200, 1200, 50, scene);
	lava.position.y += -15;
	lava.material = lavaMaterial;
	lava.isPickable = false;
	
	///////  Skybox  ///////
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
	skybox.position.y += 175;
	skybox.material = skyboxMaterial;
	
	///////  Ground  ///////
	var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "serving/heightmaps/island.jpg", 200, 200, 100, 0, 35.5, scene);
	ground.checkCollisions = true;
	ground.material = groundMat;
	ground.position.y += -25;
	
	///////  Mountains  ///////
	var mountains = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "serving/heightmaps/mountains.jpg", 1400, 1400, 48, 0, 300, scene);
	mountains.material = mountainMat;
	mountains.position.y += -21.5;
	
	
	///////  Shadows  ///////
	var shadowGenerator = new BABYLON.ShadowGenerator(1024, light0);
	shadowGenerator.usePoissonSampling = true;
	
	shadowGenerator.getShadowMap().renderList.push(bridgeMain);
	shadowGenerator.getShadowMap().renderList.push(post1);
	shadowGenerator.getShadowMap().renderList.push(post2);
	shadowGenerator.getShadowMap().renderList.push(post3);
	shadowGenerator.getShadowMap().renderList.push(post4);
	shadowGenerator.getShadowMap().renderList.push(foundation1);
	shadowGenerator.getShadowMap().renderList.push(foundation2);
	shadowGenerator.getShadowMap().renderList.push(pillar1);
	shadowGenerator.getShadowMap().renderList.push(pillar2);
	shadowGenerator.getShadowMap().renderList.push(longLog2);
	shadowGenerator.getShadowMap().renderList.push(longLog3);
	shadowGenerator.getShadowMap().renderList.push(log2);
	shadowGenerator.getShadowMap().renderList.push(log3);
	
	ground.receiveShadows = true;
	bridgeMain.receiveShadows = true;
	
	
	///////  Define uneven meshes  ///////
	unevenMeshes.push(slope1);
	unevenMeshes.push(slope2);
	unevenMeshes.push(slope3);
	unevenMeshes.push(slope4);
	unevenMeshes.push(ground);
	
	
	////////// SKY!! //////////
	
		/*//SUN
		var sunSize = 300;
		var spriteManagerSun = new BABYLON.SpriteManager("spriteManagerSun", "serving/textures/sun.png", 2, 675, scene);
		
		var sun11 = new BABYLON.Sprite("sun11", spriteManagerSun);
		sun11.position = new BABYLON.Vector3(-50, 625, -870);
		sun11.size = 5;
		var sun12 = new BABYLON.Sprite("sun12", spriteManagerSun);
		sun12.position = new BABYLON.Vector3(-50, 625, -875);
		sun12.size = sunSize;
		sun12.angle -= 8;
		
		engine.runRenderLoop(function () {
			sun11.angle -= 0.001;
			sun12.angle -= 0.001;
		});*/
		
		
		//CLOUDS
		var rotRadius = 1; //Is this radius 100% accurate?
		var rotAxis = new BABYLON.Vector3(0, 1, 0.55);
		var rotFlippedAxis = new BABYLON.Vector3(0, 1, -0.55);
		var pivotPoint = new BABYLON.Vector3(0, 2000, 0);
		var rotSpeed = 10;
		var cloudSize = 1.75;
		var numClouds = 10;
		var clouds = [];
		
		function createClouds(){
			//Total of 5 clouds types
			//Can flip those for 5 more 'types'
			var cType = 0;
			var cloudSpacing = 250/numClouds;
			
			for(i=0;i<numClouds;i++){
				
				if(cType==0){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 250*cloudSize, scene);
					cloud.material = cloud1Mat;
				}
				if(cType==1){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 250*cloudSize, scene);
					cloud.material = cloud2Mat;
				}
				if(cType==2){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 325*cloudSize, scene);
					cloud.material = cloud3Mat;
				}
				if(cType==3){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 275*cloudSize, scene);
					cloud.material = cloud4Mat;
				}
				if(cType==4){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 325*cloudSize, scene);
					cloud.material = cloud5Mat;
				}
				if(cType==5){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 250*cloudSize, scene);
					cloud.material = cloud1Mat;
					cloud.rotation.z = Math.PI;
				}
				if(cType==6){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 250*cloudSize, scene);
					cloud.material = cloud2Mat;
					cloud.rotation.z = Math.PI;
				}
				if(cType==7){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 325*cloudSize, scene);
					cloud.material = cloud3Mat;
					cloud.rotation.z = Math.PI;
				}
				if(cType==8){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 275*cloudSize, scene);
					cloud.material = cloud4Mat;
					cloud.rotation.z = Math.PI;
				}
				if(cType==9){
					var cloud = new BABYLON.Mesh.CreatePlane("cloud"+i, 325*cloudSize, scene);
					cloud.material = cloud5Mat;
					cloud.rotation.z = Math.PI;
				}
				
				cloud.position = new BABYLON.Vector3(0, randomNumber(-275,-150), 0);	//due to the rotation & translation
				cloud.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-(i*cloudSpacing)));
				cloud.rotation.x = -0.5;
				
				
				if(cType<5){
					cloud.flipped = false;
				}else{
					cloud.flipped = true;
				}
				
				
				cloud.setPivotPoint(pivotPoint);
				clouds.push(cloud);
				
				if(cType!=9){
					cType++;
				}else{
					cType=0;
				}
			}
			
			//Random placement &
			//Register rotation per frame
			clouds.forEach(registerRotation);
			
			function registerRotation(item, index){
				if(item.flipped){
					item.rotate(rotFlippedAxis, randomNumber(0,Math.PI*2), BABYLON.Space.LOCAL);
					engine.runRenderLoop(function () {
						item.rotate(rotFlippedAxis, randomNumber(0.00003,0.00008)*rotSpeed, BABYLON.Space.LOCAL);
					});
				}else{
					item.rotate(rotAxis, randomNumber(0,Math.PI*2), BABYLON.Space.LOCAL);
					engine.runRenderLoop(function () {
							item.rotate(rotAxis, randomNumber(0.00003,0.00008)*rotSpeed, BABYLON.Space.LOCAL);
					});
				}
			}
		}
		
		// After upgrade to babylon 3.3 most of the cloud types are not correctly working...
		//createClouds();
	
}

function setupSpectator(){
	camera = new BABYLON.ArcRotateCamera("myCamera", 4, 1.6, 275, new BABYLON.Vector3(0, 60, 0), scene);
	spectatorCameraRotate = setInterval(function(){camera.alpha += 0.001;}, 10);
}
