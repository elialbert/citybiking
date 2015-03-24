var globalOptions = {debugMode:false, level: busyIntersectionsLevel, stop:false, betweenLevelsTimer: 1000};

function start(renderer, stage) {
    globalOptions.stop = true;
    // create a renderer instance.
    if (!renderer) {
	addLevelChoices();
	var renderer = PIXI.autoDetectRenderer(globalOptions.level.levelSize[0] || 800, globalOptions.level.levelSize[1] || 600, {view:document.getElementById("game-canvas"), antialiasing:true});
	fitToScreen(renderer);
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
    var text = new PIXI.Text("Get Ready...", {font:"60px Arial", fill: "white", align:"center", strokeThickness: 2, stroke: "white", });
    text.anchor.x=.5;
    text.anchor.y=.5;
    texture = text.generateTexture();
    var textSprite = new PIXI.Sprite(texture);
    textSprite.position.x = 300;
    textSprite.position.y = 300;
    stage.addChild(textSprite);
    var fakeCounter = 0;
    requestAnimFrame(fakeAnimate);
    setTimeout(function() {
	stage.removeChild(textSprite);
	stage.interactive = true;
	stage.click = function(mouseData) {
	    consoleLog("click at " + mouseData.global.x + ", " + mouseData.global.y);
	}
	globalOptions.betweenLevelsTimer = 1000;
	setupOptions(renderer, stage);
	renderer.resize(globalOptions.level.levelSize[0] || 800,globalOptions.level.levelSize[1] || 600);
	fitToScreen(renderer);
	init(renderer, stage);
	return stage
    }, globalOptions.betweenLevelsTimer);
    function fakeAnimate() {
	if (fakeCounter > 10) {
	    return
	}
	requestAnimFrame(fakeAnimate);
	renderer.render(stage);
	fakeCounter += 1;
    } 
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
    var sharedCarState = setupSharedCarState(setupResult, dynamicCollisionObjects, staticCollisionObjects, bikeObj, level.intersectionDefs);
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
	runJoystick(input);
	posChange = moveBike(posChange.direction,posChange.speed,input)
	bikeSprite.position.x += posChange.changeX;
	bikeSprite.position.y += posChange.changeY;
	bikeSprite.rotation = toRadians(posChange.direction - 270);
	if (!bikeObj.isInScene()) {
	    bikeObj.prepareFinalStats();
	    globalOptions.stop = true;
	    globalOptions.betweenLevelsTimer = 3000;
	}
	checkCollisions(bikeObj, staticCollisionObjects, posChange);
	checkDoorCollisions(bikeObj, sharedCarState.doors, posChange);
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
		else if (def.state === true) {
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

function fitToScreen(renderer) {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight-60;
    var doHeight = false;
    if (newHeight < 360) {
	doHeight = true;
    }
    var specifiedWidth = globalOptions.level.levelSize[0] || 800;
    var specifiedHeight = globalOptions.level.levelSize[1] || 600;
    //console.log("width diff: " + (specifiedWidth - newWidth));
    //console.log("height diff: " + (specifiedHeight - newHeight));
    if ((!doHeight) && ((specifiedWidth - newWidth) > (specifiedHeight - newHeight))) {
	newHeight = newWidth * specifiedHeight / specifiedWidth;
    }
    else {
	newWidth = newHeight * specifiedWidth / specifiedHeight;
    }
    //console.log("newwidth: " + newWidth);
    //console.log("newheight: " + newHeight);
    renderer.view.style.width = newWidth + "px";
    renderer.view.style.height = newHeight + "px";
    setupJoystick(newWidth, newHeight);
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
	    $("#levelDescription").html(strLevel + " level: " + globalOptions.level.description);
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
    var strLevel = "busyIntersections";
    $("input:radio[name=levelchoice]").filter('[value='+strLevel+']').prop('checked',true);
    $("#levelDescription").html(strLevel + " level: " + globalOptions.level.description);
}

function setupJoystick(width, height) {
    extraWidth = (window.innerWidth - width) / 2
    containerEl = $("#joystick-container");
    joystickEl = $("#joystick");
    containerEl.css("position","absolute");
    containerEl.css("top",(height-(.15*height))+"px");
    containerEl.css("left",(extraWidth + width-(.15*width))+"px");
    joystickEl.css("position","absolute");
    joystickEl.css("top",(containerEl.height()/2-10) + "px");
    joystickEl.css("left",(containerEl.width()/2 - 10) + "px");

    heightOffset = containerEl.height()*.25;

    // setup groove boxes
    jslEl = $("#joystick-left");
    jsrEl = $("#joystick-right");
    jsuEl = $("#joystick-up");
    jsdEl = $("#joystick-down");
    jslEl.css("position","absolute");
    jslEl.css("height",containerEl.height()/2);
    jslEl.css("width",containerEl.width()/3-2);
    jslEl.css("top","0px");
    jslEl.css("left","0px");
    jsrEl.css("position","absolute");
    jsrEl.css("height",containerEl.height()/2);
    jsrEl.css("width",containerEl.width()/3-2);
    jsrEl.css("top","0px");
    jsrEl.css("left",containerEl.width()/3*2);
    jsuEl.css("position","absolute");
    jsuEl.css("height",containerEl.height()/2 - heightOffset);
    jsuEl.css("width",containerEl.width()/3-2);
    jsuEl.css("top","0px");
    jsuEl.css("left",containerEl.width()/3);
    jsdEl.css("position","absolute");
    jsdEl.css("height",containerEl.height()/2 - heightOffset-2);
    jsdEl.css("width",containerEl.width()-2);
    jsdEl.css("top",containerEl.height()/2 + heightOffset);
    jsdEl.css("left","0px");


    joystickEl.draggable({
	containment: "#joystick-container",
	scroll: false,
	revert: true,
    });
    globalOptions.joystickContainerWidth = containerEl.width();
    globalOptions.joystickContainerHeight = containerEl.height();
    globalOptions.joystickStartingPosition = $("#joystick").position();
}

function runJoystick(input) {
    var joystickEl = $("#joystick");
    var triggerHeight = globalOptions.joystickContainerHeight * .25;
    var triggerWidth = globalOptions.joystickContainerWidth * .25;
    var position = joystickEl.position();
    var top = position.top - globalOptions.joystickStartingPosition.top;
    var left = position.left - globalOptions.joystickStartingPosition.left;
    jslEl = $("#joystick-left");
    jsrEl = $("#joystick-right");
    jsuEl = $("#joystick-up");
    jsdEl = $("#joystick-down");
    if (top < -1*triggerHeight) {
	input.up = true;
	input.down = false;
	jsuEl.css("background-color","red");
	jsdEl.css("background-color","");
    }
    else if (top > triggerHeight) {
	input.up = false;
	input.down = true;
	jsuEl.css("background-color","");
	jsdEl.css("background-color","red");
    }
    else {
	input.up = false;
	input.down = false;
	jsuEl.css("background-color","");
	jsdEl.css("background-color","");
    }
    
    if (left < -1*triggerWidth) {
	input.left = true;
	input.right = false;
	jslEl.css("background-color","red");
	jsrEl.css("background-color","");
    }
    else if (left > triggerWidth) {
	input.left = false;
	input.right = true;
	jslEl.css("background-color","");
	jsrEl.css("background-color","red");
    }
    else { 
	input.left = false;
	input.right = false;
	jslEl.css("background-color","");
	jsrEl.css("background-color","");
    }
	
    //console.log("input up is " + input.up + ", left is " + input.left + ", right is " + input.right + ", down is " + input.down);
    
    
}
