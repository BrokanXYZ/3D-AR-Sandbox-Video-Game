
// Babylon vars
var canvas; 
var engine; 
var scene; 


var Weapon;

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
}
		
function createWorld(){
	
	// This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("cam", 0, 0, 5, new BABYLON.Vector3(0, 1, 0), scene);
	
	camera.wheelPrecision = 50;


    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	BABYLON.SceneLoader.ImportMesh("", "serving/meshes/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {
			
			playerMesh = newMeshes[0];
			playerSkeleton = skeletons[0];
			swordMesh = newMeshes[1];
			
			
			var playerMat = new BABYLON.StandardMaterial("playermat", scene);
			playerMat.emissiveColor = new BABYLON.Color3(.25,.5,0);
			playerMat.diffuseColor = new BABYLON.Color3(0,0,0);
			playerMat.specularColor = new BABYLON.Color3(0,0,0);
			
			var swordMat = new BABYLON.StandardMaterial("swordMat", scene);
			swordMat.emissiveColor = new BABYLON.Color3(0.6,0.6,0.6);
			swordMat.diffuseColor = new BABYLON.Color3(0,0,0);
			swordMat.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
			
			//Player model
			playerMesh.material = playerMat;
			playerMesh.checkCollisions = true;
			playerMesh.scaling = new BABYLON.Vector3(1.25,1.25,1.25);
			
			//SWORD!
			swordMesh.material = swordMat;
			
			
			
			Weapon = swordMesh;
			swordMesh.attachToBone(playerSkeleton.bones[20], playerMesh);
			
			swordMesh.rotation.x = 2.984;
			swordMesh.rotation.y = 3.078;
			swordMesh.rotation.z = 1.602;
			
			swordMesh.position.x = 0.265;
			swordMesh.position.y = 0.031;
			swordMesh.position.z = 0.045;
			
			// Start idle animation
			scene.beginAnimation(playerSkeleton, 0, 100, true, 1.0);
		});
	
	
	
	
	
	
	
	
	
	
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);

    var header = new BABYLON.GUI.TextBlock();
    header.text = "Y-rotation: 0 deg";
    header.height = "30px";
    header.color = "white";
    panel.addControl(header); 

    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 2 * Math.PI;
    slider.value = 0;
    slider.height = "20px";
    slider.width = "200px";
    slider.onValueChangedObservable.add(function(value) {
        header.text = "Y-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
        if (Weapon) {
            Weapon.position.y = value;
        }
    });
    panel.addControl(slider);  
	
	var header1 = new BABYLON.GUI.TextBlock();
    header1.text = "X-pos: 0 deg";
    header1.height = "30px";
    header1.color = "white";
    panel.addControl(header1); 
	
	var slider1 = new BABYLON.GUI.Slider();
    slider1.minimum = 0;
    slider1.maximum = 2 * Math.PI;
    slider1.value = 0;
    slider1.height = "20px";
    slider1.width = "200px";
    slider1.onValueChangedObservable.add(function(value) {
        header1.text = "X-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
        if (Weapon) {
            Weapon.position.x = value;
        }
    });
    panel.addControl(slider1);  
	
	
	var header2 = new BABYLON.GUI.TextBlock();
    header2.text = "Z-rotation: 0 deg";
    header2.height = "30px";
    header2.color = "white";
    panel.addControl(header2); 
	
	var slider2 = new BABYLON.GUI.Slider();
    slider2.minimum = 0;
    slider2.maximum = 2 * Math.PI;
    slider2.value = 0;
    slider2.height = "20px";
    slider2.width = "200px";
    slider2.onValueChangedObservable.add(function(value) {
        header2.text = "Z-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
        if (Weapon) {
            Weapon.position.z = value;
        }
    });
    panel.addControl(slider2);  
	
	
	
	
	
	
	
	
	
	
	//Keypress manager
		scene.actionManager = new BABYLON.ActionManager(scene);
		
		//*onDown*
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
			switch(evt.sourceEvent.keyCode){
				//spacebar
				case 32:
						console.log(Weapon.position);
						break;
				// W
				case 87:
						
						break;
				// S
				case 83:
						
						break;
				// A
				case 65:
						
						break;
				// D
				case 68:
						
						break;
			}
		}));
	
	
	
	
	
	
	
	
}



//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
});
