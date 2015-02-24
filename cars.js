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

Car.prototype.animateSprites = function(movement, reset) { 
    if (movement.state == 'hit') {
	return;
    }
    if (!reset) {
	this.sprite.position.x += movement.changeX;
	this.sprite.position.y += movement.changeY;
    }
    else {
	this.sprite.position.x = movement.changeX;
	this.sprite.position.y = movement.changeY;
    }
    this.sprite.rotation = movement.rotation;

    // DO THE LIGHTS
    _.each(this.lights.rearLights, function(lightSprite) {
	if (movement.state == 'slowing') {
	    lightSprite.alpha = 1;
	}
	else {
	    lightSprite.alpha = .4;
	}
    });

};

Car.prototype.run = function() {
    //this.calcMovement();
    var movementResult = this.movementAI.calcMovement();
    this.animateSprites(movementResult);
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
    car.animateSprites({changeX:car.startingCoords[0], changeY: car.startingCoords[1], rotation:0}, true)
    var newcar = new Car(car.sprite, car.lights, car.def, car.stopSignLines);
    return [true, newcar]
}
