function MovementAI(obj, stopSignLines) {
    this.obj = obj;
    //this.stopSignLines = stopSignLines;
    this.angleInfos = this.preparePaths();
    this.lastDiff = 100;
    this.turnIncrement = 0;
    this.curSpeed = this.obj.def.speed;
    this.stopsignCounter = 0;
    this.intersectionClearedCounter = 0;
    this.slowingCounter = 0;
    this.acceleratingCounter = 0;
    this.slowingCoefficient = -.004 * this.obj.def.speed;
    this.acceleratingCoefficient = .0025 * this.obj.def.speed;
}

MovementAI.prototype.calcMovement = function(sharedCarState) {
    var speedTarget = this.obj.def.speed;
    if (this.obj.hit) { // temporary - need to handle better, including clearing intersection if nec
	return {changeX: 0, changeY: 0, state: 'hit'}
    };
    var angleInfo = this.angleInfos[this.obj.coordPathIndex];
    if (!angleInfo) {
	angleInfo = this.angleInfos[this.obj.coordPathIndex - 1];
    }
    var angle = angleInfo.angle;
    this.obj.state = this.checkDestination(angleInfo);
    if (this.obj.state == 'turning') {
	angle = angle + this.turnIncrement*angleInfo.turnIncrement;
	//console.log("new angle is " + angle + ", turnincrment is " + this.turnIncrement);
	speedTarget = this.obj.def.speed / 2;
    }
    else if (this.obj.state == 'moving') {
	speedTarget = this.obj.def.speed;
    }
    var trigX = Math.cos(toRadians(angle));
    var trigY = Math.sin(toRadians(angle));
    this.storeProjectedMovementLine(angle, trigX, trigY, this.obj.def.speed*40); // this value is tricky. was formerly hardcoded to 40. but should be based on speed I think.
    speedTarget = this.checkObstacles(sharedCarState) || speedTarget;

    if (this.obj.state == 'slowing') {
	var deltaSpeed = this.slowingCoefficient*Math.sqrt(this.slowingCounter);
	//console.log("slow ds " + deltaSpeed + " for slowingcounter " + this.slowingCounter);
	this.slowingCounter += 1;
    }
    else if ((this.obj.state == 'moving') && (this.curSpeed < 1)) {
	var deltaSpeed = this.acceleratingCoefficient*Math.sqrt(this.acceleratingCounter);
	//console.log("accel ds " + deltaSpeed);
	this.acceleratingCounter += 1;
    }
    else if ((this.obj.state == 'moving') || (this.obj.state == 'turning')) {
	this.acceleratingCounter = 0;
	this.slowingCounter = 0;
	deltaSpeed = (speedTarget - this.curSpeed) / 6;
	//console.log("normal ds " + deltaSpeed);
    }

    //console.log("cur speed is " + this.curSpeed + ", speedtarget is " + speedTarget + ", deltaspeed is " + deltaSpeed);
    //console.log("deltaspeed is " + deltaSpeed);
    this.curSpeed += deltaSpeed
    if (this.curSpeed<0) {
	this.curSpeed = 0.00001;
    }
    var changeX = trigX * this.curSpeed;
    var changeY = trigY * this.curSpeed;
    //console.log("changex is " + changeX + ", changeY is " + changeY);
    return {changeX: changeX, 
	    changeY: changeY, 
	    rotation: toRadians(angle-270), 
	    state: this.obj.state}
};

MovementAI.prototype.checkDestination = function(angleInfo) {
    // check if coord has been reached
    var nextCoords = this.obj.coordPath[this.obj.coordPathIndex+1];
    if (nextCoords) {
	// console.log("diffx: " + Math.abs(nextCoords[0] - this.obj.sprite.position.x) + ", diffy: " + Math.abs(nextCoords[1] - this.obj.sprite.position.y))
	var diffx = Math.abs(nextCoords[0] - this.obj.sprite.position.x);
	var diffy = Math.abs(nextCoords[1] - this.obj.sprite.position.y);
	var diff = diffx + diffy;
	if ((angleInfo.needsTurn && diff < 25 || this.obj.state == 'turning')) {
	    this.lastDiff = diff;
	    this.turnIncrement += 1;
	    if (this.turnIncrement > angleInfo.numIncrements) {
		this.obj.coordPathIndex += 1;
		this.lastDiff = 100;
		this.turnIncrement = 0;
		this.redoPath(this.obj.coordPathIndex, 
			      [this.obj.sprite.position.x,this.obj.sprite.position.y], 
			      this.obj.coordPath[this.obj.coordPathIndex+1]);
		return 'moving'
	    }
	    return 'turning'
	}	
	else if ((diff > this.lastDiff) && (diff < 2)) {
	    this.obj.coordPathIndex += 1;
	    this.lastDiff = 100;
	    this.obj.sprite.position.x = nextCoords[0];
	    this.obj.sprite.position.y = nextCoords[1];
	    this.turnIncrement = 0;
	}
	else {
	    this.lastDiff = diff;
	}
    }
    return 'moving'
}

MovementAI.prototype.checkObstacles = function(sharedCarState) {
    this.checkExitIntersection(sharedCarState);
    var lookaheadResult = this.doLookahead(sharedCarState);
    if (lookaheadResult.found !== false) {
	var speedTarget = .0001;
	if (lookaheadResult.type == 'stopsign') {
	    var needsToWait = this.checkEnterIntersection(sharedCarState, lookaheadResult.intersectionId);
	    speedTarget = .05;
	}
	this.obj.state = 'slowing';
	if (lookaheadResult.type == 'stopsign') {
	    this.stopsignCounter += 1;
	    this.checkFinishStopsign(speedTarget, needsToWait, lookaheadResult.intersectionId);
	}
	return speedTarget;	
    }
}

MovementAI.prototype.storeProjectedMovementLine = function(angle, trigX, trigY, forwardDistance) {
    var lookaheadX = trigX * forwardDistance;
    var lookaheadY = trigY * forwardDistance;
    this.movementLine = [[this.obj.sprite.position.x,this.obj.sprite.position.y],
		      [this.obj.sprite.position.x+lookaheadX,this.obj.sprite.position.y+lookaheadY]];

    // attempt to create lookahead polygonpoints for real lookahead bbpoly
    var intersectAngle = 90 - angle;
    var width = (this.obj.def.width || 8) / 2
    var upperLeftX = width * Math.cos(toRadians(intersectAngle))
    var upperLeftY = width * Math.sin(toRadians(intersectAngle))

    var lowerLeftX = upperLeftX;//width * Math.cos(toRadians(intersectAngle))
    var lowerLeftY = upperLeftY;//width * Math.sin(toRadians(intersectAngle))

    var upperRightX = -upperLeftX;
    var upperRightY = -upperLeftY;

    var lowerRightX = upperRightX;
    var lowerRightY = upperRightY;

    this.lookaheadBBPoly = BBFromPoints([this.obj.sprite.position.x+lookaheadX, this.obj.sprite.position.y+lookaheadY], [
	[upperLeftX,upperLeftY],
	[lowerLeftX-lookaheadX, lowerLeftY-lookaheadY],
	[lowerRightX-lookaheadX, lowerRightY-lookaheadY],
	[upperRightX, upperRightY],
	[upperLeftX, upperLeftY]
    ]);

    this.bbPoly = BBFromSprite(this.obj.sprite);
 
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
    //var satVector = getLineBB(this.movementLine);// new SAT.Vector(this.movementLine[0], this.movementLine[1]);
    //var lookahead
    _.each(sharedCarState.cars, function(carObj, carId) {
	if ((this.obj.carId != carObj.carId) && carObj.movementAI.bbPoly) {	    
	    var collision = checkCollision2(this.lookaheadBBPoly, carObj.movementAI.bbPoly);
	    if (collision) {
		console.log("CAR HIT!!!");
		found = carObj.carId;
		typeFound = 'car';
		return
	    }
	}
    }, this);

    if (found !== false) {
	return {found: found, intersectionId: foundIntersectionId, type: typeFound}
    }

    if (checkCollision2(this.lookaheadBBPoly, sharedCarState.theBike.bbPoly)) {
	//console.log("BIKE HIT!!!");
	found = -1;
	typeFound = 'bike';
	return {found: found, intersectionId: foundIntersectionId, type: typeFound}
    }

    _.each(this.obj.stopSignLines, function(linedefs, intersectionId) {
	_.each(linedefs, function(line, idx) {
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
    return {found: found, intersectionId: foundIntersectionId, type: typeFound}
}


MovementAI.prototype.checkEnterIntersection = function(sharedCarState, intersectionId) {
    if (intersectionId === false) {
	return true
    }
    if (this.stopsignCounter === 0 && (sharedCarState.carsInIntersection[this.obj.carId] == undefined)) { // starting intersection dance - add car to intersection queue
	console.log("adding car " + this.obj.carId + " to queue for " + intersectionId); 
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
	console.log("finished countdown to remove car " + this.obj.carId + " from queue for " + curIntersection); 
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
	console.log("killing stopsigns at intersection " + intersectionId + " for car " + this.obj.carId);
	this.deleteIntersectionStopsigns(intersectionId);
	this.obj.state = 'moving'
	this.intersectionClearedCounter = Math.floor(200/this.obj.def.speed);
	console.log("starting countdown to remove car " + this.obj.carId + " from intersection stopsign queue");
	return true
    }
    return false
}

// temporarily remove all stop signs, since they have a habit of triggering from the wrong side
// once the car has entered the intersection
MovementAI.prototype.deleteIntersectionStopsigns = function(intersectionId) {
    var numStopsigns = this.obj.stopSignLines[intersectionId].length;
    _.each(_.range(numStopsigns), function(idx) {
	this.obj.stopSignLines[intersectionId][idx] = [[-5000,-5000],[-5000,-5000]]; // remove stop signs for intersection for this car. maintain indices.
    }, this);
}

MovementAI.prototype.redoPath = function(idx, curCoords, nextCoords) {
    //console.log("in redopath with curcoords " + curCoords + " and nextcoords " + nextCoords);
    var angle = this.doPath(curCoords, nextCoords);
    //console.log("new angle for idx " + idx + " is " + angle);
    this.angleInfos[idx].angle = angle; 
}

MovementAI.prototype.preparePaths = function() {
    var angleList = [];
    var coordPath = this.obj.coordPath;
    _.each(coordPath, function(coords, idx) {
	var next = coordPath[idx+1];
	var angle = this.doPath(coords, next)
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
	    //console.log("ad: " + angleDiff + "adn: " + angleDiffNew);
	    if (angleDiff > 5) {
		info.needsTurn = true;
		info.turnIncrement = 2;
		if ((angleList[idx+1] < angle) || counterclockwise) {
		    info.turnIncrement = -1*info.turnIncrement;
		} // possible counterclockwise should just negate whatevers above?
		info.numIncrements = Math.abs(angleDiff / info.turnIncrement);
		info.nextAngle = angleList[idx+1];
	    }
	}
	angleInfo.push(info);
    });
    // console.dir(angleInfo);
    return angleInfo
}

MovementAI.prototype.doPath = function(coords, next) {
    if (next != null) {
	var deltaX = next[0]-coords[0];
	var deltaY = next[1]-coords[1];
	//console.log("deltax is " + deltaX + ", deltaY is " + deltaY);
	var angle = (toDegrees(Math.atan2(deltaY, deltaX))-360) % 360;
	//console.log("found angle " + angle);
	return angle;
    }
}

