
function setupSocketIO(){

	socket.on('updateTerrain', function() {
		
		if(typeof nextTerrain != 'undefined'){
			nextTerrain.dispose();
		}
		
		var nextTerrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "/serving/TerrainViewer3D/heightmaps/out.png", 1000, 750, numSubdiv, 0, 150, scene, false, 
		function(){
			nextTerrain.visibility = false;
			updateTerrain(nextTerrain.getVerticesData(BABYLON.VertexBuffer.PositionKind));
		});
		
		
	});
	
}


function updateTerrain(endPositions){

	currentPositions = terrain.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	numVerts = currentPositions.length/3;

	stepCount = 0;
	yDiff = []; 
	yMax = 0;

	console.log('num vertices: ' + numVerts);

	for(x=0; x<numVerts; x++){

		// Find Y value differences b/w start and end positions
		yDiff.push((endPositions[x*3+1]-currentPositions[x*3+1])/animationSteps);

		// Find Y max
		if(currentPositions[x*3+1]>yMax)
			yMax = currentPositions[x*3+1];

	}

	console.log('yMax: ' + yMax);


	// Start update loop
	engine.runRenderLoop(changePositions);


}
	
	
function changePositions(){

		var colors = [];

		// Step Y value of verts
		for(x=0; x<numVerts; x++){
			currentPositions[x*3+1] += yDiff[x];
			var vertColor = getColor(currentPositions[x*3+1]);
			colors.push(vertColor[0],vertColor[1],vertColor[2],1);
		}

		terrain.updateVerticesData(BABYLON.VertexBuffer.PositionKind, currentPositions);
		terrain.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
		stepCount++;
}


function getColor(yValue){

		var colorDiv = (yMax/7)/yMax;
		var yValueNorm = yValue/yMax;


		if(yValueNorm<colorDiv){
			return [2,0,4];

		}else if(yValueNorm<colorDiv*2){
			return [0,0,4];

		}else if(yValueNorm<colorDiv*3){
			return [0,2,4];

		}else if(yValueNorm<colorDiv*4){
			return [0,4,0];

		}else if(yValueNorm<colorDiv*5){
			return [3.5,3.5,0];

		}else if(yValueNorm<colorDiv*6){
			return [4,2,0];

		}else{
			return [4,0,0];
		}

}
