function MovementAI(obj, stopSignLines) {
    this.obj = obj;
    this.angleInfos = this.preparePaths();
    this.lastDiff = 100;
    this.turnIncrement = 0;
    this.curSpeed = this.obj.def.speed;
    this.stopsignCounter = 0;
    this.intersectionClearedCounter = 0;
    this.slowingCounter = 0;
    this.acceleratingCounter = 0;
    this.hitCounter = 0;
    this.pauseCounter = 0;
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
    this.storeProjectedMovementLine(sharedCarState, angle, trigX, trigY, !angleInfo.leftTurn);
    // sets up this.obj.lookaheadState - uses previous this.obj.angleState to know which bbpoly to use
    speedTarget = this.checkObstacles(sharedCarState, angleInfo) || speedTarget;
    // sets up this.obj.angleState 
    angleResult = this.calcAngle(sharedCarState, speedTarget);
    speedTarget = angleResult.speedTarget;
    angle = angleResult.angle;

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
	//consoleLog("car 10 speedtarget: " + speedTarget + ", lookahead state: " + this.obj.lookaheadState + ", " + "angleState: " + this.obj.angleState + ", deltaSpeed: " + deltaSpeed + ", curspeed: " + this.curSpeed);
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

MovementAI.prototype.checkObstacles = function(sharedCarState, angleInfo) {
    this.checkExitIntersection(sharedCarState);
    var lookaheadResult = this.doLookahead(sharedCarState, angleInfo);
    extraStateResult = this.prepareExtraState();
    if (extraStateResult === 'pause') {
	this.obj.lookaheadState = 'slowing'
	return .05;
    }

    if (lookaheadResult.found !== false) {
	var speedTarget = .0001;
	if (lookaheadResult.type == 'stopsign') {
	    var needsToWait = this.checkEnterIntersection(sharedCarState, lookaheadResult.intersectionId);
	    speedTarget = .05;
	}
	else if (lookaheadResult.type == 'static collision') {
	    this.obj.hit = true;
	    return 0
	}
	this.obj.lookaheadState = 'slowing';
	if (lookaheadResult.type == 'stopsign') {
	    this.stopsignCounter += 1;
	    this.checkFinishStopsign(speedTarget, needsToWait, lookaheadResult.intersectionId);
	}
	return speedTarget;	
    }
    else {
	this.obj.lookaheadState = 'moving';
    }
}

MovementAI.prototype.storeProjectedMovementLine = function(sharedCarState, angle, trigX, trigY, rightTurn) {
    if ((this.obj.angleState == 'turning') && rightTurn) {
	var forwardDistanceNormal = this._getLookaheadSpeed(sharedCarState, this.curSpeed)*25
    }
    else {
	var forwardDistanceNormal = this._getLookaheadSpeed(sharedCarState, this.curSpeed)*40
    }
    var forwardDistanceLong = this._getLookaheadSpeed(sharedCarState, this.curSpeed)*80
    this.lookaheadBBPoly = this.calculateLookahead(forwardDistanceNormal, 1.1, angle, trigX, trigY, true);
    this.longBBPoly = this.calculateLookahead(forwardDistanceLong, 2.5, angle, trigX, trigY, false);
    this.longAndWideBBPoly = this.calculateLookahead(forwardDistanceLong*1.5, 2.5, angle, trigX, trigY, false);
    var intersectAngle = -1*(90 - angle);
    var intersectTrigX = Math.cos(toRadians(intersectAngle))
    var intersectTrigY = Math.sin(toRadians(intersectAngle))
    this.bbPoly = BBFromSprite(this.obj.sprite);
    this.prepareDoors(sharedCarState, intersectTrigX, intersectTrigY);
    // draw the bbpolys for testing
    if (globalOptions.debugMode) {
	drawLinesFromBBPoly(this.obj.sprite, this.bbPoly, 0, 0xFF0000);
	drawLinesFromBBPoly(this.obj.sprite, this.lookaheadBBPoly, 1, 0xFFFF00);
	drawLinesFromBBPoly(this.obj.sprite, this.longBBPoly, 2, 0xFFFFFF);
    }
}

// take all this crap, return a bb
MovementAI.prototype.calculateLookahead = function(forwardDistance, extraWidth, angle, trigX, trigY, doLine) {
    var lookaheadX = trigX * forwardDistance;
    var lookaheadY = trigY * forwardDistance;
    var lookbehindX = trigX * 10;
    var lookbehindY = trigY * 10;
    if (doLine) {
	// movementline only used by stop sign collision test, could be replaced with bb
	this.movementLine = [[this.obj.sprite.position.x,this.obj.sprite.position.y],
			     [this.obj.sprite.position.x+lookaheadX,this.obj.sprite.position.y+lookaheadY]];
    }
    // create lookahead polygonpoints for real lookahead bbpoly
    var intersectAngle = -1*(90 - angle);
    var width = (this.obj.def.width || 8) // use twice the width
    var intersectTrigX = Math.cos(toRadians(intersectAngle))
    var intersectTrigY = Math.sin(toRadians(intersectAngle))
    var upperLeftX = extraWidth*width * intersectTrigX
    var upperLeftY = extraWidth*width * intersectTrigY

    var lowerLeftX = width * extraWidth * intersectTrigX+lookbehindX;
    var lowerLeftY = width * extraWidth * intersectTrigY+lookbehindY;

    var upperRightX = -upperLeftX;
    var upperRightY = -upperLeftY;

    var lowerRightX = -1 * width * extraWidth * intersectTrigX+lookbehindX;
    var lowerRightY = -1 * width * extraWidth * intersectTrigY+lookbehindY;

    return BBFromPoints([this.obj.sprite.position.x+lookaheadX, this.obj.sprite.position.y+lookaheadY], [
	[upperLeftX,upperLeftY],
	[lowerLeftX-(lookaheadX), lowerLeftY-(lookaheadY)], 
	[lowerRightX-(lookaheadX), lowerRightY-(lookaheadY)],
	[upperRightX, upperRightY],
	[upperLeftX, upperLeftY]
    ]);

}

// check, in this order: cars, bike, stopsigns (soon: stoplights, peds)
// for non intersection waiting, return false for intersectionId
MovementAI.prototype.doLookahead = function(sharedCarState, angleInfo) {
    var foundIntersectionId = false;
    // basically draw a projected movement line forward, and ask for the movement line from other objs
    // compare if the lines cross or not
    // return if conflict found, what type of conflict, and any additional info (like intersectionId)
    _.each(sharedCarState.intersections, function(intersectionPoly, intersectionId) {
	intersectionBBPolyCheck = this.bbPoly;
	if (this.curSpeed > 1.6) {
	    intersectionBBPolyCheck = this.longBBPoly;
	}
	else if (this.curSpeed > .1) {
	    intersectionBBPolyCheck = this.lookaheadBBPoly;
	}
	
	if (checkInIntersection(intersectionBBPolyCheck, intersectionPoly)) {
	    foundIntersectionId = intersectionId;
	    sharedCarState.carsInIntersection[this.obj.carId] = intersectionId;
	}
	else {
	    delete sharedCarState.carsInIntersection[this.obj.carId]
	}
    }, this);



    var found = false;
    var typeFound = false;
    _.each(sharedCarState.cars, function(carObj, carId) {
	if (found) {
	    return
	}
	if ((this.obj.carId != carObj.carId) && carObj.movementAI.bbPoly) {	  	    
	    var collisionLookahead = false;
	    if ((carObj.movementAI.curSpeed >= .3) && (this.obj.angleState == 'turning')) {
		var turningBBPoly = this.longBBPoly;
		if (angleInfo.leftTurn) {
		    // gotta make sure it's not a stop sign intersection
		    if (sharedCarState.stopSignQueues[foundIntersectionId] && sharedCarState.stopSignQueues[foundIntersectionId].length) {
			turningBBPoly = this.lookaheadBBPoly;
		    }
		    else {
			turningBBPoly = this.longAndWideBBPoly;
		    }
		}
		var collisionLookahead = checkCollision2(turningBBPoly, carObj.movementAI.lookaheadBBPoly);
		if (collisionLookahead) {
		    if (this.obj.carId === 90) {
			consoleLog("car " + this.obj.carId + " collision lookahead with car " + carObj.carId);
		    }
		}
	    }
	    var collisionNormal = checkCollision2(this.lookaheadBBPoly, carObj.movementAI.bbPoly);
	    if (collisionNormal) {
		    if ((this.obj.carId === 100) && (carObj.carId===9)) {
		consoleLog("car " + this.obj.carId + " collision normal with car " + carObj.carId);
			}
	    }

	    var collisionExtra = checkCollision2(this.lookaheadBBPoly, carObj.movementAI.lookaheadBBPoly);
	    if (collisionExtra) {
		    if (this.obj.carId === 90) {
			consoleLog("car " + this.obj.carId + " collision extra with car " + carObj.carId);
		    }
	    }

	    var collisionCrash = checkCollision2(this.bbPoly, carObj.movementAI.bbPoly);
	    if (collisionCrash) {
		this.obj.sequentialHitCounter += 1;
		    if (this.obj.carId === 90) {
			consoleLog("car " + this.obj.carId + " collision crash with car " + carObj.carId);
		    }
	    }

	    if (collisionCrash === true) {
		this.obj.hit = true;
	    }

	    if ((this.curSpeed >= .6) && (carObj.movementAI.curSpeed >= .6)) {
		var collision = (collisionExtra || collisionNormal);
	    }
	    if (((this.curSpeed >= .3) || ((this.obj.angleState == 'turning') && (angleInfo.leftTurn)))
		 && (!collision) && (carObj.movementAI.curSpeed >= .1)){
		var collision = (collisionLookahead || collisionNormal);
	    }
	    else if (!collision) {
		var collision = collisionNormal;
	    }
	    if (collision) {
		if (this.obj.carId === 100) {
		    console.log("car 10 found collision");
		    }

		found = carObj.carId;
		typeFound = 'car';
		return
	    }
	}
    }, this);

    if (found !== false) {
	return {found: found, intersectionId: foundIntersectionId, type: typeFound}
    }

    if (checkCollision2(this.lookaheadBBPoly, sharedCarState.theBike.sprite.bbPoly)) {
	//consoleLog("BIKE HIT!!!");
	found = -1;
	typeFound = 'bike';
	if (this.curSpeed > .1) {
	    sharedCarState.theBike.gotHonked();
	    this.obj.drawHonk();
	}
	return {found: found, intersectionId: foundIntersectionId, type: typeFound}
    }
    if (checkCollision2(this.bbPoly, sharedCarState.theBike.sprite.bbPoly)) {
	//consoleLog("BIKE HIT!!!");
	found = -1;
	typeFound = 'bike';
	sharedCarState.theBike.gotHit();
	return {found: found, intersectionId: foundIntersectionId, type: typeFound}
    }
        
    _.each(this.obj.stopSignLines, function(linedefs, intersectionId) {
	_.each(linedefs, function(linedef, idx) {
	    var line = linedef.points;
	    if (linedef.state === false) {
		return
	    }
	    if (isIntersect(line[0],line[1],this.movementLine[0],this.movementLine[1])) {
		found = idx;
		foundIntersectionId = intersectionId;
		typeFound = 'stopsign'
		return
	    }
	}, this);
	if (found !== false) {
	    return 
	}
    }, this);

    _.each(sharedCarState.trafficLightLines, function(trafficLights, intersectionId) {
	_.each(trafficLights, function(linedef, idx) {
	    var line = linedef.points;
	    if (linedef.state === 'green') {
		return
	    }
	    if (isIntersect(line[0],line[1],this.movementLine[0],this.movementLine[1])) {
		found = idx;
		foundIntersectionId = intersectionId;
		typeFound = 'trafficlight'
		return
	    }
	}, this);	       
    }, this);

    _.each(sharedCarState.staticCollisionObjects, function(staticObj, idx) {
	if (checkCollision2(this.bbPoly, staticObj.bbPoly)) {
	    this.obj.sequentialHitCounter += 1;
	    found = true;
	    typeFound = 'static collision';
	}

    }, this);

    return {found: found, intersectionId: foundIntersectionId, type: typeFound}
}

MovementAI.prototype.prepareExtraState = function(extraState) {
    var extraState = this.obj.coordPath[this.obj.coordPathIndex][2];
    if (extraState == 'pause') {
	var pauseLength = this.obj.coordPath[this.obj.coordPathIndex][3] || 1000;
	this.pauseCounter += 1;
	this.obj.extraState = 'pause';
	if (this.pauseCounter > pauseLength) {
	    this.pauseCounter = 0;
	    this.obj.extraState = 'normal'
	    this.obj.coordPath[this.obj.coordPathIndex].splice(2,2);
	    this.slowingCounter = 0;
	    if (this.obj.def.speed === 0) {
		this.obj.coordPathIndex += 1;
	    }
	}
	else {
	    return 'pause'
	}
    }
    if ((extraState == 'left door') || (extraState == 'right door')) {
	if (this.pauseCounter == 0) {
	    this.obj.changeDoor(extraState, true);
	}
	var pauseLength = this.obj.coordPath[this.obj.coordPathIndex][3] || 1000;
	this.pauseCounter += 1;
	if (this.pauseCounter > pauseLength) {
	    this.pauseCounter = 0;
	    this.obj.changeDoor(extraState, false);
	    this.obj.coordPath[this.obj.coordPathIndex].splice(2,2);
	    if (this.obj.def.speed === 0) {
		this.obj.coordPathIndex += 1;
	    }
	}
	else {
	    return 'pause'
	}
    }
}


MovementAI.prototype.checkEnterIntersection = function(sharedCarState, intersectionId) {
    if (intersectionId === false) {
	return true
    }
    if (this.stopsignCounter === 0 && (sharedCarState.carsAtStopsign[this.obj.carId] == undefined)) { // starting intersection dance - add car to intersection queue
	sharedCarState.stopSignQueues[intersectionId].push(this.obj.carId);
	sharedCarState.carsAtStopsign[this.obj.carId] = intersectionId;
    }
    var firstInQueue = sharedCarState.stopSignQueues[intersectionId][0];	
    return ((firstInQueue !== undefined) && (firstInQueue !== this.obj.carId));
    // currently returning true if no intersection (unimplemented) or if another car is there first
    // returns false if the current car is first in line
    // if needstowait is false and the stopsigncounter is high enough and curcar is slow enough
    // than we kill the stopsign
}

MovementAI.prototype.checkExitIntersection = function(sharedCarState) {
    // intersectionclearedcounter currently set as sideeffect of this.checkFinishStopsign
    if (this.intersectionClearedCounter > 1) {
	this.intersectionClearedCounter -= 1;
    }
    else if (this.intersectionClearedCounter == 1) {
	// notify shared state of intersection unblockage
	var curIntersection = sharedCarState.carsAtStopsign[this.obj.carId];
	sharedCarState.stopSignQueues[curIntersection].splice(0,1); // assumes the released car will always be first
	delete sharedCarState.carsAtStopsign[this.obj.carId]
	this.intersectionClearedCounter = 0;
    }
}

MovementAI.prototype.checkFinishStopsign = function(speedTarget, needsToWait, intersectionId) {
    // return value not currently in use but might be cleaner to use it soon instead of setting
    // intersectionClearedCounter here
    if ((this.stopsignCounter > 100) &&
	(this.curSpeed <= (speedTarget+.01)) &&
	(needsToWait !== true)) 
    { // time to move and notify shared state of intersection blockage
	this.stopsignCounter = 0; 
	this.deleteIntersectionStopsigns(intersectionId);
	this.obj.lookaheadState = 'moving'
	this.intersectionClearedCounter = Math.floor(200/this.obj.def.speed);
	return true
    }
    return false
}

// temporarily remove all stop signs, since they have a habit of triggering from the wrong side
// once the car has entered the intersection
MovementAI.prototype.deleteIntersectionStopsigns = function(intersectionId) {
    var numStopsigns = this.obj.stopSignLines[intersectionId].length;
    _.each(_.range(numStopsigns), function(idx) {
	this.obj.stopSignLines[intersectionId][idx].state = false;
    }, this);
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
	//consoleLog("deltax is " + deltaX + ", deltaY is " + deltaY);
	var angle = (toDegrees(Math.atan2(deltaY, deltaX))-360) % 360;
	//consoleLog("found angle " + angle);
	return angle;
    }
}

MovementAI.prototype._getLookaheadSpeed = function(sharedCarState, curSpeed) {
    //if (((sharedCarState.carsAtStopsign[this.obj.carId]) || (sharedCarState.carsAtTrafficLight[this.obj.carId])) &&
    //   this.curSpeed < .1) {
//	return .8
  //  }
    if (curSpeed > 1) {
	return curSpeed
    }
    return 1
}

MovementAI.prototype.prepareDoors = function(sharedCarState, intersectTrigX, intersectTrigY) {
    _.each(['left','right'], function(doorSide, idx) {
	door = this.obj.doors[doorSide].sprite;
	if (this.obj.doors[doorSide].open) {
	    globalPos = door.toGlobal(this.obj.sprite.parent);
	    lenDoor = this.obj.def.height/2;
	    deltaX = lenDoor*intersectTrigX;
	    deltaY = lenDoor*intersectTrigY;
	    var rotation = {'left':60, 'right':300}[doorSide]
	    var directionModifier = {'left':1, 'right':-1}[doorSide]
	    door.rotation=toRadians(rotation);
	    doorLine = [[globalPos.x, globalPos.y],
			[globalPos.x+deltaX*directionModifier, globalPos.y+deltaY*directionModifier]];
	    this.obj.doors[doorSide].doorLine = doorLine;
	    //console.log("doorline: " + doorLine);
	}
	else {
	    door.rotation=toRadians(0);
	}
	sharedCarState.doors[this.obj.carId] = this.obj.doors;
    }, this);
}
