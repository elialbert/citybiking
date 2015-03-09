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
    this.slowingCoefficient = -.004 * this.obj.def.speed;
    this.acceleratingCoefficient = .0005 * this.obj.def.speed;
}

MovementAI.prototype.calcMovement = function(sharedCarState) {
    var speedTarget = this.obj.def.speed;
    if (this.obj.hit) { // temporary - need to handle better, including clearing intersection if nec
	this.hitCounter += 1;
	if (this.hitCounter > 400) {
	    this.hitCounter = 0;
	    this.obj.hit = false;
	}
	else {
	    return {changeX: 0, changeY: 0, state: 'hit'}
	}
    };
    var angleInfo = this.angleInfos[this.obj.coordPathIndex];
    if (!angleInfo) {
	angleInfo = this.angleInfos[this.obj.coordPathIndex - 1];
	var angle = this.lastAngle || 0;
    }
    else {
	var angle = angleInfo.angle;
    }

    this.obj.state = this.checkDestination(angleInfo);
    if (this.obj.state == 'turning') {
	var angleChange = angleInfo.turnIncrement;
	if (this.obj.lastState == 'turning and slowing') {
	    if (this.curSpeed < .3) {
		angleChange = .005;
	    }
	    else {
		angleChange = angleChange/3;// / 1.5;
	    }
	}
	
	angle = (this.lastAngle || angle) + angleChange;
	this.lastAngle = angle;
	speedTarget = this.obj.def.speed / 2;
    }
    else if (this.obj.state == 'moving') {
	speedTarget = this.obj.def.speed;
    }
    var trigX = Math.cos(toRadians(angle));
    var trigY = Math.sin(toRadians(angle));
    this.storeProjectedMovementLine(sharedCarState, angle, trigX, trigY, this._getLookaheadSpeed(this.curSpeed)*40);
    speedTarget = this.checkObstacles(sharedCarState) || speedTarget;
    if ((this.obj.state == 'slowing') || (this.obj.state == 'turning and slowing')) {
	var deltaSpeed = this.slowingCoefficient*Math.sqrt(this.slowingCounter);
	this.slowingCounter += 1;
	if (this.obj.state == 'turning and slowing') {	  
	    deltaSpeed = deltaSpeed * 2;
	    speedTarget = speedTarget / 4;
	}
    }
    else if ((this.obj.state == 'moving') && (this.curSpeed < 1)) {
	var deltaSpeed = this.acceleratingCoefficient*Math.sqrt(this.acceleratingCounter);
	//consoleLog("accel ds " + deltaSpeed);
	this.acceleratingCounter += 1;
    }
    else if ((this.obj.state == 'moving') || (this.obj.state == 'turning')) {
	this.acceleratingCounter = 0;
	this.slowingCounter = 0;
	deltaSpeed = (speedTarget - this.curSpeed) / 6;
	//consoleLog("normal ds " + deltaSpeed);
    }

    this.curSpeed += deltaSpeed
    if (this.curSpeed<0) {
	this.curSpeed = 0.00001;
    }
    var changeX = trigX * this.curSpeed;
    var changeY = trigY * this.curSpeed;
    this.obj.lastState = this.obj.state;
    //consoleLog("changex is " + changeX + ", changeY is " + changeY);
    return {changeX: changeX, 
	    changeY: changeY, 
	    rotation: toRadians(angle-270), 
	    state: this.obj.state}
};

MovementAI.prototype.checkDestination = function(angleInfo) {
    // check if coord has been reached
    var nextCoords = this.obj.coordPath[this.obj.coordPathIndex+1];
    if (nextCoords) {
	//consoleLog("diffx: " + Math.abs(nextCoords[0] - this.obj.sprite.position.x) + ", diffy: " + Math.abs(nextCoords[1] - this.obj.sprite.position.y))
	var diffx = Math.abs(nextCoords[0] - this.obj.sprite.position.x);
	var diffy = Math.abs(nextCoords[1] - this.obj.sprite.position.y);
	var diff = diffx + diffy;
	if ((angleInfo.needsTurn && diff < 20*this.obj.def.speed) || (this.obj.state == 'turning') || (this.obj.state == 'turning and slowing')) {
	    this.lastDiff = diff;
	    if ((this.obj.state == 'turning') || (this.obj.state == 'turning and slowing')) {
		this.turnIncrement += 1; // helpful but could cause issues going forward
	    }
	    //console.log("angle achieved? " + this.lastAngle + ": " + angleInfo.nextAngle + "("+(Math.abs(this.lastAngle - angleInfo.nextAngle)%360)+")");	    
	    if ((Math.abs(this.lastAngle - angleInfo.nextAngle)%360) < 2) {
		this.nextPathCoord(true);
		return 'moving'
	    }
	    return 'turning'
	}	
	else if ((diff > this.lastDiff) && (diff < this.obj.def.speed*2)) {
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

MovementAI.prototype.checkObstacles = function(sharedCarState) {
    this.checkExitIntersection(sharedCarState);
    var lookaheadResult = this.doLookahead(sharedCarState);

    extraStateResult = this.prepareExtraState();
    if (extraStateResult === 'pause') {
	this.obj.state = 'slowing'
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
	    consoleLog("found static collision");
	    return 0
	}
	if (this.obj.state === 'turning') {
	    this.obj.state = 'turning and slowing';
	}
	// should do something here with cardefs when this.obj.state == trafficlight around propensity to stop on yellow
	else {
	    this.obj.state = 'slowing';
	}
	if (lookaheadResult.type == 'stopsign') {
	    this.stopsignCounter += 1;
	    this.checkFinishStopsign(speedTarget, needsToWait, lookaheadResult.intersectionId);
	}
	return speedTarget;	
    }
}

MovementAI.prototype.storeProjectedMovementLine = function(sharedCarState, angle, trigX, trigY, forwardDistance) {
    var lookaheadX = trigX * forwardDistance;
    var lookaheadY = trigY * forwardDistance;
    var lookbehindX = trigX * 10;
    var lookbehindY = trigY * 10;
    // movementline only used by stop sign collision test, could be replaced with bb
    this.movementLine = [[this.obj.sprite.position.x,this.obj.sprite.position.y],
		      [this.obj.sprite.position.x+lookaheadX,this.obj.sprite.position.y+lookaheadY]];

    // create lookahead polygonpoints for real lookahead bbpoly
    var intersectAngle = -1*(90 - angle);
    var width = (this.obj.def.width || 8) // use twice the width

    var extraWidth = 1.1
    if (this.obj.state == 'turning') {
	extraWidth = 2.5;
    }

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

    this.lookaheadBBPoly = BBFromPoints([this.obj.sprite.position.x+lookaheadX, this.obj.sprite.position.y+lookaheadY], [
	[upperLeftX,upperLeftY],
	[lowerLeftX-(lookaheadX), lowerLeftY-(lookaheadY)], 
	[lowerRightX-(lookaheadX), lowerRightY-(lookaheadY)],
	[upperRightX, upperRightY],
	[upperLeftX, upperLeftY]
    ]);

    this.prepareDoors(sharedCarState, intersectTrigX, intersectTrigY);

    this.bbPoly = BBFromSprite(this.obj.sprite);
    // draw the bbpolys for testing
    if (globalOptions.debugMode) {
	drawLinesFromBBPoly(this.obj.sprite, this.bbPoly, 0, 0xFF0000);
	drawLinesFromBBPoly(this.obj.sprite, this.lookaheadBBPoly, 1, 0xFFFF00);
    }
}

// check, in this order: cars, bike, stopsigns (soon: stoplights, peds)
// for non intersection waiting, return false for intersectionId
MovementAI.prototype.doLookahead = function(sharedCarState) {
    // basically draw a projected movement line forward, and ask for the movement line from other objs
    // compare if the lines cross or not
    // return if conflict found, what type of conflict, and any additional info (like intersectionId)
    var found = false;
    var typeFound = false;
    var foundIntersectionId = false;

    _.each(sharedCarState.cars, function(carObj, carId) {
	if ((this.obj.carId != carObj.carId) && carObj.movementAI.bbPoly) {	  	    
	    var collisionLookahead = checkCollision2(this.lookaheadBBPoly, carObj.movementAI.lookaheadBBPoly);
	    var collisionNormal = checkCollision2(this.lookaheadBBPoly, carObj.movementAI.bbPoly);
	    var collisionCrash = checkCollision2(this.bbPoly, carObj.movementAI.bbPoly);
	    if (collisionCrash === true) {
		this.obj.hit = true;
	    }
	    if (this.curSpeed >= 1) {
		var collision = (collisionLookahead || collisionNormal);
	    }
	    else {
		var collision = collisionNormal;
	    }
	    if (collision) {
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
    
    _.each(sharedCarState.intersections, function(intersectionPoly, intersectionId) {
	if (checkInIntersection(this.bbPoly, intersectionPoly)) {
	    foundIntersectionId = intersectionId;
	}
    }, this);
    if (foundIntersectionId !== false) {
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
	if (this.pauseCounter > pauseLength) {
	    this.pauseCounter = 0;
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
    if (this.stopsignCounter === 0 && (sharedCarState.carsInIntersection[this.obj.carId] == undefined)) { // starting intersection dance - add car to intersection queue
	consoleLog("adding car " + this.obj.carId + " to queue for " + intersectionId); 
	sharedCarState.stopSignQueues[intersectionId].push(this.obj.carId);
	sharedCarState.carsInIntersection[this.obj.carId] = intersectionId;
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
	var curIntersection = sharedCarState.carsInIntersection[this.obj.carId];
	consoleLog("finished countdown to remove car " + this.obj.carId + " from queue for " + curIntersection); 
	sharedCarState.stopSignQueues[curIntersection].splice(0,1); // assumes the released car will always be first
	delete sharedCarState.carsInIntersection[this.obj.carId]
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
	consoleLog("killing stopsigns at intersection " + intersectionId + " for car " + this.obj.carId);
	this.deleteIntersectionStopsigns(intersectionId);
	this.obj.state = 'moving'
	this.intersectionClearedCounter = Math.floor(200/this.obj.def.speed);
	consoleLog("starting countdown to remove car " + this.obj.carId + " from intersection stopsign queue");
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
	    //consoleLog("ad: " + angleDiff + "adn: " + angleDiffNew);
	    if (angleDiff > 5) {
		info.needsTurn = true;
		info.turnIncrement = 1.6;//4 / (this.obj.def.speed + 1);
		if ((angleList[idx+1] < angle) || counterclockwise) {
		    info.turnIncrement = -1*info.turnIncrement;
		} // possible counterclockwise should just negate whatevers above?
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

MovementAI.prototype._getLookaheadSpeed = function(curSpeed) {
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
