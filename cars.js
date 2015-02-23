function Car(sprite, def, stopSignLines) {
    this.sprite = sprite;
    this.startingCoords = def.coordPath[0];
    this.coordPath = def.coordPath;
    this.coordPathIndex = 0;
    this.type = def.type;
    this.state = 'new';
    this.def = def;
    this.hit = false;
    this.lastInScene = null;
    this.sceneChangeCount = -1; //because we start null
    this.restartTimer = 20;
    this.stopSignLines = stopSignLines
    this.movementAI = new MovementAI(this, stopSignLines);
}

Car.prototype.isInScene = function() {
    if (this.sprite.position.y > 0 && this.sprite.position.y < 600 && this.sprite.position.x > 0 && this.sprite.position.x < 800) {
	return true
    }
    return false
};

Car.prototype.move = function() {
    //this.calcMovement();
    this.movementAI.calcMovement();
    // decide if car should be restarted
    var curInScene = this.isInScene();
    if (curInScene != this.lastInScene) {
	this.sceneChangeCount += 1;
    }
    this.lastInScene = curInScene;
    if (this.sceneChangeCount == (this.def.sceneIncrementRestart || 2)) {
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
    sprite.position.x = car.startingCoords[0];
    sprite.position.y = car.startingCoords[1];
    var newcar = new Car(sprite, car.def, car.stopSignLines);
    return [true, newcar]
}
