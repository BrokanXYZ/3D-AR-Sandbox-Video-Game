//**List of players who are currently PLAYING the game**
//
// Active clients
//		0 = userID
//		1 = IP
//		2 = position
//		3 = color
//		4 = nickname
var activeClients;

//List of player meshes
var players = [];


//Socket stuff
var mySocketId = null;
var socket = io();

//Babylon vars
var canvas; 
var engine; 
var scene; 

//Game vars
var camera;
var cameraRay;
//var gravityVal = -0.2;
var gravityVal = 0;
var onSlope;
var slope1;
var slope2;
var slope3;
var slope4;
var onSlope;

//Player mesh movement vars
var canJump = false;
var moving = false;
var keyArray = [];



//Start up functions
function initializeBabylon(){
	canvas = document.getElementById("gameCanvas");
	engine = new BABYLON.Engine(canvas, true);
	scene = new BABYLON.Scene(engine);

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
	stoneMat.diffuseTexture = new BABYLON.Texture("serving/textures/rock.jpg", scene);
	stoneMat.diffuseTexture.uScale = 2.0;
	stoneMat.diffuseTexture.vScale = 2.0;
	
	var bridgeMat = new BABYLON.StandardMaterial("bridgeMat", scene);
	bridgeMat.diffuseTexture = new BABYLON.Texture("serving/textures/bridge.png", scene);
	bridgeMat.diffuseTexture.uScale = 12.0;
	bridgeMat.diffuseTexture.vScale = 2.0;
	bridgeMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var woodMat = new BABYLON.StandardMaterial("woodMat", scene);
	woodMat.diffuseTexture = new BABYLON.Texture("serving/textures/wood.jpg", scene);
	woodMat.diffuseTexture.uScale = 2.0;
	woodMat.diffuseTexture.vScale = 2.0;
	woodMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);	
	lavaMaterial.diffuseTexture = new BABYLON.Texture("serving/textures/lava.jpg", scene);
	lavaMaterial.diffuseTexture.uScale = 7.0;
	lavaMaterial.diffuseTexture.vScale = 7.0;
	lavaMaterial.speed = 0.06;
	lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);
	
	var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
	groundMat.diffuseTexture = new BABYLON.Texture("serving/textures/sand.png", scene);
	groundMat.diffuseTexture.uScale = 20.0;
	groundMat.diffuseTexture.vScale = 20.0;
	groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var mountainMat = new BABYLON.StandardMaterial("mountainMat", scene);
	/*mountainMat.diffuseTexture = new BABYLON.Texture("serving/textures/mountains.jpg", scene);
	mountainMat.diffuseTexture.uScale = 50.0;
	mountainMat.diffuseTexture.vScale = 50.0;*/
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
	slope1 = polySlope.build(null, 0);
	slope1.position = new BABYLON.Vector3(37, 7, 6.5);
	slope1.rotation.x = degToRad(17);
	slope1.checkCollisions = true;

	slope2 = polySlope.build(null, 0);
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
	slope3 = polySlope.build(null, 0);
	slope3.position = new BABYLON.Vector3(-50, 7, 6.5);
	slope3.rotation.x = degToRad(17);
	slope3.checkCollisions = true;

	slope4 = polySlope.build(null, 0);
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
	slope1.material = stoneMat;
	slope2.material = stoneMat;
	slope3.material = stoneMat;
	slope4.material = stoneMat;
	square1.material = stoneMat;
	square2.material = stoneMat;
	slopeSide1.material = stoneMat;
	slopeSide2.material = stoneMat;
	slopeSide3.material = stoneMat;
	slopeSide4.material = stoneMat;
	
	
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
	
	post1.material = woodMat;
	post2.material = woodMat;
	post3.material = woodMat;
	post4.material = woodMat;
	
	
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

	pillar1.material = stoneMat;
	pillar2.material = stoneMat;
	
	
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

	log1.material = woodMat;
	log2.material = woodMat;
	log3.material = woodMat;
	log4.material = woodMat;
	longLog1.material = woodMat;
	longLog2.material = woodMat;
	longLog3.material = woodMat;
	longLog4.material = woodMat;
	
	
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
	var mountains = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "serving/heightmaps/mountains.jpg", 1600, 1600, 48, 0, 300, scene);
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
	
	
	////////// SKY!! //////////
	
		//SUN
		var sunSize = 200;
		var spriteManagerSun = new BABYLON.SpriteManager("spriteManagerSun", "serving/textures/sun.png", 2, 675, scene);
		
		var sun11 = new BABYLON.Sprite("sun11", spriteManagerSun);
		sun11.position = new BABYLON.Vector3(0, 400, 830);
		sun11.size = sunSize;
		var sun12 = new BABYLON.Sprite("sun12", spriteManagerSun);
		sun12.position = new BABYLON.Vector3(0, 400, 835);
		sun12.size = sunSize;
		sun12.angle -= 8;
		
		engine.runRenderLoop(function () {
			sun11.angle -= 0.001;
			sun12.angle -= 0.001;
		});
		
		
		//CLOUDS
		var rotRadius = 1000; //Is this radius 100% accurate?
		var rotAxis = new BABYLON.Vector3(0, 1, .55);
		var rotFlippedAxis = new BABYLON.Vector3(0, 1, -.55);
		var rotSpeed = 1;
		var cloudSize = 250;
		
		
		var cloud1 = BABYLON.Mesh.CreatePlane("cloud1", cloudSize, scene);
		cloud1.position = new BABYLON.Vector3(0, -150, 0);	//due to the rotation & translation
		cloud1.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius));
		cloud1.rotation.x = -0.5;
		cloud1.material = cloud1Mat;
		
		var cloud2 = BABYLON.Mesh.CreatePlane("cloud2", cloudSize, scene);
		cloud2.position = new BABYLON.Vector3(0, -170, 0);	//due to the rotation & translation
		cloud2.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-10));
		cloud2.rotation.x = -0.5;
		cloud2.material = cloud2Mat;
		
		var cloud3 = BABYLON.Mesh.CreatePlane("cloud3", cloudSize, scene);
		cloud3.position = new BABYLON.Vector3(0, -160, 0);	//due to the rotation & translation
		cloud3.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-20));
		cloud3.rotation.x = -0.5;
		cloud3.material = cloud3Mat;
		
		var cloud4 = BABYLON.Mesh.CreatePlane("cloud4", cloudSize, scene);
		cloud4.position = new BABYLON.Vector3(0, -190, 0);	//due to the rotation & translation
		cloud4.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-30));
		cloud4.rotation.x = -0.5;
		cloud4.material = cloud4Mat;
		
		var cloud5 = BABYLON.Mesh.CreatePlane("cloud5", cloudSize, scene);
		cloud5.position = new BABYLON.Vector3(0, -185, 0);	//due to the rotation & translation
		cloud5.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-40));
		cloud5.rotation.x = -0.5;
		cloud5.material = cloud5Mat;
		
		
		
		var cloud6 = BABYLON.Mesh.CreatePlane("cloud6", cloudSize, scene);
		cloud6.position = new BABYLON.Vector3(0, -220, 0);	//due to the rotation & translation
		cloud6.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-50));
		cloud6.rotation.x = -0.5;
		cloud6.rotation.z = Math.PI;
		cloud6.material = cloud1Mat;
		
		var cloud7 = BABYLON.Mesh.CreatePlane("cloud7", cloudSize, scene);
		cloud7.position = new BABYLON.Vector3(0, -200, 0);	//due to the rotation & translation
		cloud7.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-60));
		cloud7.rotation.x = -0.5;
		cloud7.rotation.z = Math.PI;
		cloud7.material = cloud2Mat;
		
		var cloud8 = BABYLON.Mesh.CreatePlane("cloud8", cloudSize, scene);
		cloud8.position = new BABYLON.Vector3(0, -210, 0);	//due to the rotation & translation
		cloud8.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-70));
		cloud8.rotation.x = -0.5;
		cloud8.rotation.z = Math.PI;
		cloud8.material = cloud3Mat;
		
		var cloud9 = BABYLON.Mesh.CreatePlane("cloud9", cloudSize, scene);
		cloud9.position = new BABYLON.Vector3(0, -180, 0);	//due to the rotation & translation
		cloud9.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-80));
		cloud9.rotation.x = -0.5;
		cloud9.rotation.z = Math.PI;
		cloud9.material = cloud4Mat;
		
		var cloud10 = BABYLON.Mesh.CreatePlane("cloud10", cloudSize, scene);
		cloud10.position = new BABYLON.Vector3(0, -175, 0);	//due to the rotation & translation
		cloud10.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, rotRadius-90));
		cloud10.rotation.x = -0.5;
		cloud10.rotation.z = Math.PI;
		cloud10.material = cloud5Mat;
		
		
		//Random placement
		cloud1.rotate(rotAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud2.rotate(rotAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud3.rotate(rotAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud4.rotate(rotAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud5.rotate(rotAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		
		cloud6.rotate(rotFlippedAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud7.rotate(rotFlippedAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud8.rotate(rotFlippedAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud9.rotate(rotFlippedAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		cloud10.rotate(rotFlippedAxis, Math.random()*Math.PI*2, BABYLON.Space.LOCAL);
		
		
		engine.runRenderLoop(function () {
			cloud1.rotate(rotAxis, 0.000099*rotSpeed, BABYLON.Space.LOCAL);
			cloud2.rotate(rotAxis, 0.00000945*rotSpeed, BABYLON.Space.LOCAL);
			cloud3.rotate(rotAxis, 0.0000955*rotSpeed, BABYLON.Space.LOCAL);
			cloud4.rotate(rotAxis, 0.0000965*rotSpeed, BABYLON.Space.LOCAL);
			cloud5.rotate(rotAxis, 0.0000975*rotSpeed, BABYLON.Space.LOCAL);
			
			cloud6.rotate(rotFlippedAxis, -0.000097*rotSpeed, BABYLON.Space.LOCAL);
			cloud7.rotate(rotFlippedAxis, -0.0000096*rotSpeed, BABYLON.Space.LOCAL);
			cloud8.rotate(rotFlippedAxis, -0.000095*rotSpeed, BABYLON.Space.LOCAL);	
			cloud9.rotate(rotFlippedAxis, -0.000094*rotSpeed, BABYLON.Space.LOCAL);
			cloud10.rotate(rotFlippedAxis, -0.000099*rotSpeed, BABYLON.Space.LOCAL);
		});
				
}

function setupSpectator(){
	camera = new BABYLON.ArcRotateCamera("myCamera", 4, 1.6, 275, new BABYLON.Vector3(0, 60, 0), scene);
	
	engine.runRenderLoop(function () {
		camera.alpha += 0.001;
		scene.render();
		
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
			players[playerID].dispose();
			players[playerID] = null;
		}
		
		//Update active clients
		updateActiveClients();
	});
	

	socket.on('move', function(args) {
		var name = args.name;

		if(players[name] != undefined) {
			players[name].position.x = args.posX;
			players[name].position.y = args.posY;
			players[name].position.z = args.posZ;
			
			players[name].rotation.y = args.rotY
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
	
	
	
	function createAnotherPlayer(uID, uColor){
		BABYLON.SceneLoader.ImportMesh("", "serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
			
			var tempMat = new BABYLON.StandardMaterial("mat_" + uID, scene);
			tempMat.emissiveColor = new BABYLON.Color3(uColor[0],uColor[1],uColor[2]);
			tempMat.diffuseColor = new BABYLON.Color3(0,0,0);
			tempMat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
			
			newMeshes[0].material = tempMat;
			newMeshes[0].checkCollisions = true;
			newMeshes[0].scaling = new BABYLON.Vector3(1.25,1.25,1.25);
			
			players[uID] = newMeshes[0];
			
			
			
			
			scene.beginAnimation(skeletons[0], 0, 24, true, 1.0);
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
	meshSetup();
	controlsAndInteractionsSetup();
	
	
	function respawn(){
		//Overwrite spectator camera
		camera.dispose();
		camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 9.1, 0), scene);
		//Player's Camera
		camera.checkCollisions = true;
		camera.applyGravity = true;
		camera._needMoveForGravity = true;
		camera.keysDown = [83];
		camera.keysUp = [87];
		camera.keysLeft = [65];
		camera.keysRight = [68];
		//camera.speed = 1.4;
		camera.speed = 12;
		camera.inertia = .5;
		camera.angularSensibility = 1000;
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);
		//Set the ellipsoid around the camera (e.g. your player's size)
		camera.ellipsoid = new BABYLON.Vector3(1.15, 1, 1.15);
		
		//Camera look position
		camera.rotation = new BABYLON.Vector3(0,0,0);
		
		//Respawn effect
		respawnParticles(camera);
	}
	
	function meshSetup(){
		//Create player's Mesh
		players[mySocketId] = BABYLON.Mesh.CreateSphere("me", 16, 2, scene);
		// * * * * * * SINCE THIS IS NOT VISIBLE.... can we get rid of stuff beneath???  * * * * * * 
		players[mySocketId].visibility = false;
		
		//Configure player's sphere
		var red = Math.random();
		var green = Math.random();
		var blue = Math.random();
		players[mySocketId].material = new BABYLON.StandardMaterial("myMaterial", scene);
		players[mySocketId].material.emissiveColor = new BABYLON.Color3(red, green, blue);
		players[mySocketId].material.diffuseColor = new BABYLON.Color3(0,0,0);
		players[mySocketId].material.specularColor = new BABYLON.Color3(0,0,0);
		players[mySocketId].position = new BABYLON.Vector3(0, 25, 0);
		players[mySocketId].isPickable = false;
		
		
		//Package player data
		var playerData = {};
		
		playerData.color = [red, green, blue];
		playerData.nickname = nickname;
		
		//Let the server know the player has been created
		socket.emit('playerInit', playerData);
		
		//Update active client list
		updateActiveClients();
		
		//Set interval for sending my pos/updating others' pos
		setInterval(function() {
			var data = {};

			data.posX = players[mySocketId].position.x;
			data.posY = players[mySocketId].position.y;
			data.posZ = players[mySocketId].position.z;
			
			data.rotY = players[mySocketId].rotation.y;

			socket.emit('updatePos', data);
		}, 20);
	}
	
	function controlsAndInteractionsSetup(){
		// Vars for determining attack dir
		var prevCamRotX = 0;
		var prevCamRotY = 0;
		
		// On click event, request pointer lock
		canvas.addEventListener("click", function (evt) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
			if (canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		});
		
		//Keypress manager
		scene.actionManager = new BABYLON.ActionManager(scene);
		
		//*onDown*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
			switch(evt.sourceEvent.keyCode){
				//spacebar
				case 32:
						//cameraJump();
						console.log(camera.position);
						break;
				// W
				case 87:
						keyArray.push("x");
						break;
				// S
				case 83:
						keyArray.push("x");
						break;
				// A
				case 65:
						keyArray.push("x");
						break;
				// D
				case 68:
						keyArray.push("x");
						break;
			}
		}));
		
		//*onUp*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
			switch(evt.sourceEvent.keyCode){
				// W
				case 87:
						keyArray.pop();
						break;
				// S
				case 83:
						keyArray.pop();
						break;
				// A
				case 65:
						keyArray.pop();
						break;
				// D
				case 68:
						keyArray.pop();
						break;
			}
		}));
		
		function cameraJump() {
			// Use ray cast to check if camera is touching the ground
			if (canJump) {
				var cam = scene.cameras[0];

				cam.animations = [];


				var a = new BABYLON.Animation(
					"a",
					"position.y", 60,
					BABYLON.Animation.ANIMATIONTYPE_FLOAT,
					BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

				// Animation keys
				var keys = [];
				keys.push({ frame: 0, value: cam.position.y });
				keys.push({ frame: 25, value: cam.position.y + 2 });
				a.setKeys(keys);

				var easingFunction = new BABYLON.CircleEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
				a.setEasingFunction(easingFunction);

				cam.animations.push(a);

				scene.beginAnimation(cam, 0, 20, false);
			}
		}
		
		function attack(){
			// Ratios to compare which axis had more movement
			var xRotRatio = Math.abs(camera.rotation.x - prevCamRotX);
			var yRotRatio = Math.abs(camera.rotation.y - prevCamRotY);
			
						console.log(xRotRatio);
						console.log(yRotRatio);
			
			//Vertical attack!
			if(xRotRatio >= yRotRatio){
				//Upwards
				if(camera.rotation.x < prevCamRotX){
					console.log("upwards");
				}
				//Downwards
				else
				{
					console.log("downwards");
				}
			}
			//Horizontal attack!
			else
			{
				//Left
				if(camera.rotation.y < prevCamRotY){
					console.log("Left");
				}
				//Right
				else
				{
					console.log("Right");
				}
			}
		}
		
		function castCameraRay() {
			var origin = camera.position;
			var direction = new BABYLON.Vector3(0, -1, 0);
			var length = 2.1;

			cameraRay = new BABYLON.Ray(origin, direction, length);

			var hit = scene.pickWithRay(cameraRay);

			if (hit.pickedMesh) {
				canJump = true;
			} else {
				canJump = false;
			}
			
			onSlope = scene.pickWithRay(cameraRay, function (mesh) {
				if (mesh == slope1 || mesh == slope2 || mesh == slope3 || mesh == slope4) {
					return true;
				}
				return false;
			});			
		}
		
		
		
		
		
		// Mouse click events!
		canvas.addEventListener('mousedown', function (e){
				whichButton(e);
		});

		var whichButton = function (e) {
			// Handle different event models (for IE?)
			var e = e || window.event;
			var btnCode;

			if ('object' === typeof e) {
				btnCode = e.button;

				switch (btnCode) {
					//Left Click
					case 0:
						attack();
						break;
					//Middle Button Click
					case 1:
						//console.log('Middle button clicked.');
						console.log(players);
						break;
					//Right Click
					case 2:
						console.log('Right button clicked.');
						break;

					default:
						console.log('Unexpected code: ' + btnCode);
				}
			}
		}
		
		
		//////////////////		PLAYER FUNCTIONS		//////////////////
		
		function death(){
			
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
		
		
		//////////////////		OTHERS		//////////////////
		
		//Attack direction checking
		setInterval(function() {
			prevCamRotX = camera.rotation.x;
			prevCamRotY = camera.rotation.y;
		}, 250);
		
		//Gravity
		scene.gravity = new BABYLON.Vector3(0, gravityVal, 0);
		
		// Register main render loop
		engine.runRenderLoop(function () {
			if(camera.position.y<-17){
				console.log("you dead");
				death();
			}

			//Cast ray beneath player
			castCameraRay();

			//Look at keys being held down... if none, the player is not moving
			if(keyArray.length!=0){
				moving = false;
			}else{
				moving = true;
			}
			
			//if player is on slope then reverse gravity's effects
			if (canJump && !moving) {
				scene.gravity = new BABYLON.Vector3(0, 0, 0);
			}else{
				scene.gravity = new BABYLON.Vector3(0, gravityVal, 0);
			}
		
			//Mesh follows players camera (*offsets added here to compensate for player mesh)
			players[mySocketId].position = new BABYLON.Vector3(camera.position.x, camera.position.y - 2, camera.position.z);
			
			//Player mesh rotation
			players[mySocketId].rotation.y = camera.rotation.y - Math.PI;
		}); 
		
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



//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
	setupSpectator();
	setupSocketIO();
});
