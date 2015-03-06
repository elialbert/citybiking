function Bike(sprite) {
    this.sprite = sprite;
    this.stats = {'numHit':0,'numHonked':0,'clearedLevel':false,'levelTimeStarted':new Date()}
    this.collisionResetCounter = 0;
}


Bike.prototype.writeStats = function(msg) {
    $("#stats").html('<span class="inputtext">' + msg + '</span><br/>');
    var that = this;
    setTimeout(function() {
	that.clearStats();
	that.collisionResetCounter += 1;
    }, 5*1000);
}
Bike.prototype.clearStats = function() {
    $("#stats").html('');
}

Bike.prototype.gotHit = function() {
    if (this.doCollisionResetCounter()) {
	this.stats.numHit += 1;
	this.writeStats("You got hit by a car!");
    }
}

Bike.prototype.hitSomething = function(thing) {
    if (this.doCollisionResetCounter()) {
	this.stats.numHit += 1;
	this.writeStats("You hit a " + thing + "!");
    }
}

Bike.prototype.gotHonked = function() {
    if (this.doCollisionResetCounter()) {
	this.stats.numHonked += 1;
	this.writeStats("Honk!");
    }
}

Bike.prototype.doCollisionResetCounter = function() {
    if (this.collisionResetCounter == 0 ) {
	this.collisionResetCounter += 1;
	return true
    }
    if (this.collisionResetCounter < 50) {
	this.collisionResetCounter += 1;
	return false
    }
    else {
	return true
    }

}
