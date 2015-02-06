function init() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0xd3d3d3); //0x66FF99
    stage.interactive = true;
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(600, 600, {view:document.getElementById("game-canvas")});
    var theBike = setupBike();
    var background = setupBackground();
    var input = {up: false, down: false, left: false, right: false}
    var posChange = {changeX:0, changeY:0, direction:270, speed:0}
    setupKeys(input);
    stage.addChild(background);
    stage.addChild(theBike);

    requestAnimFrame( animate );

    function animate() {
        requestAnimFrame( animate );
	posChange = moveBike(posChange.direction,posChange.speed,input)
	theBike.position.x += posChange.changeX;
	theBike.position.y += posChange.changeY;
	//theBike.pivot.x = theBike.position.x
	//theBike.pivot.y = theBike.position.y
	//theBike.rotation +=1; //toRadians(posChange.direction);
   
	// render the stage   
	renderer.render(stage);
    }
}

function setupBike() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0x009900, 1);
    graphics.beginFill(0xffffff, 1);
    graphics.moveTo(325, 580);
    graphics.lineTo(329, 580);
    graphics.lineTo(329, 570);
    graphics.lineTo(325, 570);
    graphics.lineTo(325, 580);
    graphics.endFill();
    console.log("pivot is " + graphics.pivot)
    console.dir(graphics.pivot);
    return graphics
}

function setupBackground() {
    var graphics = new PIXI.Graphics();
    // set a fill and line style
    graphics.beginFill(0x000000);
    graphics.lineStyle(5, 0xffffff, 1);
    
    // draw a shape
    graphics.moveTo(250,0);
    graphics.lineTo(350, 0);
    graphics.lineTo(350, 600);
    graphics.lineTo(250, 600);
    graphics.lineTo(250, 0);
    graphics.endFill();

    graphics.lineStyle(4,0xffff00, 1);
    graphics.moveTo(300,0);
    y = 0;
    drawing = true;
    while (true) {
	y=y+10;
	if(drawing) {
	    graphics.lineTo(300,y);
	    drawing = false;
	}
	else {
	    graphics.moveTo(300,y);
	    drawing = true;
	}
	if (y > 600) {
	    break
	}
    }
    return graphics
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
