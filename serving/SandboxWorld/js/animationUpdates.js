
// Animation update logic for player 1
function updatePlayer1Animation(newAnimationNum, animationType){
	
		//Package data to be emitted to others
		data = {};
		data.userID = mySocketId;
		data.animationCode = "00";
		data.animationType = animationType;
		
		// Animation data to be determined
		var startFrame = 0;
		var endFrame = 0;
		var loop = false;
		
		
		// WHOLE BODY
		if(animationType=="wholeBodyAnimation"){
			// 0) Idle
			if(newAnimationNum==0 && !((moveForward&&!moveBack) || (!moveForward&&moveBack)) || (moveBack&&moveForward)){
				players.get(mySocketId).curBodyAnimation = 0;
				startFrame = idleS;
				endFrame = idleE;
				loop = true;
				data.animationCode = setCharAt(data.animationCode, 0, '0');
				
			// 1) Run
			}else if(newAnimationNum==1 || (newAnimationNum==0 && (moveForward&&!moveBack))){
				players.get(mySocketId).curBodyAnimation = 1;
				startFrame = runS;
				endFrame = runE;	
				loop = true;				
				data.animationCode = setCharAt(data.animationCode, 0, '1');
			// 2) Back peddle
			}else if(newAnimationNum==2 || (newAnimationNum==0 && (!moveForward&&moveBack))){
				players.get(mySocketId).curBodyAnimation = 2;
				startFrame = runE;
				endFrame = runS;
				loop = true;
				data.animationCode = setCharAt(data.animationCode, 0, '2');
			}
			
			
			data.animationCode = setCharAt(data.animationCode, 1, '0');

			//Cycle Arm animations (loop)
			for(var x=14; x<23; x++){
				players.get(mySocketId).skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
			}
			scene.beginAnimation(players.get(mySocketId).skeleton, startFrame, endFrame, loop);

			
		}
		
		//broadcast to other players
		socket.emit('changePlayerAnimation', data);
		
	
}

// Animation update logic for all other players
function updateOtherPlayersAnimation(animationCode, animationType, userID){
	
	// Animation data to be determined
	var startFrame = 0;
	var endFrame = 0;
	var loop = false;
	
	
	// WHOLE BODY
	if(animationType=="wholeBodyAnimation"){
		
		// 0) Idle
		if(animationCode[0]=='0'){
			players.get(userID).curBodyAnimation = 0;
			startFrame = idleS;
			endFrame = idleE;
			loop = true;
			
		// 1) Run
		}else if(animationCode[0]=='1'){
			players.get(userID).curBodyAnimation = 1;
			startFrame = runS;
			endFrame = runE;	
			loop = true;				
			
		// 2) Back peddle
		}else if(animationCode[0]=='2'){
			players.get(userID).curBodyAnimation = 2;
			startFrame = runE;
			endFrame = runS;
			loop = true;
		}
		
		// Execute full animation
		
		//If arms are currently acting... leave them alone
		if(animationCode[1]=='1'){
			for(var x=0; x<14; x++){
				scene.beginAnimation(players.get(userID).skeleton.bones[x], startFrame, endFrame, loop);
			}
			for(var x=23; x<43; x++){
				scene.beginAnimation(players.get(userID).skeleton.bones[x], startFrame, endFrame, loop);
			}
		//Else include all bones
		}else{
			//Cycle Arm animations (loop)
			for(var x=14; x<23; x++){
				players.get(userID).skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
			}
			scene.beginAnimation(players.get(userID).skeleton, startFrame, endFrame, loop);
		}
		
	}
	
}
