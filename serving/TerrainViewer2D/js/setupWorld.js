
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


function setupGUI(){

		// Change scene background
		scene.clearColor = new BABYLON.Color3(0, 0, 0);
		
		// GUI Setup
		advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

		hMap = new BABYLON.GUI.Image("hMap", "/serving/TerrainViewer2D/grassOutput/blankOut.png");
		advancedTexture.addControl(hMap);  
	
		contours = new BABYLON.GUI.Image("contours", "/serving/TerrainViewer2D/grassOutput/blankContours.png");
		advancedTexture.addControl(contours); 
	
	
		setInterval(function(){ 
			updatePlayerPositions(); 
			drawPlayers(); 
		}, 1000);

}


function setupCamera(){
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
}
