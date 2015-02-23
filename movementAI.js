function MovementAI(obj, stopSignLines) {
    this.obj = obj;
    this.stopSignLines = stopSignLines;
    this.angleInfos = this.preparePaths();
    this.lastDiff = 100;
    this.turnIncrement = 0;
    this.curSpeed = this.obj.def.speed;
    this.stopsignCounter = 0;
}

MovementAI.prototype.calcMovement = function() {
    var speedTarget = this.obj.def.speed;
    var speed = this.curSpeed;
    var state = this.state;
    if (this.obj.hit) { // temporary
	return
    };
    var angleInfo = this.angleInfos[this.obj.coordPathIndex];
    if (!angleInfo) {
	angleInfo = this.angleInfos[this.obj.coordPathIndex - 1];
    }
    var angle = angleInfo.angle;
    state = this.checkDestination(angleInfo);
    this.obj.state = state;
    if (this.obj.state == 'turning') {
	angle = angle + this.turnIncrement*angleInfo.turnIncrement;
	//console.log("new angle is " + angle + ", turnincrment is " + this.turnIncrement);
	//var speed = this.obj.def.speed / 2;
	speedTarget = this.obj.def.speed / 2;
    }
    else if (this.obj.state == 'moving') {
	//var speed = this.obj.def.speed;
	speedTarget = this.obj.def.speed;
    }
    var trigX = Math.cos(toRadians(angle));
    var trigY = Math.sin(toRadians(angle));

    if ((this.obj.state == 'moving' || this.obj.state == 'slowing') && (this.stopsignCounter < 100)) {
	var lookaheadResult = this.doLookahead(trigX, trigY);
	if (lookaheadResult != null && lookaheadResult != false) {
	    var speedTarget = .05;
	    this.stopsignCounter += 1;
	    //console.log("this stopsigncounter is " + this.stopsignCounter + " and " + speed);
	    if ((this.stopsignCounter > 100) && (this.curSpeed <= speedTarget)) {
		//this.stopsignCounter = 0;
		this.obj.state = 'moving'
	    }
	}
    }

    //console.log("cur speed is " + this.curSpeed + ", speedtarget is " + speedTarget);
    deltaSpeed = (speedTarget - this.curSpeed) / 6;
    //console.log("deltaspeed is " + deltaSpeed);
    speed = this.curSpeed + deltaSpeed
    //console.log("final speed is " + speed);
    this.curSpeed = speed;
    var changeX = trigX * speed;
    var changeY = trigY * speed;
    //console.log("changex is " + changeX + ", changeY is " + changeY);
    this.obj.sprite.position.x += changeX;
    this.obj.sprite.position.y += changeY;
    this.obj.sprite.rotation = toRadians(angle-270);

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
    testPoints = [[this.obj.sprite.position.x,this.obj.sprite.position.y],
		  [this.obj.sprite.position.x+lookaheadX,this.obj.sprite.position.y+lookaheadY]];
    _.each(this.stopSignLines, function(line, idx) {
	if (isIntersect(line[0],line[1],testPoints[0],testPoints[1])) {
	    found = idx;
	    return
	}
    });
    if (found != false) {
	return found
    }
    return false
}
