function Car(sprite, lights, doors, def, stopSignLines, carId) {
    // lights are a hash with array keys (with [left,right]) of rearLights and headLights 
    this.sprite = sprite;
    this.lights = lights;
    this.doors = doors;
    this.coordPath = copyCoordPath(def.coordPath);
    this.startingCoords = this.coordPath[0];
    this.coordPathIndex = 0;
    this.type = def.type;
    this.carId = carId;
    this.state = 'new';
    this.angleState = 'new';
    this.lookaheadState = 'moving';
    this.lastState = 'new';
    this.def = def;
    this.hit = false;
    this.sequentialHitCounter = 0;
    this.lastInScene = null;
    this.sceneChangeCount = -1; //because we start null
    this.restartTimer = 20;
    this.stopSignLines = copyStopsignLines(stopSignLines);
    this.stopSignLinesCopy = copyStopsignLines(stopSignLines);
    this.movementAI = new MovementAI(this, stopSignLines);
}

Car.prototype.isInScene = function() {
    if (this.sprite.position.y > 0 && this.sprite.position.y < (globalOptions.level.levelSize[1] || 600) && this.sprite.position.x > 0 && this.sprite.position.x < (globalOptions.level.levelSize[0] || 800)) {
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
	if (movement.lookaheadState == 'slowing') {
	    lightSprite.alpha = 1;
	}
	else {
	    lightSprite.alpha = .4;
	}
    });
};

Car.prototype.changeDoor = function(doorDef, openBool) {
    doorSide = doorDef.split(' ')[0];
    this.doors[doorSide].open = openBool;
};

Car.prototype.run = function(sharedCarState) {
    if (this.sequentialHitCounter > 10) {	    
	console.log("car " + this.carId + " got stuck; restarting");
	this.restartTimer = -5;
    }
    if (this.movementAI.curSpeed > 1) {
	this.sequentialHitCounter = 0;
    }
    var movementResult = this.movementAI.calcMovement(sharedCarState);
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

Car.prototype.drawHonk = function() {
    if (this.startedHonk) {
	return
    }
    this.startedHonk = true;
    var g = new PIXI.Graphics()
    var that = this;
    g.lineStyle(3, 0xFF0000, 1);
    g.beginFill(0xFF0000, 0);	 
    g.drawCircle(0,0,20);	
    g.endFill();

    var honkOn = false;
    setTimeout(function() {
	run(10);
    }, 300);
    var run = function(counter) {
	var interval = setInterval(function() {
	    if (!honkOn) {
		that.sprite.addChild(g);
	    }
	    else {
		that.sprite.removeChild(g);
	    }
	    honkOn = !honkOn;
	    counter -= 1;
	    if (!counter) {
		setTimeout(function() {
		    that.startedHonk = false;
		}, 500);
		clearInterval(interval);
	    }
	}, 100);
    }

};

Car.prototype.getNewCar = function() {
    var car = this
    return new Car(car.sprite, car.lights, car.doors, car.def, car.stopSignLinesCopy, car.carId);
}

function runCars(cars, sharedCarState) {
    found = false
    _.each(cars, function(car, idx) {
	car.run(sharedCarState);
	res = doCarRestart(car, sharedCarState)
	if (res[0]) {
	    found = [idx, res[1]]
	    return
	}
    });
    return found
}

function doCarRestart(car, sharedCarState) {
    if (car.restartTimer > 0) {
	return [false, false]
    };
    car.animateSprites({changeX:car.startingCoords[0], changeY: car.startingCoords[1], rotation:0}, true)
    car.bbPoly = BBFromSprite(car.sprite);
    var collisionResult = false;
    _.each(sharedCarState.cars, function(carObj, carId) {
	if (collisionResult || (carObj.carId === car.carId)) {
	    return
	}
	if (checkCollision2(car.bbPoly, carObj.bbPoly)) {
	    car.animateSprites({changeX:getRandomInt(-500000,-500), changeY: getRandomInt(-500000,-500), rotation:0}, true)
	    collisionResult = [false, false]
	}
    });
    if (collisionResult) { // dont add car back until next tick, then check bb again
	return collisionResult;
    }

    var newcar = car.getNewCar();
    return [true, newcar]
}

function setupSharedCarState(setupResult, cars, staticCollisionObjects, bike, intersectionDefs) {
    allStopsignIntersections = _.uniq(_.map(setupResult.stopSignLines, function(v,k) { return k}));
    var ss = {stopSignLines: setupResult.stopSignLines, 
	      stopSignQueues: {}, 
	      cars: {}, 
	      allStopsignIntersections: allStopsignIntersections,
	      carsInIntersection: {},
	      carsAtStopsign: {},
	      staticCollisionObjects: staticCollisionObjects,
	      theBike: bike,
	      trafficLightLines: setupResult.trafficLightLines,
	      intersections: setupIntersectionDefs(intersectionDefs),
	      doors: {},
	     };
    _.each(allStopsignIntersections, function(intersectionId) {
	ss.stopSignQueues[intersectionId] = [];
    });
    _.each(cars, function(car) {
	ss.cars[car.carId] = car;
    });
    return ss
}

function copyStopsignLines(d) {
    var n = {};
    _.each(d, function(v, k) {
	var newv = [];
	_.each(v, function(el) {
	    newv.push($.extend(true, {}, el));
	});
	n[k] = newv;
    });
    return n
}

function copyCoordPath(p) {
    var n = [];
    _.each(p, function(el) {
	var newel = el.slice(0);
	n.push(newel);
    });
    return n
}
