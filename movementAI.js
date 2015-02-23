function MovementAI(obj) {
    this.obj = obj;
    this.angleList = this.preparePaths();
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
    
};

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
