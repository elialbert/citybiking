function PathingAI(obj, movementAI) {
    this.obj = obj;
    this.movementAI = movementAI;
    this.angleInfos = this.preparePaths();
    if (this.angleInfos[0]) {
	this.lastAngle = this.angleInfos[0].angle;
    }
    else {
	this.lastAngle = 0;
    }

}

PathingAI.prototype.calcAngle = function(sharedCarState, speedTarget) {
    var angleInfo = this.angleInfos[this.obj.coordPathIndex];
    if (!angleInfo) {
	angleInfo = this.angleInfos[this.obj.coordPathIndex - 1];
	var angle = this.lastAngle || 0;
    }
    else {
	var angle = angleInfo.angle;
    }
    var waitingForLeft = false
    if (this.obj.extraState === 'pause') {
	this.obj.angleState = 'moving';
	this.lastAngle = angle;
    }
    else {
	var result = this.checkDestination(angleInfo);
	this.obj.angleState = result.state;
	if (result.found) {
	    angleInfo = this.angleInfos[this.obj.coordPathIndex];
	}
	angle = angleInfo.angle;
    }
    if (this.obj.angleState == 'turning') {
	if (this.movementAI.curSpeed < 1) {
	    if (angleInfo.leftTurn) {
		var turnRadiusModifier = 1.1;
	    }
	    else {
		var turnRadiusModifier = 1.4;
	    }

	    var angleChange = (angleInfo.turnIncrement/turnRadiusModifier) * this.movementAI.curSpeed;
	}
	else {
	    var angleChange = angleInfo.turnIncrement;
	}
	if (this.obj.lookaheadState == 'slowing') {
	    if (this.movementAI.curSpeed < .3) {
		if (angleInfo.leftTurn) {
		    angleChange=0;
		}
	    }
	    else {
		if (angleInfo.leftTurn) {
		    angleChange = angleChange/6;
		}
	    }
	}
	
	angle = (this.lastAngle || angle) + angleChange;
	this.lastAngle = angle;
	speedTarget = Math.max((this.obj.def.speed / 2), 1)
	return {angle:angle, speedTarget: speedTarget}
    }
    else if (this.obj.lookaheadState == 'moving') {
	speedTarget = speedTarget || this.obj.def.speed;
    }
    return {angle:angle, speedTarget: speedTarget}
}
    
PathingAI.prototype.checkDestination = function(angleInfo) {
    // check if coord has been reached
    var nextCoords = this.obj.coordPath[this.obj.coordPathIndex+1];
    if (nextCoords) {
	var diffx = Math.abs(nextCoords[0] - this.obj.sprite.position.x);
	var diffy = Math.abs(nextCoords[1] - this.obj.sprite.position.y);
	var diff = diffx + diffy;
	if (Math.abs(angleInfo.angle) > 20) {
	    var turnDistance = 20*(Math.max(this.obj.def.speed,2));
	}
	else {
	    var turnDistance = 15;
	}
	//if (this.obj.carId === 10) {
	//    consoleLog("diffx: " + Math.abs(nextCoords[0] - this.obj.sprite.position.x) + ", diffy: " + Math.abs(nextCoords[1] - this.obj.sprite.position.y) + ", needsturn: " + angleInfo.needsTurn + ", turndist: " + turnDistance);
	    //consoleLog("diff: " + diff + ", lastDiff: " + this.lastDiff);
	    
	//}

	if ((angleInfo.needsTurn && (diff < turnDistance)) || (this.obj.angleState == 'turning')) {
	    this.lastDiff = diff;
	    if ((Math.abs(this.lastAngle - angleInfo.nextAngle)%360) < 2) {
		this.nextPathCoord(true);
		return {found:true, state:'moving'}
	    }
	    return {found:false, state:'turning'}
	}	
	else if ((diff > this.lastDiff) && (diff < this.obj.def.speed*4)) {
	    this.nextPathCoord(false)
	}
	else {
	    this.lastDiff = diff;
	}
    }
    return {found:false, state:'moving'}
}

PathingAI.prototype.nextPathCoord = function(turnMode) {
    var nextCoords = this.obj.coordPath[this.obj.coordPathIndex+1];
    this.obj.coordPathIndex += 1;
    this.lastDiff = 100;
    this.turnIncrement = 0;
    if (!turnMode) {
	this.obj.sprite.position.x = nextCoords[0];
	this.obj.sprite.position.y = nextCoords[1];
    }
    else {
	var nextCoords = this.obj.coordPath[this.obj.coordPathIndex+1];
	return this.redoPath(this.obj.coordPathIndex, 
				     [this.obj.sprite.position.x,this.obj.sprite.position.y], 
				     nextCoords);
    }

}


PathingAI.prototype.redoPath = function(idx, curCoords, nextCoords) {
    //consoleLog("in redopath with curcoords " + curCoords + " and nextcoords " + nextCoords);
    var angle = this.doPath(curCoords, nextCoords);
    //consoleLog("new angle for idx " + idx + " is " + angle);
    this.angleInfos[idx].angle = angle; 
    return angle;
}

PathingAI.prototype.preparePaths = function() {
    var angleList = [];
    var coordPath = this.obj.coordPath;
    _.each(coordPath, function(coords, idx) {
	var next = coordPath[idx+1];
	var angle = this.doPath(coords, next);
	if (angle != null) {
	    angleList.push(angle);
	}
    }, this);
    var angleInfo = [];
    var speed = this.obj.def.speed;
    _.each(angleList, function(angle, idx) {
	info = {angle: angle, needsTurn: false}
	if (angleList[idx+1] != null) {
	    var counterclockwise = false;
	    angleDiff = Math.abs(angleList[idx+1] - angle);
	    angleDiffNew = Math.min(angleDiff, 360-angleDiff);
	    if (angleDiffNew < angleDiff) {
		angleDiff = angleDiffNew;
		counterclockwise = true;
	    }
	    if (angleDiff >= 0) {
		info.needsTurn = true;
		info.turnIncrement = 1.6;//4 / (this.obj.def.speed + 1);
		var neg1 = 1;
		var neg2 = 1;
		if (counterclockwise) {
		    neg1 = -1;
		}
		if (angleList[idx+1] < angle) {
		    neg2 = -1;
		}
		info.turnIncrement = neg1*neg2*info.turnIncrement;
		if (info.turnIncrement < 0) {
		    info.leftTurn = true;
		}
		info.numIncrements = Math.abs(angleDiff / info.turnIncrement);
		info.nextAngle = angleList[idx+1];
	    }
	}
	angleInfo.push(info);
    }, this);
    return angleInfo
}

PathingAI.prototype.doPath = function(coords, next) {
    if (next != null) {
	var deltaX = next[0]-coords[0];
	var deltaY = next[1]-coords[1];
	var angle = (toDegrees(Math.atan2(deltaY, deltaX))-360) % 360;
	return angle;
    }
}

