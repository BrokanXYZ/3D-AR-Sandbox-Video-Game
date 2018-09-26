
function setupSocketIO(){

	socket.on('update2DTerrain', function(fileNum) {
		
		console.log('*Terrain update ' + fileNum);
		
		hMap.source = "/serving/TerrainViewer2D/grassOutput/out" + fileNum + ".png";
		contours.source = "/serving/TerrainViewer2D/grassOutput/cropped-Contours" + fileNum + ".png";
		
		
		
	});
	
}

