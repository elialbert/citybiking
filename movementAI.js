function MovementAI(obj, stopSignLines) {
    this.lookaheadAI = new LookaheadAI(obj, this);
    this.pathingAI = new PathingAI(obj, this);
    this.obj = obj;
    this.lastDiff = 100;
    this.turnIncrement = 0;
    this.curSpeed = this.obj.def.speed;
    this.slowingCounter = 0;
    this.acceleratingCounter = 0;
    this.hitCounter = 0;
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
    var angle = this.pathingAI.lastAngle;
    var trigX = Math.cos(toRadians(angle));
    var trigY = Math.sin(toRadians(angle));

    var angleInfo = this.pathingAI.angleInfos[this.obj.coordPathIndex];
    if (!angleInfo) {
	angleInfo = this.pathingAI.angleInfos[this.obj.coordPathIndex - 1];
    }
    // sets up bbpolys
    this.lookaheadAI.storeProjectedMovementLine(sharedCarState, angle, trigX, trigY, !angleInfo.leftTurn);
    // sets up this.obj.lookaheadState - uses previous this.obj.angleState to know which bbpoly to use
    speedTarget = this.lookaheadAI.checkObstacles(sharedCarState, angleInfo) || speedTarget;
    // sets up this.obj.angleState 
    angleResult = this.pathingAI.calcAngle(sharedCarState, speedTarget);
    speedTarget = angleResult.speedTarget;
    var deltaSpeed = this.calcDeltaSpeed(speedTarget);
    //if (this.obj.carId === 1) {
    //	console.log("car 1 speedtarget: " + speedTarget + ", lookahead state: " + this.obj.lookaheadState + ", " + "angleState: " + this.obj.angleState + ", deltaSpeed: " + deltaSpeed + ", curspeed: " + this.curSpeed);
    //  }
    return this.doMovement(deltaSpeed, angle, trigX, trigY);
}

MovementAI.prototype.doMovement = function(deltaSpeed, angle, trigX, trigY) {
    this.curSpeed += deltaSpeed
    if (this.curSpeed<0) {
	this.curSpeed = 0.00001;
    }
    var changeX = trigX * this.curSpeed;
    var changeY = trigY * this.curSpeed;

    //consoleLog("changex is " + changeX + ", changeY is " + changeY);
    return {changeX: changeX, 
	    changeY: changeY, 
	    rotation: toRadians(angleResult.angle-270), 
	    lookaheadState: this.obj.lookaheadState,
	    state: this.obj.state}
};

MovementAI.prototype.calcDeltaSpeed = function(speedTarget) {
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
	var deltaSpeed = (speedTarget - this.curSpeed) / 6;
    }
    return deltaSpeed
}
