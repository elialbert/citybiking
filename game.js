function init() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x3D3D5C); //0x66FF99
    stage.interactive = true;
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(800, 600, {view:document.getElementById("game-canvas"), antialiasing:true});
    level = defaultLevel;
    var theBike = setupBike(level.bikeCoords[0],level.bikeCoords[1]);
    // takes the middle of the road start and finish
    // goes from top to bottom
    var roadDefs = level.roadDefs;
    var intersectionList = level.intersectionList;
    var carDefs = level.carDefs;

    setupResult = buildLevel(stage, roadDefs, intersectionList, carDefs);
    car1 = setupResult.cars[0]
    background = setupResult.background;
    staticCollisionObjects = setupResult.staticCollisionObjects;
    dynamicCollisionObjects = setupResult.dynamicCollisionObjects;
    setupBBs(staticCollisionObjects, stage);
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
	checkCollisions(theBike, dynamicCollisionObjects, posChange);

	// simple car movement for testing
	car1.position.y += .5

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
