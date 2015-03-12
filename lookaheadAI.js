function LookaheadAI(obj, movementAI) {
    this.obj = obj;
    this.movementAI = movementAI;
    this.stopsignCounter = 0;
    this.intersectionClearedCounter = 0;
    this.pauseCounter = 0;
}

LookaheadAI.prototype.checkObstacles = function(sharedCarState, angleInfo) {
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

LookaheadAI.prototype.storeProjectedMovementLine = function(sharedCarState, angle, trigX, trigY, rightTurn) {
    if ((this.obj.angleState == 'turning') && rightTurn) {
	var forwardDistanceNormal = this._getLookaheadSpeed(sharedCarState, this.movementAI.curSpeed)*25
    }
    else {
	var forwardDistanceNormal = this._getLookaheadSpeed(sharedCarState, this.movementAI.curSpeed)*40
    }
    var forwardDistanceLong = this._getLookaheadSpeed(sharedCarState, this.movementAI.curSpeed)*80
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
LookaheadAI.prototype.calculateLookahead = function(forwardDistance, extraWidth, angle, trigX, trigY, doLine) {
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
LookaheadAI.prototype.doLookahead = function(sharedCarState, angleInfo) {
    if (this.obj.carId === 1){
	console.log("curspeed is " + this.movementAI.curSpeed);
    }

    var foundIntersectionId = false;
    // basically draw a projected movement line forward, and ask for the movement line from other objs
    // compare if the lines cross or not
    // return if conflict found, what type of conflict, and any additional info (like intersectionId)
    _.each(sharedCarState.intersections, function(intersectionPoly, intersectionId) {
	intersectionBBPolyCheck = this.bbPoly;
	if (this.movementAI.curSpeed > 1.6) {
	    intersectionBBPolyCheck = this.longBBPoly;
	}
	else if (this.movementAI.curSpeed > .1) {
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

	    if ((this.movementAI.curSpeed >= .6) && (carObj.movementAI.curSpeed >= .6)) {
		var collision = (collisionExtra || collisionNormal);
	    }
	    if (((this.movementAI.curSpeed >= .3) || ((this.obj.angleState == 'turning') && (angleInfo.leftTurn)))
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
	if (this.movementAI.curSpeed > .1) {
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

LookaheadAI.prototype.prepareExtraState = function(extraState) {
    var extraState = this.obj.coordPath[this.obj.coordPathIndex][2];
    if (extraState == 'pause') {
	var pauseLength = this.obj.coordPath[this.obj.coordPathIndex][3] || 1000;
	this.pauseCounter += 1;
	this.obj.extraState = 'pause';
	if (this.pauseCounter > pauseLength) {
	    this.pauseCounter = 0;
	    this.obj.extraState = 'normal'
	    this.obj.coordPath[this.obj.coordPathIndex].splice(2,2);
	    this.movementAI.slowingCounter = 0;
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


LookaheadAI.prototype.checkEnterIntersection = function(sharedCarState, intersectionId) {
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

LookaheadAI.prototype.checkExitIntersection = function(sharedCarState) {
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

LookaheadAI.prototype.checkFinishStopsign = function(speedTarget, needsToWait, intersectionId) {
    // return value not currently in use but might be cleaner to use it soon instead of setting
    // intersectionClearedCounter here
    if ((this.stopsignCounter > 100) &&
	(this.movementAI.curSpeed <= (speedTarget+.01)) &&
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
LookaheadAI.prototype.deleteIntersectionStopsigns = function(intersectionId) {
    var numStopsigns = this.obj.stopSignLines[intersectionId].length;
    _.each(_.range(numStopsigns), function(idx) {
	this.obj.stopSignLines[intersectionId][idx].state = false;
    }, this);
}


LookaheadAI.prototype._getLookaheadSpeed = function(sharedCarState, curSpeed) {
    if (curSpeed > 1) {
	return curSpeed
    }
    return 1
}

LookaheadAI.prototype.prepareDoors = function(sharedCarState, intersectTrigX, intersectTrigY) {
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
