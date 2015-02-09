function init() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x3D3D5C); //0x66FF99
    stage.interactive = true;
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(600, 600, {view:document.getElementById("game-canvas")});
    var theBike = setupBike();
    setupResult = setupBackground(stage);
    background = setupResult.background;
    staticCollisionObjects = setupResult.staticCollisionObjects;
    stage = setupResult.stage

    var input = {up: false, down: false, left: false, right: false}
    var posChange = {changeX:0, changeY:0, direction:270, speed:0}
    setupKeys(input);
    stage.addChild(theBike);

    requestAnimFrame( animate );
    window.ttt = theBike;
    function animate() {
        requestAnimFrame( animate );
	posChange = moveBike(posChange.direction,posChange.speed,input)
	theBike.position.x += posChange.changeX;
	theBike.position.y += posChange.changeY;
	theBike.rotation = toRadians(posChange.direction - 270);
	
	checkCollisions(theBike, staticCollisionObjects, posChange);
	// render the stage   
	renderer.render(stage);
    }
}

function setupBike() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0x009900, 1);
    graphics.beginFill(0xffffff, 1);
    graphics.moveTo(325, 580);
    graphics.lineTo(325, 570);
    graphics.lineTo(329, 570);
    graphics.lineTo(329, 580);
    graphics.lineTo(325, 580);
    graphics.endFill();
    texture = graphics.generateTexture()
    theBike = new PIXI.Sprite(texture)
    theBike.position.x = 325;
    theBike.position.y = 580;
    theBike.anchor.x = .5;
    theBike.anchor.y = .5;
    return theBike
}

function setupBackground(stage) {
    var staticCollisionObjects = [];
    var graphics = new PIXI.Graphics();
    // set a fill and line style
    graphics.beginFill(0x000000);
    graphics.lineStyle(0, 0xffffff, 1);
    
    // draw the road
    graphics.moveTo(250,0);
    graphics.lineTo(350, 0);
    graphics.lineTo(350, 600);
    graphics.lineTo(250, 600);
    graphics.lineTo(250, 0);
    graphics.endFill();
    stage.addChild(graphics);

    // draw two curbs and add to collision list
    var curb1 = new PIXI.Graphics();
    curb1.beginFill(0xd3d3d3);
    curb1.drawRect(250,0,5,600);
    curb1texture = curb1.generateTexture()
    curb1sprite = new PIXI.Sprite(curb1texture)
    curb1sprite.position.x = 350;
    curb1sprite.position.y = 0;

    var curb2 = new PIXI.Graphics();
    curb2.beginFill(0xd3d3d3);
    curb2.drawRect(350,0,5,600);
    curb2texture = curb2.generateTexture()
    curb2sprite = new PIXI.Sprite(curb2texture)
    curb2sprite.position.x = 250;
    curb2sprite.position.y = 0;

    stage.addChild(curb1sprite);
    stage.addChild(curb2sprite);
    staticCollisionObjects.push(curb1sprite);
    staticCollisionObjects.push(curb2sprite);

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
    return {staticCollisionObjects: staticCollisionObjects, stage: stage}
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
