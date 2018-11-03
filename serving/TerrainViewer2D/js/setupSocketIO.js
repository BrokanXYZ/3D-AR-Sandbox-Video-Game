
function setupSocketIO(){
	
	socket.on('update2DTerrain', function(fileNum) {
		
		console.log('*Terrain update ' + fileNum);
		
		hMap.source = "/serving/TerrainViewer2D/grassOutput/out" + fileNum + ".png";
		contours.source = "/serving/TerrainViewer2D/grassOutput/cropped-Contours" + fileNum + ".png";
	
	});
	
	
	
	
}

function drawPlayers(){

	for(var x=0; x<players.length; x++){
		
		var playerIsNode = false;
		
		if(playerNodes.get(players[x][0])!=undefined){
			playerIsNode = true;		
		}
		
		
		
		// Yes --> Update
		if(playerIsNode){
			playerNodes.get(players[x][0]).left = players[x][1][0];
			playerNodes.get(players[x][0]).top = players[x][1][2];
			playerNodes.get(players[x][0]).updated = true;
			
		// No --> Create
		}else{
			var tempPlayerNode = new BABYLON.GUI.Ellipse();
			tempPlayerNode.width = pNodeSize + "px"
			tempPlayerNode.height = pNodeSize + "px";
			tempPlayerNode.color = "yellow"
			tempPlayerNode.thickness = 1.25;
			tempPlayerNode.background = fullColorHex(players[x][2][0],players[x][2][1],players[x][2][2]);
			tempPlayerNode.left = players[x][1][0];
			tempPlayerNode.top = players[x][1][2];
			tempPlayerNode.updated = true;
			playerNodes.set(players[x][0],tempPlayerNode);

			advancedTexture.addControl(playerNodes.get(players[x][0]));  
		}
		
	}
	
	
	// Delete
	playerNodes.forEach(function(value, key){
		if(!value.updated){
			advancedTexture.removeControl(playerNodes.get(key));
			playerNodes.delete(key);
		}
		
		// Reset 'updated' field
		value.updated = false;
	});

}


function updatePlayerPositions(){
	socket.emit('update2dMapPositions', function(data) {
		players = data;
		
		// 3D Coords to 2D
		for(var x=0; x<players.length; x++){
			var x3D = players[x][1][0];
			var y3D = players[x][1][1];
			var z3D = players[x][1][2];
			
			players[x][1] = toScreenCoords(x3D, y3D, z3D);	
		}
	});
}


function toScreenCoords(x,y,z){
	var xP = (((x-xMin3D)*xRange2D) / xRange3D) + xMin2D;
	var zP = (((z-zMin3D)*zRange2D) / zRange3D) + zMin2D;
	
	return [xP,y,zP];
}

function rgbToHex(rgb) { 
  var hex = Number(Math.floor(rgb*255)).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

function fullColorHex(r,g,b) {   
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return "#"+red+green+blue;
};

