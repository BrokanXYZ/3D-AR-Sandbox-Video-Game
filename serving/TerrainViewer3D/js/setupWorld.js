
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
	//engine.loadingUIBackgroundColor = "green";


	// 	    **************  LOADING FINISHED  **************
	
	assetsManager.onFinish = function (tasks) {
		engine.runRenderLoop(function () {
			scene.render();
		});
	};
	
	assetsManager.load();
	
}




function createWorld(){

		// Change scene background
		//scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
		scene.clearColor = new BABYLON.Color3(0, 0, 0);
		
		// Create terrain object
		terrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "/serving/TerrainViewer3D/heightmaps/out.png", 1000, 750, numSubdiv, 0, 150, scene, true, null);

		terrain.position = new BABYLON.Vector3(0,0,0);

		terrain.material = new BABYLON.StandardMaterial("terrainMat", scene);
		terrain.material.emissiveColor = new BABYLON.Color3(0.25, 0.25, 0.25);
		terrain.material.wireframe = true;

		//var blackPlane = BABYLON.MeshBuilder.CreatePlane("blackPlane", {width: 1100, height: 850}, scene);
		//blackPlane.rotation.x = Math.PI/2;
	
	
		// Stops terrain from conintuing to update once its end position is reached
		engine.runRenderLoop(function () {
			if(animationSteps<stepCount){
				engine.stopRenderLoop(changePositions);	
			}
		});


}





	



function setupSpectator(){

    camera = new BABYLON.ArcRotateCamera("Camera", -1.56, 0.81, 1250, new BABYLON.Vector3(0, 0, 0), scene);

    camera.panningSensibility = 100;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    //spectatorCameraRotate = setInterval(function(){camera.alpha += 0.001;}, 10);
}
