var globalOptions = {debugMode:true, level: trafficLightsLevel, stop:false};

function start(renderer, stage) {
    globalOptions.stop = true;
    // create a renderer instance.

    if (!renderer) {
	addLevelChoices();
	var renderer = PIXI.autoDetectRenderer(800, 600, {view:document.getElementById("game-canvas"), antialiasing:true});
	var stage = new PIXI.Stage(0x3D3D5C); 
	stage.interactive = true;
	stage.click = function(mouseData) {
	    consoleLog("click at " + mouseData.global.x + ", " + mouseData.global.y);
	}
	setupOptions(renderer, stage);
	init(renderer, stage);
    }
}

function reset(renderer, stage) {
    if (stage) {
	for (var i = stage.children.length - 1; i >= 0; i--) {
	    stage.removeChild(stage.children[i]);
	};
    }
    stage.removeStageReference();
    delete stage;
    var stage = new PIXI.Stage(0x3D3D5C); 
    stage.interactive = true;
    stage.click = function(mouseData) {
	consoleLog("click at " + mouseData.global.x + ", " + mouseData.global.y);
    }
    setupOptions(renderer, stage);
    init(renderer, stage);
    return stage
}

function init(renderer, stage) {
    level = globalOptions.level;
    var resetTime = level.resetTime || 3000;
    var bikeObj = setupBike(level.bikeCoords[0],level.bikeCoords[1]);
    var bikeSprite = bikeObj.sprite
    setupResult = buildLevel(stage, level);
    background = setupResult.background;
    var staticCollisionObjects = setupResult.staticCollisionObjects;
    var dynamicCollisionObjects = setupResult.dynamicCollisionObjects;
    var sharedCarState = setupSharedCarState(setupResult, dynamicCollisionObjects, bikeObj, level.intersectionDefs);
    setupBBs(staticCollisionObjects, stage, true, false);
    stage = setupResult.stage
    var initialBikeRotation = level.bikeRotation || 0
    var input = {up: false, down: false, left: false, right: false}
    var posChange = {changeX:0, changeY:0, direction:270-initialBikeRotation, speed:0}
    setupKeys(input);
    stage.addChild(bikeSprite);


    globalOptions.stop=false;
    requestAnimFrame( animate );
    var counter = 0;
    function animate() {
	if (globalOptions.stop) {
	    return reset(renderer, stage)
	}
        requestAnimFrame( animate );
	doEnvironment();
	doBikeMovement();
	doCarMovement();	
	// render the stage   
	renderer.render(stage);
	counter += 1;
	if (counter > resetTime) {
	    counter = 0;
	    bikeObj.collisionResetCounter = 0;	  
	}
    }

    function doBikeMovement() {
	posChange = moveBike(posChange.direction,posChange.speed,input)
	bikeSprite.position.x += posChange.changeX;
	bikeSprite.position.y += posChange.changeY;
	bikeSprite.rotation = toRadians(posChange.direction - 270);
	checkCollisions(bikeObj, staticCollisionObjects, posChange);
	checkBikeCollisions(bikeObj, dynamicCollisionObjects, posChange);
	bikeSprite.bbPoly = BBFromSprite(bikeSprite);
	if (globalOptions.debugMode) {
	    drawLinesFromBBPoly(bikeSprite, bikeSprite.bbPoly, 2, 0xFF0000);
	}
    };
    function doCarMovement() {
	setupBBs(dynamicCollisionObjects, stage, true, true)
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

function setupOptions(renderer, stage) {
    $(document).ready(function() {
	$("input:radio[name=debug]").click(function() {
	    var strdebugMode = $(this).val();
	    if (strdebugMode === 'true') {
		globalOptions.debugMode = true;
	    }
	    else {
		globalOptions.debugMode = false;
	    }
	    start(renderer, stage);
	});
	$("input:radio[name=levelchoice]").click(function() {
	    var strLevel = $(this).val();
	    globalOptions.level = allLevels[strLevel];
	    start(renderer, stage);
	});

    });
}


function addLevelChoices() {
    choiceDiv = $("#levelchoices");
    var choices = '';
    _.each(allLevels, function(level, name, idx) {
	choices += '<input class="optioninput" type="radio" name="levelchoice" value="' + name + '"><span class="inputtext">' + name + '</span><br/>';
    });
    choiceDiv.html(choices);
    $("input:radio[name=levelchoice]").filter('[value=trafficlights]').prop('checked',true);
}
