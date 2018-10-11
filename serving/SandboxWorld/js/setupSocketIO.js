
function setupSocketIO(){

	socket.on('update3DTerrain', function() {
		if(typeof nextTerrain != 'undefined'){
			nextTerrain.dispose();
		}
		
		var nextTerrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "/serving/TerrainViewer3D/grassOutput/out.png", 1000*terrainSize, 750*terrainSize, numSubdiv, 0, 150*terrainSize, scene, false, 
		function(){
			nextTerrain.visibility = false;
			updateTerrain(nextTerrain.getVerticesData(BABYLON.VertexBuffer.PositionKind));
		});
		
		console.log('*Terrain update');
	});
	
}


function updateTerrain(endPositions){

	currentPositions = terrain.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	numVerts = currentPositions.length/3;

	stepCount = 0;
	yDiff = []; 
	yMax = 0;

	//console.log('num vertices: ' + numVerts);

	for(x=0; x<numVerts; x++){

		// Find Y value differences b/w start and end positions
		yDiff.push((endPositions[x*3+1]-currentPositions[x*3+1])/animationSteps);

		// Find Y max
		if(currentPositions[x*3+1]>yMax)
			yMax = currentPositions[x*3+1];

	}

	//console.log('yMax: ' + yMax);


	// Start update loop
	engine.runRenderLoop(changePositions);


}
	
	
function changePositions(){
		// Step Y value of verts
		for(x=0; x<numVerts; x++){
			currentPositions[x*3+1] += yDiff[x];
		}

		terrain.updateVerticesData(BABYLON.VertexBuffer.PositionKind, currentPositions);
		stepCount++;
}

