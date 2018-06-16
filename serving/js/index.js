//**List of players who are currently PLAYING the game**
//
// Active clients
//		0 = userID
//		1 = IP
//		2 = position
//		3 = color
//		4 = nickname
var activeClients;

// Socket stuff
var mySocketId = null;
var socket = io();

// List of player meshes
var players = [];

// Babylon vars
var canvas; 
var engine; 
var scene; 

//Main player's camera
var camera;

// No gravity on these! So, that player doesn't slide
var unevenMeshes = [];

function initializeBabylon(){
	canvas = document.getElementById("gameCanvas");
	engine = new BABYLON.Engine(canvas, true);
	scene = new BABYLON.Scene(engine);
	
	// Enable worker collisions (may not be supported by browser)
	//scene.workerCollisions = true; 
	
	// Render scene
	engine.runRenderLoop(function () {
		scene.render();
	});
	
	//Resize window
	window.addEventListener("resize", function () {
		engine.resize();
	});
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

	///////  Texture Defs!  ///////
	var stoneMat = new BABYLON.StandardMaterial("stoneMat", scene);
	stoneMat.diffuseTexture = new BABYLON.Texture("serving/textures/stone.png", scene);
	stoneMat.bumpTexture = new BABYLON.Texture("serving/textures/bumpMap.png", scene);
	stoneMat.diffuseTexture.uScale = 8.0;
	stoneMat.diffuseTexture.vScale = 5.0;
	stoneMat.bumpTexture.uScale = 8.0;
	stoneMat.bumpTexture.vScale = 5.0;
	stoneMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	
	var smoothStoneMat = new BABYLON.StandardMaterial("smoothStoneMat", scene);
	smoothStoneMat.diffuseTexture = new BABYLON.Texture("serving/textures/smoothStone.png", scene);
	smoothStoneMat.diffuseTexture.uScale = 2.0;
	smoothStoneMat.diffuseTexture.vScale = 2.0;
	smoothStoneMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var smoothWoodMat = new BABYLON.StandardMaterial("smoothWoodMat", scene);
	smoothWoodMat.diffuseTexture = new BABYLON.Texture("serving/textures/smoothWood.png", scene);
	smoothWoodMat.diffuseTexture.uScale = 3.0;
	smoothWoodMat.diffuseTexture.vScale = 3.0;
	smoothWoodMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var bridgeMat = new BABYLON.StandardMaterial("bridgeMat", scene);
	bridgeMat.diffuseTexture = new BABYLON.Texture("serving/textures/bridge.png", scene);
	bridgeMat.diffuseTexture.uScale = 8.0;
	bridgeMat.diffuseTexture.vScale = 1.0;
	bridgeMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var woodMat = new BABYLON.StandardMaterial("woodMat", scene);
	woodMat.diffuseTexture = new BABYLON.Texture("serving/textures/wood.jpg", scene);
	woodMat.diffuseTexture.uScale = 2.0;
	woodMat.diffuseTexture.vScale = 2.0;
	woodMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);	
	lavaMaterial.diffuseTexture = new BABYLON.Texture("serving/textures/lava.png", scene);
	lavaMaterial.noiseTexture = new BABYLON.Texture("serving/textures/noise.png", scene); // ** BLANK NOISE TEXTURE **
	//lavaMaterial.diffuseTexture.uScale = 7.0;
	//lavaMaterial.diffuseTexture.vScale = 7.0;
	lavaMaterial.diffuseTexture.uScale = 10.0;
	lavaMaterial.diffuseTexture.vScale = 10.0;
	lavaMaterial.speed = 0.06;
	lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);
	
	var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
	groundMat.diffuseTexture = new BABYLON.Texture("serving/textures/sand.png", scene);
	groundMat.diffuseTexture.uScale = 15.0;
	groundMat.diffuseTexture.vScale = 15.0;
	groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var mountainMat = new BABYLON.StandardMaterial("mountainMat", scene);
	//mountainMat.diffuseTexture = new BABYLON.Texture("serving/textures/11.png", scene);
	//mountainMat.diffuseTexture.uScale = 1.0;
	//mountainMat.diffuseTexture.vScale = 1.0;
	//mountainMat.specularColor = new BABYLON.Color3(0, 0, 1);
	//mountainMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
	//mountainMat.emissiveColor = new BABYLON.Color3(-0.5,-0.5,-0.5);
	mountainMat.specularColor = new BABYLON.Color3(0, 0, 0);
	mountainMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
	
	var cloud1Mat = new BABYLON.StandardMaterial("cloud1Mat", scene);
	cloud1Mat.diffuseTexture = new BABYLON.Texture("serving/textures/cloud1.png", scene);
	cloud1Mat.diffuseTexture.hasAlpha = true;
	cloud1Mat.diffuseTexture.uScale = 1.0;
	cloud1Mat.diffuseTexture.vScale = 1.0;
	cloud1Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	
	var cloud2Mat = new BABYLON.StandardMaterial("cloud2Mat", scene);
	cloud2Mat.diffuseTexture = new BABYLON.Texture("serving/textures/cloud2.png", scene);
	cloud2Mat.diffuseTexture.hasAlpha = true;
	cloud2Mat.diffuseTexture.uScale = 1.0;
	cloud2Mat.diffuseTexture.vScale = 1.0;
	cloud2Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	
	var cloud3Mat = new BABYLON.StandardMaterial("cloud3Mat", scene);
	cloud3Mat.diffuseTexture = new BABYLON.Texture("serving/textures/cloud3.png", scene);
	cloud3Mat.diffuseTexture.hasAlpha = true;
	cloud3Mat.diffuseTexture.uScale = 1.0;
	cloud3Mat.diffuseTexture.vScale = 1.0;
	cloud3Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	
	var cloud4Mat = new BABYLON.StandardMaterial("cloud4Mat", scene);
	cloud4Mat.diffuseTexture = new BABYLON.Texture("serving/textures/cloud4.png", scene);
	cloud4Mat.diffuseTexture.hasAlpha = true;
	cloud4Mat.diffuseTexture.uScale = 1.0;
	cloud4Mat.diffuseTexture.vScale = 1.0;
	cloud4Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	
	var cloud5Mat = new BABYLON.StandardMaterial("cloud5Mat", scene);
	cloud5Mat.diffuseTexture = new BABYLON.Texture("serving/textures/cloud5.png", scene);
	cloud5Mat.diffuseTexture.hasAlpha = true;
	cloud5Mat.diffuseTexture.uScale = 1.0;
	cloud5Mat.diffuseTexture.vScale = 1.0;
	cloud5Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	
	
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
	pillar1.position = new BABYLON.Vector3(0.5, 3.5, -12);
	pillar1.rotation = new BABYLON.Vector3(0, degToRad(18), 0);
	pillar1.checkCollisions = true;

	var pillar2 = BABYLON.Mesh.CreateCylinder("pillar2", 7, 9, 9, 5, 1, scene, false);
	pillar2.position = new BABYLON.Vector3(-0.5, 3.5, 12);
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
	//var lava = BABYLON.Mesh.CreateDisc("lava", 175, 64, scene);
	//lava.rotation.x = Math.PI/2;
	var lava = BABYLON.Mesh.CreateGround("lava", 1200, 1200, 50, scene);
	lava.position.y += -15;
	lava.material = lavaMaterial;
	lava.isPickable = false;
	
	///////  Skybox  ///////
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skybox.position.y += 175;
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("serving/skybox/skybox", scene, ["_px.png", "_py.png", "_pz.png", "_nx.png", "_ny.png", "_nz.png"]);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.disableLighting = true;
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
	
		//SUN
		var sunSize = 300;
		var spriteManagerSun = new BABYLON.SpriteManager("spriteManagerSun", "serving/textures/sun.png", 2, 675, scene);
		
		var sun11 = new BABYLON.Sprite("sun11", spriteManagerSun);
		sun11.position = new BABYLON.Vector3(-50, 625, -870);
		sun11.size = sunSize;
		var sun12 = new BABYLON.Sprite("sun12", spriteManagerSun);
		sun12.position = new BABYLON.Vector3(-50, 625, -875);
		sun12.size = sunSize;
		sun12.angle -= 8;
		
		engine.runRenderLoop(function () {
			sun11.angle -= 0.001;
			sun12.angle -= 0.001;
		});
		
		
		//CLOUDS
		var rotRadius = 1100; //Is this radius 100% accurate?
		var rotAxis = new BABYLON.Vector3(0, 1, .55);
		var rotFlippedAxis = new BABYLON.Vector3(0, 1, -.55);
		var rotSpeed = 0.75;
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
		
		createClouds();
	
}

function setupSpectator(){
	camera = new BABYLON.ArcRotateCamera("myCamera", 4, 1.6, 275, new BABYLON.Vector3(0, 60, 0), scene);
	
	engine.runRenderLoop(function () {
		camera.alpha += 0.001;
	}); 
}

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
		players[data.userID].isVisible = false;
		
		//Death effect
		deathParticles(data.location);
		
		//using this instead of an ON_RESPAWN (more efficient*)
		setTimeout(function(){
			players[data.userID].isVisible = true;
			respawnParticles(players[data.userID]);
		}, 10000);
	});
	
	
	socket.on('updateAnimation', function(data) {
		
		animationCode = data.animationCode;
		animationType = data.animationType;
		userID = data.userID;
		
		console.log("update player: " + userID);
		console.log("animation type: " + animationType);
		console.log("code: " + animationCode);
		
		updateOtherPlayersAnimation(animationCode, animationType, userID);
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
			scene.beginAnimation(playerSkeleton, 261, 360, true, 1.0);
			
		});
	}
}


//Start game functions (called from index.hmtl)
function setupGUI(){
	
	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	///////  HP! (max = 400)  ///////
	var noHpBar = new BABYLON.GUI.Rectangle();
	noHpBar.width = "400px";
	noHpBar.height = "50px";
	noHpBar.color = "Red";
	noHpBar.background = "Red";
	noHpBar.thickness = 5;
	noHpBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	noHpBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	noHpBar.top = -15;
	noHpBar.left = -15;
	//advancedTexture.addControl(noHpBar);    

	var hpBar = new BABYLON.GUI.Rectangle();
	hpBar.width = "200px";	////////////	  *Player's health*
	hpBar.height = "50px";
	hpBar.color = "Green";
	hpBar.background = "Green";
	hpBar.thickness = 5;
	hpBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	hpBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	hpBar.top = -15;
	hpBar.left = -15;
	//advancedTexture.addControl(hpBar);
}

function setupPlayer(nickname){
	
	respawn();
	playerTrackingBoxSetup();
	playerCharacterSetup();
	movementControls();
	attackingControls();
	checkForDeath();
	
	// On click event, request pointer lock
	canvas.addEventListener("click", function (evt) {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock();
		}
	});
	
	
	function respawn(){
		//Overwrite spectator camera with FPS cam!
		camera.dispose();
		camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 9.1, 0), scene);
		
		//Aiming
		camera.angularSensibility = 1000;
		camera.inertia = 0.2;
		
		//Min z
		camera.minZ 	= 0;
		
		//Disable camera movement
		camera.keysDown = [9999];
		camera.keysUp = [9999];
		camera.keysLeft = [9999];
		camera.keysRight = [9999];
		
		//Add control to camera (Only rotation)
		camera.attachControl(canvas, true);
		
		//Respawn effect
		respawnParticles(camera);
	}
	
	function playerTrackingBoxSetup(){
		
		players[mySocketId] = [];
		
		//Create player's Mesh
		players[mySocketId].trackingBox = BABYLON.Mesh.CreateBox("me", 1, scene);
		
		//Define player's collision ZONE!
		players[mySocketId].trackingBox.ellipsoid = new BABYLON.Vector3(1.5, 2.0, 1.5);
		
		//Player doesn't need to see their own mesh
		players[mySocketId].trackingBox.visibility = false;
		
		//Configure player's tracking box
		players[mySocketId].trackingBox.position = new BABYLON.Vector3(0, 9.5, 0);
		players[mySocketId].trackingBox.isPickable = false;
		
		//Package player data
		var playerData = {};
		
		// Generate player's color
		playerData.color = [Math.random(), Math.random(), Math.random()];
		playerData.nickname = nickname;
		
		// Set player 1's color
		players[mySocketId].color = playerData.color;
		
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
			//players[mySocketId].attackCheckInterval;
			
			
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
										startFrame = 230;
										endFrame = 240;
										animationCode = setCharAt(animationCode, 1, '1');
										break;
									// Down
									case 2:
										startFrame = 20;
										endFrame = 30;
										animationCode = setCharAt(animationCode, 1, '2');
										break;
									// Left
									case 3:
										startFrame = 70;
										endFrame = 80;
										animationCode = setCharAt(animationCode, 1, '3');
										break;
									// Right
									case 4:
										startFrame = 120;
										endFrame = 130;
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
			var prepEventR = new BABYLON.AnimationEvent(119, function() { players[mySocketId].armProxy.armPrepped = true;}, false);
			var prepEventL = new BABYLON.AnimationEvent(69, function() { players[mySocketId].armProxy.armPrepped = true;}, false);
			var prepEventD = new BABYLON.AnimationEvent(19, function() { players[mySocketId].armProxy.armPrepped = true;}, false);
			var prepEventU = new BABYLON.AnimationEvent(229, function() { players[mySocketId].armProxy.armPrepped = true;}, false);
			
			playerSkeleton.bones[14].animations[0].addEvent(prepEventR);
			playerSkeleton.bones[14].animations[0].addEvent(prepEventL);
			playerSkeleton.bones[14].animations[0].addEvent(prepEventU);
			playerSkeleton.bones[14].animations[0].addEvent(prepEventD);
			
			// 2. arm unprep
			var unprepEventR = new BABYLON.AnimationEvent(120, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50);}, false);
			var unprepEventL = new BABYLON.AnimationEvent(70, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50);}, false);
			var unprepEventD = new BABYLON.AnimationEvent(20, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50);}, false);
			var unprepEventU = new BABYLON.AnimationEvent(230, function() { players[mySocketId].armProxy.armPrepped = false; players[mySocketId].attackCheckInterval = setInterval(checkAttackIntersection,50);}, false);
			
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventR);
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventL);
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventU);
			playerSkeleton.bones[14].animations[0].addEvent(unprepEventD);
			
			// 3. arm lock
			var lockEventR = new BABYLON.AnimationEvent(101, function() { players[mySocketId].armProxy.armLock = true;}, false);
			var lockEventL = new BABYLON.AnimationEvent(51, function() { players[mySocketId].armProxy.armLock = true; }, false);
			var lockEventD = new BABYLON.AnimationEvent(0, function() { players[mySocketId].armProxy.armLock = true; }, false);
			var lockEventU = new BABYLON.AnimationEvent(211, function() { players[mySocketId].armProxy.armLock = true; }, false);
			
			playerSkeleton.bones[14].animations[0].addEvent(lockEventR);
			playerSkeleton.bones[14].animations[0].addEvent(lockEventL);
			playerSkeleton.bones[14].animations[0].addEvent(lockEventU);
			playerSkeleton.bones[14].animations[0].addEvent(lockEventD);
			
			// 4. arm unlock
			var unlockEventR = new BABYLON.AnimationEvent(130, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval);}, false);
			var unlockEventL = new BABYLON.AnimationEvent(80, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval);}, false);
			var unlockEventD = new BABYLON.AnimationEvent(30, function() { players[mySocketId].armProxy.armLock = false; clearInterval(players[mySocketId].attackCheckInterval);}, false);
			var unlockEventU = new BABYLON.AnimationEvent(240, function() { players[mySocketId].armProxy.armLock = true; clearInterval(players[mySocketId].attackCheckInterval);}, false);
			
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventR);
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventL);
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventU);
			playerSkeleton.bones[14].animations[0].addEvent(unlockEventD);
			
			// Character mesh will follow tracking box
			engine.runRenderLoop(function () {
				players[mySocketId].characterMesh.position.x = players[mySocketId].trackingBox.position.x;
				players[mySocketId].characterMesh.position.y = players[mySocketId].trackingBox.position.y - 2;
				players[mySocketId].characterMesh.position.z = players[mySocketId].trackingBox.position.z;
				players[mySocketId].characterMesh.rotation.y = players[mySocketId].trackingBox.rotation.y;
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
		}));
		
		//*onUp*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
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
		}));
		
		
		// Raycast from player's camera
		// 1. can player jump?
		// 2. is the player on an uneven surface?
		function checkPlayersSurface() {
			// Origin, Direction, Length
			var cameraRay = new BABYLON.Ray(camera.position, new BABYLON.Vector3(0, -1, 0), 2.2);

			if (scene.pickWithRay(cameraRay).pickedMesh) {
				canJump = true;
			} else {
				canJump = false;
			}
			
			onUnevenSurface = scene.pickWithRay(cameraRay, function (mesh) {
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
			var cameraRay = scene.pickWithRay(new BABYLON.Ray(camera.position, new BABYLON.Vector3(0, -1, 0), 2.35));
			var cameraToGroundRatio = 2.11;
			
			if(cameraRay.hit){
				// If player is still on mesh... send new position
				return cameraRay.pickedPoint.y + cameraToGroundRatio;
			}else{
				// else... ignore
				return camera.position.y;
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
			
			// Calculate player's movement (WASD)
			if(moveForward){
				xMovement += Math.sin(camera.rotation.y)*(playerSpeed*0.15);
				zMovement += Math.cos(camera.rotation.y)*(playerSpeed*0.15);
			}
			
			if(moveBack){
				xMovement -= Math.sin(camera.rotation.y)*(playerSpeed*0.15);
				zMovement -= Math.cos(camera.rotation.y)*(playerSpeed*0.15);
			}
			
			if(moveLeft){
				zMovement += Math.sin(camera.rotation.y)*(playerSpeed*0.15);
				xMovement -= Math.cos(camera.rotation.y)*(playerSpeed*0.15);
			}	

			if(moveRight){
				zMovement -= Math.sin(camera.rotation.y)*(playerSpeed*0.15);
				xMovement += Math.cos(camera.rotation.y)*(playerSpeed*0.15);
			}
			
			// Cast ray to check player's surface
			checkPlayersSurface();
			
			// Make the move!
			if(onUnevenSurface.hit){
				// Without gravity
				players[mySocketId].trackingBox.moveWithCollisions(new BABYLON.Vector3(xMovement, 0, zMovement));
				// Adjust y position so that player smoothly traverses
				players[mySocketId].trackingBox.position.y = nextPosOnUnevenMesh();
			}else{
				// With gravity
				players[mySocketId].trackingBox.moveWithCollisions(new BABYLON.Vector3(xMovement, gravity, zMovement));
			}
			
			// Camera will follow player's tracking box
			camera.position.x = players[mySocketId].trackingBox.position.x;
			camera.position.y = players[mySocketId].trackingBox.position.y;
			camera.position.z = players[mySocketId].trackingBox.position.z;
			
			// Player rotation
			players[mySocketId].trackingBox.rotation.y = camera.rotation.y - Math.PI;
			
		}); 
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
							updatePlayer1Animation(0, "armAnimation");
						}else{
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
			prevCamRotX = camera.rotation.x;
			prevCamRotY = camera.rotation.y;
		}, 250);
		
		
		function getDirection(){
			// Ratios to compare which axis had more movement
			var xRotRatio = Math.abs(camera.rotation.x - prevCamRotX);
			var yRotRatio = Math.abs(camera.rotation.y - prevCamRotY);
			
			//Vertical attack!
			if(xRotRatio >= yRotRatio){
				//Upwards
				if(camera.rotation.x < prevCamRotX){
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
				if(camera.rotation.y < prevCamRotY){
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
						updatePlayer1Animation(1, "armAnimation");
						break;
					//DOWN
					case 2:
						updatePlayer1Animation(2, "armAnimation");
						break;
					//LEFT
					case 3:
						updatePlayer1Animation(3, "armAnimation");
						break;	
					//RIGHT
					case 4:
						updatePlayer1Animation(4, "armAnimation");
						break;

					default:
						console.log('Unexpected direction?? ' + movementDir);
				}
		}
		
		function block(){
			var movementDir = getDirection();
			
			switch (movementDir) {
					//UP
					case 1:
						updatePlayer1Animation(5, "armAnimation");
						break;
					//DOWN
					case 2:
						updatePlayer1Animation(6, "armAnimation");
						break;
					//LEFT
					case 3:
						updatePlayer1Animation(7, "armAnimation");
						break;	
					//RIGHT
					case 4:
						updatePlayer1Animation(8, "armAnimation");
						break;

					default:
						console.log('Unexpected direction?? ' + movementDir);
				}
		}
		
	}
	
	function checkForDeath(){
	
		engine.runRenderLoop(function () {
			// DEATH
			if(camera.position.y<-17){
				//Save location of death
				var location = camera.position;
				
				//Package data for broadcast
				var data = {};
				data.location = location;
				data.userID = mySocketId;
				
				//Tell others of your death
				socket.emit('playerDeath', data);
				
				//Destroy FP camera
				camera.dispose();
			
				//Death camera
				camera = new BABYLON.ArcRotateCamera("myCamera", 0, 0.5, 70, new BABYLON.Vector3(location.x, location.y, location.z), scene);
				
				//Death effect
				deathParticles(location);
				
				//Respawn after 10 seconds!
				setTimeout(respawn, 10000);	
			}
		});
		
	}
	
	function checkAttackIntersection(){
		//if(players[].weapon.intersectsMesh(players[1], false))
			//console.log("You hit player: " );
	}
}


//Player animation changing logic
function updatePlayer1Animation(newAnimationNum, animationType){
	
		//Package data to be emitted to others
		data = {};
		data.userID = mySocketId;
		data.animationCode = "00";
		data.animationType = animationType;
		
		// Animation data to be determined
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
				data.animationCode = setCharAt(data.animationCode, 0, '0');
				
			// 1) Run
			}else if(newAnimationNum==1){
				players[mySocketId].curBodyAnimation = 1;
				startFrame = 175;
				endFrame = 199;	
				loop = true;				
				data.animationCode = setCharAt(data.animationCode, 0, '1');
				
			// 2) Back peddle
			}else if(newAnimationNum==2){
				players[mySocketId].curBodyAnimation = 2;
				startFrame = 199;
				endFrame = 175;
				loop = true;
				data.animationCode = setCharAt(data.animationCode, 0, '2');
			}
			
			// Execute full animation
			
			//If arms are currently acting... leave them alone
			if(players[mySocketId].armProxy.armLock){
				
				data.animationCode = setCharAt(data.animationCode, 1, '1');
				
				for(var x=0; x<14; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop);
				}
				for(var x=23; x<43; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop);
				}
			//Else include all bones
			}else{
				
				data.animationCode = setCharAt(data.animationCode, 1, '0');
				
				//Cycle Arm animations (loop)
				for(var x=14; x<23; x++){
					players[mySocketId].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
				}
				scene.beginAnimation(players[mySocketId].skeleton, startFrame, endFrame, loop);
			}
			console.log("armCycle");
			
		// ARM(s) ONLY
		}else if(animationType=="armAnimation"){
			
			console.log("armConstant");
			
			//Override loopMode for arm animations (so that they pause at the final frame)
			for(var x=14; x<23; x++){
				players[mySocketId].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
			}
			
			// 0) Swing/Null
			if(newAnimationNum==0){
				
				switch(players[mySocketId].curArmAnimation) {
					// Up
					case 1:
						startFrame = 230;
						endFrame = 240;
						data.animationCode = setCharAt(data.animationCode, 1, '1');
						break;
					// Down
					case 2:
						startFrame = 20;
						endFrame = 30;
						data.animationCode = setCharAt(data.animationCode, 1, '2');
						break;
					// Left
					case 3:
						startFrame = 70;
						endFrame = 80;
						data.animationCode = setCharAt(data.animationCode, 1, '3');
						break;
					// Right
					case 4:
						startFrame = 120;
						endFrame = 130;
						data.animationCode = setCharAt(data.animationCode, 1, '4');
						break;
				}
				
				// Only execute animation if arm is prepped. 
				// Otherwise the animation will be deferred to the arm proxy handler.
				if(players[mySocketId].armProxy.armPrepped){
					for(var x=14; x<22; x++){
						scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, false, 1.0);
					}
					
					//broadcast to other players
					socket.emit('changePlayerAnimation', data);
					
				}else{
					// The current arm animation is 0, so we have to use another var to store the type of swing
					players[mySocketId].armProxy.prevArmAnimation = players[mySocketId].curArmAnimation;
					
				}
				
				players[mySocketId].curArmAnimation = 0;
			
				// Animation execution logic is within here, so we are done
				return;
			
			// 1) Up Attack
			}else if(newAnimationNum==1){
				players[mySocketId].curArmAnimation = 1;
				startFrame = 211;
				endFrame = 230;
				data.animationCode = setCharAt(data.animationCode, 0, '1');
				loop = true;
				
			// 2) Down Attack
			}else if(newAnimationNum==2){
				players[mySocketId].curArmAnimation = 2;
				startFrame = 0;
				endFrame = 20;
				data.animationCode = setCharAt(data.animationCode, 0, '2');
				loop = true;
				
			// 3) Left Attack
			}else if(newAnimationNum==3){
				players[mySocketId].curArmAnimation = 3;
				startFrame = 51;
				endFrame = 70;
				data.animationCode = setCharAt(data.animationCode, 0, '3');
				loop = true;
				
			// 4) Right Attack
			}else if(newAnimationNum==4){
				players[mySocketId].curArmAnimation = 4;
				startFrame = 101;
				endFrame = 120;
				data.animationCode = setCharAt(data.animationCode, 0, '4');
				loop = true;
				
			// 5) Up Block
			}else if(newAnimationNum==5){
				players[mySocketId].curArmAnimation = 5;
				startFrame = 251;
				endFrame = 255;
				data.animationCode = setCharAt(data.animationCode, 0, '5');
				loop = true;
				
			// 6) Down Block
			}else if(newAnimationNum==6){
				players[mySocketId].curArmAnimation = 6;
				startFrame = 41;
				endFrame = 45;
				data.animationCode = setCharAt(data.animationCode, 0, '6');
				loop = true;
				
			// 7) Left Block
			}else if(newAnimationNum==7){
				players[mySocketId].curArmAnimation = 7;
				startFrame = 91;
				endFrame = 95;
				data.animationCode = setCharAt(data.animationCode, 0, '7');
				loop = true;
				
			// 8) Right Block
			}else if(newAnimationNum==8){
				players[mySocketId].curArmAnimation = 8;
				startFrame = 141;
				endFrame = 145;
				data.animationCode = setCharAt(data.animationCode, 0, '8');
				loop = true;
			}
			
			// Execute arm animation
			for(var x=14; x<22; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop, 1.0)
			}
			
		}
		
		//broadcast to other players
		socket.emit('changePlayerAnimation', data);
		
	
}

function updateOtherPlayersAnimation(animationCode, animationType, userID){
	
	// Animation data to be determined
	var startFrame = 0;
	var endFrame = 0;
	var loop = false;
	
	
	// WHOLE BODY
	if(animationType=="wholeBodyAnimation"){
		
		// 0) Idle
		if(animationCode[0]=='0'){
			players[userID].curBodyAnimation = 0;
			startFrame = 261;
			endFrame = 360;
			loop = true;
			
		// 1) Run
		}else if(animationCode[0]=='1'){
			players[userID].curBodyAnimation = 1;
			startFrame = 175;
			endFrame = 199;	
			loop = true;				
			
		// 2) Back peddle
		}else if(animationCode[0]=='2'){
			players[userID].curBodyAnimation = 2;
			startFrame = 199;
			endFrame = 175;
			loop = true;
		}
		
		// Execute full animation
		
		//If arms are currently acting... leave them alone
		if(animationCode[1]=='1'){
			for(var x=0; x<14; x++){
				scene.beginAnimation(players[userID].skeleton.bones[x], startFrame, endFrame, loop);
			}
			for(var x=23; x<43; x++){
				scene.beginAnimation(players[userID].skeleton.bones[x], startFrame, endFrame, loop);
			}
		//Else include all bones
		}else{
			//Cycle Arm animations (loop)
			for(var x=14; x<23; x++){
				players[userID].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
			}
			scene.beginAnimation(players[userID].skeleton, startFrame, endFrame, loop);
		}
		
	// ARM(s) ONLY
	}else if(animationType=="armAnimation"){
		
		//Override loopMode for arm animations (so that they pause at the final frame)
		for(var x=14; x<23; x++){
			players[userID].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
		}
		
		// 0) Swing/Null
		if(animationCode[0]=='0'){
			
			switch(animationCode[1]) {
				// Up
				case '1':
					startFrame = 230;
					endFrame = 240;
					break;
				// Down
				case '2':
					startFrame = 20;
					endFrame = 30;
					break;
				// Left
				case '3':
					startFrame = 70;
					endFrame = 80;
					break;
				// Right
				case '4':
					startFrame = 120;
					endFrame = 130;
					break;
			}
			
			loop = false;
			players[userID].curArmAnimation = 0;
		
		// 1) Up Attack
		}else if(animationCode[0]=='1'){
			players[userID].curArmAnimation = 1;
			startFrame = 211;
			endFrame = 230;
			
			loop = true;
			
		// 2) Down Attack
		}else if(animationCode[0]=='2'){
			players[userID].curArmAnimation = 2;
			startFrame = 0;
			endFrame = 20;
			
			loop = true;
			
		// 3) Left Attack
		}else if(animationCode[0]=='3'){
			players[userID].curArmAnimation = 3;
			startFrame = 51;
			endFrame = 70;
			loop = true;
			
		// 4) Right Attack
		}else if(animationCode[0]=='4'){
			players[userID].curArmAnimation = 4;
			startFrame = 101;
			endFrame = 120;
			loop = true;
			
		// 5) Up Block
		}else if(animationCode[0]=='5'){
			players[userID].curArmAnimation = 5;
			startFrame = 251;
			endFrame = 255;
			loop = true;
			
		// 6) Down Block
		}else if(animationCode[0]=='6'){
			players[userID].curArmAnimation = 6;
			startFrame = 41;
			endFrame = 45;
			loop = true;
			
		// 7) Left Block
		}else if(animationCode[0]=='7'){
			players[userID].curArmAnimation = 7;
			startFrame = 91;
			endFrame = 95;
			loop = true;
			
		// 8) Right Block
		}else if(animationCode[0]=='8'){
			players[userID].curArmAnimation = 8;
			startFrame = 141;
			endFrame = 145;
			loop = true;
		}
		
		// Execute arm animation
		for(var x=14; x<22; x++){
				scene.beginAnimation(players[userID].skeleton.bones[x], startFrame, endFrame, loop, 1.0)
		}
		
	}
	
}


//Helpers
function degToRad(degrees) {
	return degrees * Math.PI / 180;
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
		particleSystem.particleTexture = new BABYLON.Texture("serving/textures/flare.png", scene);
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
function randomNumber(min,max){
	return Math.random() * (max-min)+min;
}
function setCharAt(targetString, index, setChar) {
	console.log(targetString);
    return targetString.substr(0, index) + setChar+ targetString.substr(index + setChar.length);
}

//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
	setupSpectator();
	setupSocketIO();
});
