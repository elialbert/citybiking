function MovementAI(obj, stopSignLines) {
    this.obj = obj;
    //this.stopSignLines = stopSignLines;
    this.angleInfos = this.preparePaths();
    this.lastDiff = 100;
    this.turnIncrement = 0;
    this.curSpeed = this.obj.def.speed;
    this.stopsignCounter = 0;
    this.intersectionClearedCounter = 0;
}

MovementAI.prototype.calcMovement = function(sharedCarState) {
    var speedTarget = this.obj.def.speed;
    if (this.obj.hit) { // temporary
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
	//var speed = this.obj.def.speed;
	speedTarget = this.obj.def.speed;
    }
    var trigX = Math.cos(toRadians(angle));
    var trigY = Math.sin(toRadians(angle));
    speedTarget = this.checkObstacles(trigX, trigY, sharedCarState) || speedTarget;

    //console.log("cur speed is " + this.curSpeed + ", speedtarget is " + speedTarget);
    deltaSpeed = (speedTarget - this.curSpeed) / 6;
    //console.log("deltaspeed is " + deltaSpeed);
    this.curSpeed += deltaSpeed
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

MovementAI.prototype.checkObstacles = function(trigX, trigY, sharedCarState) {
    var checkResult = this.checkNeedsToWait(sharedCarState, trigX, trigY);
    var lookaheadResult = checkResult.lookaheadResult;
    var curIntersection = sharedCarState.carsInIntersection[this.obj.carId];


    if (this.intersectionClearedCounter > 1) {
	this.intersectionClearedCounter -= 1;
    }
    else if ((this.intersectionClearedCounter <= 1) && (this.intersectionClearedCounter > 0)) {
	// notify shared state of intersection unblockage
	console.log("finished countdown to remove car " + this.obj.carId + " from queue for " + curIntersection); 
	sharedCarState.stopSignQueues[curIntersection].splice(0,1); // assumes the released car will always be first
	delete sharedCarState.carsInIntersection[this.obj.carId]
	this.intersectionClearedCounter = 0;
    }
    if (lookaheadResult.found !== false) {
	if (this.stopsignCounter === 0 && !sharedCarState.carsInIntersection[this.obj.carId]) { // starting intersection dance - add car to intersection queue
	    console.log("adding car " + this.obj.carId + " to queue for " + lookaheadResult.intersectionId + " (stopsign): " + lookaheadResult.found);
	    sharedCarState.stopSignQueues[lookaheadResult.intersectionId].push(this.obj.carId);
	    sharedCarState.carsInIntersection[this.obj.carId] = lookaheadResult.intersectionId;
	}
	this.obj.state = 'slowing';
	var speedTarget = .05;
	this.stopsignCounter += 1;
	if ((this.stopsignCounter > 100) &&
	    (this.curSpeed <= (speedTarget+.01)) &&
	    (checkResult.needsToWait !== true)) { // time to move and notify shared state of intersection blockage
	    this.stopsignCounter = 0; 
	    this.deleteIntersectionStopsigns(lookaheadResult.intersectionId);
	    console.log("killing stopsigns at intersection " + lookaheadResult.intersectionId + " for car " + this.obj.carId);
	    this.obj.state = 'moving'
	    this.intersectionClearedCounter = 200/this.obj.def.speed;
	    console.log("starting countdown to remove car " + this.obj.carId + " from intersection stopsign queue");
	}
	return speedTarget;	
    }

}

MovementAI.prototype.checkNeedsToWait = function(sharedCarState, trigX, trigY) {
    var lookaheadResult = this.doLookahead(trigX, trigY);
    //console.log("lookaheadresult found is " + lookaheadResult.found + " and obj state is " + this.obj.state);
    if (lookaheadResult.found !== false) {
	var firstInQueue = sharedCarState.stopSignQueues[lookaheadResult.intersectionId][0];	
	var needsToWait = ((firstInQueue !== undefined) && (firstInQueue !== this.obj.carId));
    }
    else {
	needsToWait = false;
    }
    return {lookaheadResult: lookaheadResult, needsToWait: needsToWait}
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

// right now just stop signs. soon to add lights, cars, peds, bikes. whew.
MovementAI.prototype.doLookahead = function(trigX, trigY) {
    var lookaheadX = trigX * 40;
    var lookaheadY = trigY * 40;
    var found = false;
    var foundIntersectionId = false;
    testPoints = [[this.obj.sprite.position.x,this.obj.sprite.position.y],
		  [this.obj.sprite.position.x+lookaheadX,this.obj.sprite.position.y+lookaheadY]];
    _.each(this.obj.stopSignLines, function(linedefs, intersectionId) {
	_.each(linedefs, function(line, idx) {
	    if (isIntersect(line[0],line[1],testPoints[0],testPoints[1])) {
		found = idx;
		foundIntersectionId = intersectionId;
		return
	    }
	});
	if (found !== false) {
	    return 
	}
    });
    return {found: found, intersectionId: foundIntersectionId}
}

// temporarily remove all stop signs, since they have a habit of triggering from the wrong side
// once the car has entered the intersection
MovementAI.prototype.deleteIntersectionStopsigns = function(intersectionId) {
    var numStopsigns = this.obj.stopSignLines[intersectionId].length;
    _.each(_.range(numStopsigns), function(idx) {
	this.obj.stopSignLines[intersectionId][idx] = [[-5000,-5000],[-5000,-5000]]; // remove stop signs for intersection for this car. maintain indices.
    }, this);
}
