
/*
-------------------- Helpers --------------------
*/
function delayActions(delay){
	actionDelay = true;
	setTimeout(function(){ actionDelay = false; }, delay);
}
function updateActiveClients(){
	socket.emit('updateActiveClients', function(data) {
		activeClients = data;
	});
}

/*
-------------------- General helpers --------------------
*/
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}
function randomNumber(min,max){
	return Math.random() * (max-min)+min;
}
function setCharAt(targetString, index, setChar){
    return targetString.substr(0, index) + setChar+ targetString.substr(index + setChar.length);
}
