function Car(sprite, lights, def, stopSignLines) {
    // lights are a hash with array keys (with [left,right]) of rearLights and headLights 
    this.sprite = sprite;
    this.lights = lights;
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

Car.prototype.moveSprites = function(movement, reset) { 
    //window.ttt = this.sprite;
    pointLookup = {0: 0, 1: 3, 2: 1, 3: 2}
    _.each([this.sprite], function(sprite, idx) {
	if (!reset) {
	    sprite.position.x += movement.changeX;
	    sprite.position.y += movement.changeY;
	    sprite.rotation = movement.rotation;
	}
	else {
	    sprite.position.x = movement.changeX;
	    sprite.position.y = movement.changeY;
	    sprite.rotation = movement.rotation;
	}

    });
};

Car.prototype.run = function() {
    //this.calcMovement();
    var movementResult = this.movementAI.calcMovement();
    this.moveSprites(movementResult);
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
	car.run();
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
    car.moveSprites({changeX:car.startingCoords[0], changeY: car.startingCoords[1], rotation:0}, true)
    var newcar = new Car(car.sprite, car.lights, car.def, car.stopSignLines);
    return [true, newcar]
}
