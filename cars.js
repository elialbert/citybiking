function Car(sprite, def) {
    this.sprite = sprite;
    this.startingCoords = def.startingCoords;
    this.type = def.type;
    this.state = 'new';
    this.def = def;
    this.hit = false;
    this.lastInScene = null;
    this.sceneChangeCount = -1; //because we start null
    this.restartTimer = 10;
}

Car.prototype.isInScene = function() {
    if (this.sprite.position.y > 0 && this.sprite.position.y < 600 && this.sprite.position.x > 0 && this.sprite.position.x < 800) {
	return true
    }
    return false
};


Car.prototype.move = function() {
    if (!this.hit) {
	this.sprite.position.y += 5.5;
    }
    var curInScene = this.isInScene();
    if (curInScene != this.lastInScene) {
	this.sceneChangeCount += 1;
    }
    this.lastInScene = curInScene;
    if (this.sceneChangeCount == this.def.sceneIncrementRestart) {
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
