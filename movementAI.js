function MovementAI(obj) {
    this.obj = obj;
    this.angleInfos = this.preparePaths();
    this.lastDiff = 100;
    this.turnIncrement = 0;
}

MovementAI.prototype.calcMovement = function() {
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
    if (state == 'turning') {
	angle = angle + this.turnIncrement*angleInfo.turnIncrement;
	//console.log("new angle is " + angle + ", turnincrment is " + this.turnIncrement);
	var speed = this.obj.def.speed / 2;
    }
    else if (state == 'moving') {
	var speed = this.obj.def.speed;
    }
    var changeX = Math.cos(toRadians(angle)) * speed;
    var changeY = Math.sin(toRadians(angle)) * speed;
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
	if (angle) {
	    angleList.push(angle);
	}
    }, this);
    var angleInfo = [];
    var speed = this.obj.def.speed;
    _.each(angleList, function(angle, idx) {
	info = {angle: angle, needsTurn: false}
	if (angleList[idx+1]) {
	    var counterclockwise = false;
	    angleDiff = Math.abs(angleList[idx+1] - angle);
	    angleDiffNew = Math.min(angleDiff, 360-angleDiff);
	    if (angleDiffNew < angleDiff) {
		angleDiff = angleDiffNew;
		counterclockwise = true;
	    }
	    console.log("ad: " + angleDiff + "adn: " + angleDiffNew);
	    if (angleDiff > 5) {
		info.needsTurn = true;
		info.turnIncrement = 2;
		if ((angleList[idx+1] < angle) || counterclockwise) {
		    info.turnIncrement = -1*info.turnIncrement;
		}
		info.numIncrements = Math.abs(angleDiff / info.turnIncrement);
		info.nextAngle = angleList[idx+1];
	    }
	}
	angleInfo.push(info);
    });
    console.dir(angleInfo);
    return angleInfo
}

MovementAI.prototype.doPath = function(coords, next) {
    if (next) {
	var deltaX = next[0]-coords[0];
	var deltaY = next[1]-coords[1];
	//console.log("deltax is " + deltaX + ", deltaY is " + deltaY);
	var angle = (toDegrees(Math.atan2(deltaY, deltaX))-360) % 360;
	//console.log("found angle " + angle);
	return angle;
    }
}
