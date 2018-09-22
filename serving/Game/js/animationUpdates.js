
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
				players[mySocketId].curBodyAnimation = 0;
				startFrame = idleS;
				endFrame = idleE;
				loop = true;
				data.animationCode = setCharAt(data.animationCode, 0, '0');
				
			// 1) Run
			}else if(newAnimationNum==1 || (newAnimationNum==0 && (moveForward&&!moveBack))){
				players[mySocketId].curBodyAnimation = 1;
				startFrame = runS;
				endFrame = runE;	
				loop = true;				
				data.animationCode = setCharAt(data.animationCode, 0, '1');
			// 2) Back peddle
			}else if(newAnimationNum==2 || (newAnimationNum==0 && (!moveForward&&moveBack))){
				players[mySocketId].curBodyAnimation = 2;
				startFrame = runE;
				endFrame = runS;
				loop = true;
				data.animationCode = setCharAt(data.animationCode, 0, '2');
			}
			
			// Execute full animation
			//If arms are currently acting... leave them alone
			if(players[mySocketId].armProxy.armLock){
				
				data.animationCode = setCharAt(data.animationCode, 1, '1');
				
				for(var x=0; x<14; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop);
				}
				for(var x=23; x<43; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop);
				}
			//Else include all bones
			}else{
				
				data.animationCode = setCharAt(data.animationCode, 1, '0');
				
				//Cycle Arm animations (loop)
				for(var x=14; x<23; x++){
					players[mySocketId].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
				}
				scene.beginAnimation(players[mySocketId].skeleton, startFrame, endFrame, loop);
			}
			
		// ARM(s) ONLY
		}else if(animationType=="armAnimation"){
			
			let stopBlock = false;
			
			//Override loopMode for arm animations (so that they pause at the final frame)
			for(var x=14; x<23; x++){
				players[mySocketId].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
			}
			
			// 0) Swing/StopBlocking/Null
			if(newAnimationNum==0){
				
				switch(players[mySocketId].curArmAnimation) {
					// Up Swing
					case 1:
						startFrame = uAttackE-24;
						endFrame = uAttackE;
						data.animationCode = setCharAt(data.animationCode, 1, '1');
						break;
					// Down Swing
					case 2:
						startFrame = dAttackE-24;
						endFrame = dAttackE;
						data.animationCode = setCharAt(data.animationCode, 1, '2');
						break;
					// Left Swing
					case 3:
						startFrame = lAttackE-24;
						endFrame = lAttackE;
						data.animationCode = setCharAt(data.animationCode, 1, '3');
						break;
					// Right Swing
					case 4:
						startFrame = rAttackE-24;
						endFrame = rAttackE;
						data.animationCode = setCharAt(data.animationCode, 1, '4');
						break;
					// Up Block Stop
					case 5:
						startFrame = uBlockE;
						endFrame = uBlockE;
						data.animationCode = setCharAt(data.animationCode, 1, '5');
						stopBlock = true;
						break;
					// Down Block Stop
					case 6:
						startFrame = dBlockE;
						endFrame = dBlockE;
						data.animationCode = setCharAt(data.animationCode, 1, '6');
						stopBlock = true;
						break;
					// Right Block Stop
					case 7:
						startFrame = rBlockE;
						endFrame = rBlockE;
						data.animationCode = setCharAt(data.animationCode, 1, '7');
						stopBlock = true;
						break;
					// Left Block Stop
					case 8:
						startFrame = lBlockE;
						endFrame = lBlockE;
						data.animationCode = setCharAt(data.animationCode, 1, '8');
						stopBlock = true;
						break;
				}
				
				// Only execute animation if arm is prepped. 
				// Otherwise the animation will be deferred to the arm proxy handler.
				if(players[mySocketId].armProxy.armPrepped || stopBlock){
					for(var x=14; x<22; x++){
						scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, false, 1.0);
					}
					
					//broadcast to other players
					socket.emit('changePlayerAnimation', data);
				}
				
				// The current arm animation is 0, so we have to use another var to store the type of swing
				// used for arm proxy animation execution and determining attack type after a player is hit
				players[mySocketId].armProxy.prevArmAnimation = players[mySocketId].curArmAnimation;
					

				players[mySocketId].curArmAnimation = 0;
			
				// Animation execution logic is within here, so we are done
				return;
			
			// 1) Up Attack
			}else if(newAnimationNum==1){
				players[mySocketId].curArmAnimation = 1;
				startFrame = uAttackS;
				endFrame = uAttackE-25;
				data.animationCode = setCharAt(data.animationCode, 0, '1');
				loop = true;
				
			// 2) Down Attack
			}else if(newAnimationNum==2){
				players[mySocketId].curArmAnimation = 2;
				startFrame = dAttackS;
				endFrame = dAttackE-25;
				data.animationCode = setCharAt(data.animationCode, 0, '2');
				loop = true;
				
			// 3) Left Attack
			}else if(newAnimationNum==3){
				players[mySocketId].curArmAnimation = 3;
				startFrame = lAttackS;
				endFrame = lAttackE-25;
				data.animationCode = setCharAt(data.animationCode, 0, '3');
				loop = true;
				
			// 4) Right Attack
			}else if(newAnimationNum==4){
				players[mySocketId].curArmAnimation = 4;
				startFrame = rAttackS;
				endFrame = rAttackE-25;
				data.animationCode = setCharAt(data.animationCode, 0, '4');
				loop = true;
				
			// 5) Up Block
			}else if(newAnimationNum==5){
				players[mySocketId].curArmAnimation = 5;
				startFrame = uBlockS;
				endFrame = uBlockE;
				data.animationCode = setCharAt(data.animationCode, 0, '5');
				loop = true;
				
			// 6) Down Block
			}else if(newAnimationNum==6){
				players[mySocketId].curArmAnimation = 6;
				startFrame = dBlockS;
				endFrame = dBlockE;
				data.animationCode = setCharAt(data.animationCode, 0, '6');
				loop = true;
				
			// 7) Right Block
			}else if(newAnimationNum==7){
				players[mySocketId].curArmAnimation = 7;
				startFrame = rBlockS;
				endFrame = rBlockE;
				data.animationCode = setCharAt(data.animationCode, 0, '7');
				loop = true;
				
			// 8) Left Block
			}else if(newAnimationNum==8){
				players[mySocketId].curArmAnimation = 8;
				startFrame = lBlockS;
				endFrame = lBlockE;
				data.animationCode = setCharAt(data.animationCode, 0, '8');
				loop = true;
			}
			
			// Execute arm animation
			for(var x=14; x<22; x++){
					scene.beginAnimation(players[mySocketId].skeleton.bones[x], startFrame, endFrame, loop, 1.0)
			}
			
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
			players[userID].curBodyAnimation = 0;
			startFrame = idleS;
			endFrame = idleE;
			loop = true;
			
		// 1) Run
		}else if(animationCode[0]=='1'){
			players[userID].curBodyAnimation = 1;
			startFrame = runS;
			endFrame = runE;	
			loop = true;				
			
		// 2) Back peddle
		}else if(animationCode[0]=='2'){
			players[userID].curBodyAnimation = 2;
			startFrame = runE;
			endFrame = runS;
			loop = true;
		}
		
		// Execute full animation
		
		//If arms are currently acting... leave them alone
		if(animationCode[1]=='1'){
			for(var x=0; x<14; x++){
				scene.beginAnimation(players[userID].skeleton.bones[x], startFrame, endFrame, loop);
			}
			for(var x=23; x<43; x++){
				scene.beginAnimation(players[userID].skeleton.bones[x], startFrame, endFrame, loop);
			}
		//Else include all bones
		}else{
			//Cycle Arm animations (loop)
			for(var x=14; x<23; x++){
				players[userID].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
			}
			scene.beginAnimation(players[userID].skeleton, startFrame, endFrame, loop);
		}
		
	// ARM(s) ONLY
	}else if(animationType=="armAnimation"){
		
		//Override loopMode for arm animations (so that they pause at the final frame)
		for(var x=14; x<23; x++){
			players[userID].skeleton.bones[x].animations[0].loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
		}
		
		// 0) Swing/Null
		if(animationCode[0]=='0'){
			
			switch(animationCode[1]) {
				// Up Swing
				case '1':
					startFrame = uAttackE-24;
					endFrame = uAttackE;
					break;
				// Down Swing
				case '2':
					startFrame = dAttackE-24;
					endFrame = dAttackE;
					break;
				// Left Swing
				case '3':
					startFrame = lAttackE-24;
					endFrame = lAttackE;
					break;
				// Right Swing
				case '4':
					startFrame = rAttackE-24;
					endFrame = rAttackE;
					break;
				// Up Block Stop
				case '5':
					startFrame = uBlockE;
					endFrame = uBlockE;
					break;
				// Down Block Stop
				case '6':
					startFrame = dBlockE;
					endFrame = dBlockE;
					break;
				// Right Block Stop
				case '7':
					startFrame = rBlockE;
					endFrame = rBlockE;
					break;
				// Left Block Stop
				case '8':
					startFrame = lBlockE;
					endFrame = lBlockE;
					break;
			}
			
			loop = false;
			players[userID].curArmAnimation = 0;
		
		// 1) Up Attack
		}else if(animationCode[0]=='1'){
			players[userID].curArmAnimation = 1;
			startFrame = uAttackS;
			endFrame = uAttackE-25;
			loop = true;
			
		// 2) Down Attack
		}else if(animationCode[0]=='2'){
			players[userID].curArmAnimation = 2;
			startFrame = dAttackS;
			endFrame = dAttackE-25;
			loop = true;
			
		// 3) Left Attack
		}else if(animationCode[0]=='3'){
			players[userID].curArmAnimation = 3;
			startFrame = lAttackS;
			endFrame = lAttackE-25;
			loop = true;
			
		// 4) Right Attack
		}else if(animationCode[0]=='4'){
			players[userID].curArmAnimation = 4;
			startFrame = rAttackS;
			endFrame = rAttackE-25;
			loop = true;
			
		// 5) Up Block
		}else if(animationCode[0]=='5'){
			players[userID].curArmAnimation = 5;
			startFrame = uBlockS;
			endFrame = uBlockE;
			loop = true;
			
		// 6) Down Block
		}else if(animationCode[0]=='6'){
			players[userID].curArmAnimation = 6;
			startFrame = dBlockS;
			endFrame = dBlockE;
			loop = true;
			
		// 7) Right Block
		}else if(animationCode[0]=='7'){
			players[userID].curArmAnimation = 7;
			startFrame = rBlockS;
			endFrame = rBlockE;
			loop = true;
			
		// 8) Left Block
		}else if(animationCode[0]=='8'){
			players[userID].curArmAnimation = 8;
			startFrame = lBlockS;
			endFrame = lBlockE;
			loop = true;
		}
		
		// Execute arm animation
		for(var x=14; x<22; x++){
				scene.beginAnimation(players[userID].skeleton.bones[x], startFrame, endFrame, loop, 1.0)
		}
		
	}
	
}
