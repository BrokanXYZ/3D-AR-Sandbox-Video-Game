// Textures
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
	
	//Resize game on window resize
	window.addEventListener("resize", function () {
		engine.resize();
	});
	
	// 		**************  LOADING  **************
	var assetsManager = new BABYLON.AssetsManager(scene);
	engine.loadingUIBackgroundColor = "green";

	// 1. Textures
		
	groundMat = new BABYLON.StandardMaterial("groundMat", scene);	
	groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
	
	var textureTask8 = assetsManager.addTextureTask("groundDiffuseTexture", "/serving/Game/textures/sand.png");
	textureTask8.onSuccess = function(task) {
		groundMat.diffuseTexture = task.texture;
		groundMat.diffuseTexture.uScale = 20.0;
		groundMat.diffuseTexture.vScale = 20.0;
	}
	
	
	mountainMat = new BABYLON.StandardMaterial("mountainMat", scene);
	mountainMat.specularColor = new BABYLON.Color3(0, 0, 0);
	mountainMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
	
	
	cloud1Mat = new BABYLON.StandardMaterial("cloud1Mat", scene);	
	cloud1Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud1Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask9 = assetsManager.addTextureTask("cloud1DiffuseTexture", "/serving/Game/textures/cloud1.png");
	textureTask9.onSuccess = function(task) {
		cloud1Mat.diffuseTexture = task.texture;
		cloud1Mat.diffuseTexture.hasAlpha = true;
		cloud1Mat.diffuseTexture.uScale = 1.0;
		cloud1Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud2Mat = new BABYLON.StandardMaterial("cloud2Mat", scene);	
	cloud2Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud2Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask10 = assetsManager.addTextureTask("cloud2DiffuseTexture", "/serving/Game/textures/cloud2.png");
	textureTask10.onSuccess = function(task) {
		cloud2Mat.diffuseTexture = task.texture;
		cloud2Mat.diffuseTexture.hasAlpha = true;
		cloud2Mat.diffuseTexture.uScale = 1.0;
		cloud2Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud3Mat = new BABYLON.StandardMaterial("cloud3Mat", scene);	
	cloud3Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud3Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask11 = assetsManager.addTextureTask("cloud3DiffuseTexture", "/serving/Game/textures/cloud3.png");
	textureTask11.onSuccess = function(task) {
		cloud3Mat.diffuseTexture = task.texture;
		cloud3Mat.diffuseTexture.hasAlpha = true;
		cloud3Mat.diffuseTexture.uScale = 1.0;
		cloud3Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud4Mat = new BABYLON.StandardMaterial("cloud4Mat", scene);	
	cloud4Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud4Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask12 = assetsManager.addTextureTask("cloud4DiffuseTexture", "/serving/Game/textures/cloud4.png");
	textureTask12.onSuccess = function(task) {
		cloud4Mat.diffuseTexture = task.texture;
		cloud4Mat.diffuseTexture.hasAlpha = true;
		cloud4Mat.diffuseTexture.uScale = 1.0;
		cloud4Mat.diffuseTexture.vScale = 1.0;
	}
	
	
	cloud5Mat = new BABYLON.StandardMaterial("cloud5Mat", scene);	
	cloud5Mat.emissiveColor = new BABYLON.Color3(0.9,0.9,0.9);
	cloud5Mat.specularColor = new BABYLON.Color3(0,0,0);
	
	var textureTask13 = assetsManager.addTextureTask("cloud5DiffuseTexture", "/serving/Game/textures/cloud5.png");
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
	
	var skyboxTask1 = assetsManager.addCubeTextureTask("skyboxCubeTexture", "/serving/Game/skybox/skybox");
	skyboxTask1.onSuccess = function(task) {
		skyboxMaterial.reflectionTexture = task.texture;
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	}
	

	
	// 3. Audio
	
	/*var audioTask7 = assetsManager.addBinaryFileTask("song1AudioTask", "serving/Game/sounds/tracks/LightEmUp.mp3");
	audioTask7.onSuccess = function (task) {
		song1 = new BABYLON.Sound("song1", task.data, scene, null, {volume: 0.5, autoplay:true});
		song1.onended = function(){ song2.play();};
	}
	
	var audioTask8 = assetsManager.addBinaryFileTask("song2AudioTask", "serving/Game/sounds/tracks/Mindwarp.mp3");
	audioTask8.onSuccess = function (task) {
		song2 = new BABYLON.Sound("song2", task.data, scene, null, {volume: 0.5});
		song2.onended = function(){ song3.play();};
	}
	
	var audioTask9 = assetsManager.addBinaryFileTask("song3AudioTask", "serving/Game/sounds/tracks/Mirrorball.mp3");
	audioTask9.onSuccess = function (task) {
		song3 = new BABYLON.Sound("song3", task.data, scene, null, {volume: 0.5});
		song3.onended = function(){ song1.play();};
	}*/
	
	
	
	
	// 	    **************  LOADING FINISHED  **************
	
	assetsManager.onFinish = function (tasks) {
		
		// On click event, request pointer lock
		canvas.addEventListener("click", function (evt) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
			if (canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		});
		
		engine.runRenderLoop(function () {
			scene.render();
		});
	};
	
	assetsManager.load();
	
}


function createWorld(){

		// Change scene background
		scene.clearColor = new BABYLON.Color3(1,0.3,0.1);
	
		//Light
		var light0 = new BABYLON.DirectionalLight("light0", new BABYLON.Vector3(0, -1.5, 1), scene);
		light0.position = new BABYLON.Vector3(0, 50, -50);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 0, 0);
		light0.groundColor = new BABYLON.Color3(0, 0, 0);
		light0.intensity = 0.9;
		
		// Create terrain object
		terrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "/serving/TerrainViewer3D/grassOutput/out.png", 1000*terrainSize, 750*terrainSize, numSubdiv, 0, 150*terrainSize, scene, true, null);
		terrain.position = new BABYLON.Vector3(0,0,0);
		terrain.material = groundMat;
		
		unevenMeshes.push(terrain);
		
		// Stops terrain from conintuing to update once its end position is reached
		engine.runRenderLoop(function () {
			if(animationSteps<stepCount){
				engine.stopRenderLoop(changePositions);	
			}
		});

	
	
	
	
	
	
	
	
	
	
	
	
	

}
