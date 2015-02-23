function Car(sprite, def) {
    this.sprite = sprite;
    this.startingCoords = def.startingCoords;
    this.type = def.type;
    this.state = 'new';
    this.def = def;
    this.hit = false;
    this.lastInScene = null;
    this.sceneChangeCount = -1; //because we start null
    this.restartTimer = 20;
}

Car.prototype.isInScene = function() {
    if (this.sprite.position.y > 0 && this.sprite.position.y < 600 && this.sprite.position.x > 0 && this.sprite.position.x < 800) {
	return true
    }
    return false
};

// this will soon become the entrance to the ai functionality
// calculating when to stop / slowdown
// deciding when / if to turn or
// running pathing based on cardefs
// restarting movement after a collision
// will hook into physics for acceleration
Car.prototype.calcMovement = function() {
    if (!this.hit) {
	this.sprite.position.x += this.def.speed[0];
	this.sprite.position.y += this.def.speed[1];
    }
}

Car.prototype.move = function() {
    this.calcMovement();
    var curInScene = this.isInScene();
    if (curInScene != this.lastInScene) {
	this.sceneChangeCount += 1;
    }
    this.lastInScene = curInScene;
    if (this.sceneChangeCount == this.def.sceneIncrementRestart || 2) {
	this.restartTimer -= 1;
    }
};

function runCars(cars) {
    found = false
    _.each(cars, function(car, idx) {
	car.move();
	res = doCarRestart(car)
	if (res[0]) {
	    found = [idx, res[1]]
	    return
	}
    });
    return found
}

function doCarRestart(car) {
    if (car.restartTimer > 0) {
	return [false, false]
    };
    var sprite = car.sprite;
    sprite.position.x = car.def.startingCoords[0];
    sprite.position.y = car.def.startingCoords[1];
    var newcar = new Car(sprite, car.def);
    return [true, newcar]
}
