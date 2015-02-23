function MovementAI(obj) {
    this.obj = obj;
    this.angleList = this.preparePaths();
    this.lastDiff = 100;
}

MovementAI.prototype.calcMovement = function() {
    if (this.obj.hit) { // temporary
	return
    };
    var angle = this.angleList[this.obj.coordPathIndex];
    var changeX = Math.cos(toRadians(angle)) * this.obj.def.speed;
    var changeY = Math.sin(toRadians(angle)) * this.obj.def.speed;
    //console.log("changex is " + changeX + ", changeY is " + changeY);
    this.obj.sprite.position.x += changeX;
    this.obj.sprite.position.y += changeY;
    this.obj.sprite.rotation = toRadians(angle-270);

    this.checkDestination();
};

MovementAI.prototype.checkDestination = function() {
    // check if coord has been reached
    var nextCoords = this.obj.coordPath[this.obj.coordPathIndex+1];
    if (nextCoords) {
	// console.log("diffx: " + Math.abs(nextCoords[0] - this.obj.sprite.position.x) + ", diffy: " + Math.abs(nextCoords[1] - this.obj.sprite.position.y))
	var diffx = Math.abs(nextCoords[0] - this.obj.sprite.position.x);
	var diffy = Math.abs(nextCoords[1] - this.obj.sprite.position.y);
	
	if ((diffx + diffy > this.lastDiff) && (diffx+diffy < 2)) {
	    this.obj.coordPathIndex += 1;
	    this.lastDiff = 100;
	    this.obj.sprite.position.x = nextCoords[0];
	    this.obj.sprite.position.y = nextCoords[1];
	}
	else {
	    this.lastDiff = diffx + diffy;
	}
    }

}

MovementAI.prototype.preparePaths = function() {
    var angleList = [];
    var coordPath = this.obj.coordPath;
    _.each(coordPath, function(coords, idx) {
	var next = coordPath[idx+1];
	if (next) {
	    var deltaX = next[0]-coords[0];
	    var deltaY = next[1]-coords[1];
	    //console.log("deltax is " + deltaX + ", deltaY is " + deltaY);
	    var angle = toDegrees(Math.atan2(deltaY, deltaX))-360;
	    //console.log("found angle " + angle);
	    angleList.push(angle);
	}
    });
    return angleList
}

