function MovementAI(obj, stopSignLines) {
    this.lookaheadAI = new LookaheadAI(obj, this);
    this.obj = obj;
    this.angleInfos = this.preparePaths();
    this.lastDiff = 100;
    this.turnIncrement = 0;
    this.curSpeed = this.obj.def.speed;
    this.slowingCounter = 0;
    this.acceleratingCounter = 0;
    this.hitCounter = 0;
    if (this.angleInfos[0]) {
	this.lastAngle = this.angleInfos[0].angle;
    }
    else {
	this.lastAngle = 0;
    }
    this.slowingCoefficient = -.008 * this.obj.def.speed;
    this.acceleratingCoefficient = .0006 * this.obj.def.speed;
}

MovementAI.prototype.calcMovement = function(sharedCarState) {
    var speedTarget = this.obj.def.speed;
    if (this.obj.hit) { // temporary - need to handle better, including clearing intersection if nec
	this.hitCounter += 1;
	if (this.hitCounter > 50) {
	    this.hitCounter = 0;
	    this.obj.hit = false;
	}
	else {
	    return {changeX: 0, changeY: 0, state: 'hit', lookaheadState: 'slowing'}
	}
    };
    var angle = this.lastAngle;
    var trigX = Math.cos(toRadians(angle));
    var trigY = Math.sin(toRadians(angle));

    var angleInfo = this.angleInfos[this.obj.coordPathIndex];
    if (!angleInfo) {
	angleInfo = this.angleInfos[this.obj.coordPathIndex - 1];
    }
    // sets up bbpolys
    this.lookaheadAI.storeProjectedMovementLine(sharedCarState, angle, trigX, trigY, !angleInfo.leftTurn);
    // sets up this.obj.lookaheadState - uses previous this.obj.angleState to know which bbpoly to use
    speedTarget = this.lookaheadAI.checkObstacles(sharedCarState, angleInfo) || speedTarget;
    // sets up this.obj.angleState 
    angleResult = this.calcAngle(sharedCarState, speedTarget);
    speedTarget = angleResult.speedTarget;
    angle = angleResult.angle;
    console.log("found speedtarget " + speedTarget + " and state " + this.obj.lookaheadState);
    if (this.obj.lookaheadState == 'slowing') {
	var deltaSpeed = this.slowingCoefficient*Math.sqrt(this.slowingCounter);
	this.slowingCounter += 1;
	if (this.obj.angleState == 'turning') {	  
	    deltaSpeed = deltaSpeed * 8;
	    speedTarget = speedTarget / 8;
	}
    }
    else if ((this.obj.lookaheadState == 'moving') && (this.curSpeed < 1)) {
	var deltaSpeed = this.acceleratingCoefficient*Math.sqrt(this.acceleratingCounter);
	//consoleLog("accel ds " + deltaSpeed);
	this.acceleratingCounter += 1;
    }
    else if (this.obj.lookaheadState == 'moving') {
	this.acceleratingCounter = 0;
	this.slowingCounter = 0;
	deltaSpeed = (speedTarget - this.curSpeed) / 6;
    }

    //if (this.obj.carId === 10) {
	console.log("car 10 speedtarget: " + speedTarget + ", lookahead state: " + this.obj.lookaheadState + ", " + "angleState: " + this.obj.angleState + ", deltaSpeed: " + deltaSpeed + ", curspeed: " + this.curSpeed);
    //}

    this.curSpeed += deltaSpeed
    if (this.curSpeed<0) {
	this.curSpeed = 0.00001;
    }
    var changeX = trigX * this.curSpeed;
    var changeY = trigY * this.curSpeed;

    //consoleLog("changex is " + changeX + ", changeY is " + changeY);
    return {changeX: changeX, 
	    changeY: changeY, 
	    rotation: toRadians(angle-270), 
	    lookaheadState: this.obj.lookaheadState,
	    state: this.obj.state}
};

MovementAI.prototype.calcAngle = function(sharedCarState, speedTarget) {
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
	this.obj.angleState = this.checkDestination(angleInfo);
    }
    if (this.obj.angleState == 'turning') {
	if (this.curSpeed < 1) {
	    if (angleInfo.leftTurn) {
		var turnRadiusModifier = 1.1;
	    }
	    else {
		var turnRadiusModifier = 1.4;
	    }

	    var angleChange = (angleInfo.turnIncrement/turnRadiusModifier) * this.curSpeed;
	}
	else {
	    var angleChange = angleInfo.turnIncrement;
	}
	if (this.obj.lookaheadState == 'slowing') {
	    if (this.curSpeed < .3) {
		if (angleInfo.leftTurn) {
		    angleChange=0;
		}
		//else {
		//    angleChange = .005;
		//}
	    }
	    else {
		if (angleInfo.leftTurn) {
		    angleChange = angleChange/6;// / 1.5;
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
    
MovementAI.prototype.checkDestination = function(angleInfo) {
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
		return 'moving'
	    }
	    return 'turning'
	}	
	else if ((diff > this.lastDiff) && (diff < this.obj.def.speed*4)) {
	    this.nextPathCoord(false)
	}
	else {
	    this.lastDiff = diff;
	}
    }
    return 'moving'
}

MovementAI.prototype.nextPathCoord = function(turnMode) {
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
	this.redoPath(this.obj.coordPathIndex, 
		      [this.obj.sprite.position.x,this.obj.sprite.position.y], 
		      nextCoords);
    }

}


MovementAI.prototype.redoPath = function(idx, curCoords, nextCoords) {
    //consoleLog("in redopath with curcoords " + curCoords + " and nextcoords " + nextCoords);
    var angle = this.doPath(curCoords, nextCoords);
    //consoleLog("new angle for idx " + idx + " is " + angle);
    this.angleInfos[idx].angle = angle; 
}

MovementAI.prototype.preparePaths = function() {
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

MovementAI.prototype.doPath = function(coords, next) {
    if (next != null) {
	var deltaX = next[0]-coords[0];
	var deltaY = next[1]-coords[1];
	var angle = (toDegrees(Math.atan2(deltaY, deltaX))-360) % 360;
	return angle;
    }
}
