function Bike(sprite) {
    this.sprite = sprite;
    this.stats = {'numHit':0,'numHonked':0,'clearedLevel':false,'levelTimeStarted':new Date()}
    this.collisionResetCounter = 0;
}

Bike.prototype.prepareFinalStats = function() {
    timeFinished = new Date();
    totalTime = (timeFinished-this.stats.levelTimeStarted)/1000;
    $("#stats").html('<span class="inputtext">Level complete! Stats:<br/>Number of Collisions: ' + this.stats.numHit + '<br/>Number of honks: ' + this.stats.numHonked + '<br/>Total time: ' + totalTime + ' seconds</span>')
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
	this.writeStats("You crashed!");
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

Bike.prototype.isInScene = function() {
    if (this.sprite.position.y > 0 && this.sprite.position.y < (globalOptions.level.levelSize[1] || 600) && this.sprite.position.x > 0 && this.sprite.position.x < (globalOptions.level.levelSize[0] || 800)) {
	return true
    }
    return false
};
