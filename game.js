function init() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x3D3D5C); 
    stage.interactive = true;
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(800, 600, {view:document.getElementById("game-canvas"), antialiasing:true});
    level = defaultLevel;
    var theBike = setupBike(level.bikeCoords[0],level.bikeCoords[1]);
    setupResult = buildLevel(stage, level);
    background = setupResult.background;
    staticCollisionObjects = setupResult.staticCollisionObjects;
    dynamicCollisionObjects = setupResult.dynamicCollisionObjects;
    car1 = dynamicCollisionObjects[0];
    setupBBs(staticCollisionObjects, stage, true, false);
    stage = setupResult.stage

    var input = {up: false, down: false, left: false, right: false}
    var posChange = {changeX:0, changeY:0, direction:270, speed:0}
    setupKeys(input);
    stage.addChild(theBike);

    requestAnimFrame( animate );

    function animate() {
        requestAnimFrame( animate );
	posChange = moveBike(posChange.direction,posChange.speed,input)
	theBike.position.x += posChange.changeX;
	theBike.position.y += posChange.changeY;
	theBike.rotation = toRadians(posChange.direction - 270);
	
	checkCollisions(theBike, staticCollisionObjects, posChange);
	setupBBs(dynamicCollisionObjects, stage, true, true)

	checkCollisions(theBike, dynamicCollisionObjects, posChange, true);
	var res = runCars(dynamicCollisionObjects);
	if (res != false) {
	    dynamicCollisionObjects[res[0]] = res[1];
	}
	
	// render the stage   
	renderer.render(stage);
    }
}

function setupKeys(input) {
    document.addEventListener('keydown', function(event) {
	if(event.keyCode == 37) {
	    input.left = true;
	}
	else if(event.keyCode == 39) {
	    input.right = true
	}
	else if(event.keyCode == 38) {
	    input.up = true;
	}
	else if(event.keyCode == 40) {
	    input.down = true;
	}

    });
    document.addEventListener('keyup', function(event) {
	if(event.keyCode == 37) {
	    input.left = false;
	}
	else if(event.keyCode == 39) {
	    input.right = false;
	}
	else if(event.keyCode == 38) {
	    input.up = false;
	}
	else if(event.keyCode == 40) {
	    input.down = false;
	}
    });

}
