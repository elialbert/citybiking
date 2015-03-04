var globalOptions = {debugMode:false};
function init() {
    setupDebugMode();
    var stage = new PIXI.Stage(0x3D3D5C); 
    stage.interactive = true;
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(800, 600, {view:document.getElementById("game-canvas"), antialiasing:true});
    level = trafficLightsLevel;
    resetTime = level.resetTime || 3000;
    var theBike = setupBike(level.bikeCoords[0],level.bikeCoords[1]);
    setupResult = buildLevel(stage, level);
    background = setupResult.background;
    var staticCollisionObjects = setupResult.staticCollisionObjects;
    var dynamicCollisionObjects = setupResult.dynamicCollisionObjects;
    var sharedCarState = setupSharedCarState(setupResult, dynamicCollisionObjects, theBike);
    setupBBs(staticCollisionObjects, stage, true, false);
    stage = setupResult.stage

    var input = {up: false, down: false, left: false, right: false}
    var posChange = {changeX:0, changeY:0, direction:270, speed:0}
    setupKeys(input);
    stage.addChild(theBike);

    requestAnimFrame( animate );
    var counter = 0;
    function animate() {
        requestAnimFrame( animate );
	doEnvironment();
	doBikeMovement();
	doCarMovement();	
	// render the stage   
	renderer.render(stage);
	counter += 1;
	if (counter > resetTime) {
	    counter = 0;
	}
    }

    function doBikeMovement() {
	posChange = moveBike(posChange.direction,posChange.speed,input)
	theBike.position.x += posChange.changeX;
	theBike.position.y += posChange.changeY;
	theBike.rotation = toRadians(posChange.direction - 270);
	checkCollisions(theBike, staticCollisionObjects, posChange);
	checkBikeCollisions(theBike, dynamicCollisionObjects, posChange);
	theBike.bbPoly = BBFromSprite(theBike);
	if (globalOptions.debugMode) {
	    drawLinesFromBBPoly(theBike, theBike.bbPoly, 2, 0xFF0000);
	}
    };
    function doCarMovement() {
	setupBBs(dynamicCollisionObjects, stage, true, true)
	checkCollisions(theBike, dynamicCollisionObjects, posChange, true);
	var res = runCars(dynamicCollisionObjects, sharedCarState);
	if (res != false) {
	    dynamicCollisionObjects[res[0]] = res[1];
	    sharedCarState.cars[res[1].carId] = res[1];
	}
    };

    function doEnvironment() {
	var tf = sharedCarState.trafficLightLines;
	_.each(tf, function(trafficLights, intersectionId) {
	    _.each(trafficLights, function(def) {
		var tint = null;
		if (counter == def.greenVal) {
		    var tint = 0x00CC00;
		    def.state = 'green';
		}
		else if (counter == def.yellowVal) {
		    var tint = 0xFFFF00;
		    def.state = 'yellow';
		}
		else if (counter == def.redVal) {
		    var tint = 0xFF0000;
		    def.state = 'red';
		}
		if (tint) {
		    consoleLog("setting tint to " + tint);
		    var tfg = new PIXI.Graphics();
		    tfg.lineStyle(2, 0x000000, 1);
		    tfg.beginFill(tint, 1);
		    tfg.drawCircle(def.x,def.y,7);
		    tfg.endFill();
		    stage.addChild(tfg);
		}
	    });
	});
    }


}


function setupKeys(input) {
    document.addEventListener('keydown', function(event) {
	if(event.keyCode == 37) {
	    input.left = true;
	    event.preventDefault();
	}
	else if(event.keyCode == 39) {
	    input.right = true
	    event.preventDefault();
	}
	else if(event.keyCode == 38) {
	    input.up = true;
	    event.preventDefault();
	}
	else if(event.keyCode == 40) {
	    input.down = true;
	    event.preventDefault();
	}

    });
    document.addEventListener('keyup', function(event) {
	if(event.keyCode == 37) {
	    input.left = false;
	    event.preventDefault();
	}
	else if(event.keyCode == 39) {
	    input.right = false;
	    event.preventDefault();
	}
	else if(event.keyCode == 38) {
	    input.up = false;
	    event.preventDefault();
	}
	else if(event.keyCode == 40) {
	    input.down = false;
	    event.preventDefault();
	}
    });

}

function setupDebugMode() {
    $(document).ready(function() {
	var strdebugMode = $("input:radio[name=debug]").val();
	if (strdebugMode === 'true') {
	    globalOptions.debugMode = true;
	}
	else {
		globalOptions.debugMode = false;
	}

	$("input:radio[name=debug]").click(function() {
	    var strdebugMode = $(this).val();
	    if (strdebugMode === 'true') {
		globalOptions.debugMode = true;
	    }
	    else {
		globalOptions.debugMode = false;
	    }
	});
    });
}
