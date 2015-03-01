function setupBike(x,y) {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0x009900, 1);
    graphics.beginFill(0xffffff, 1);
    var width = 3;
    var height = 10;
    graphics.moveTo(325, 580);
    graphics.lineTo(325, 570);
    graphics.lineTo(328, 570);
    graphics.lineTo(328, 580);
    graphics.lineTo(325, 580);
    graphics.endFill();
    texture = graphics.generateTexture()
    theBike = new PIXI.Sprite(texture)
    theBike.position.x = x;
    theBike.position.y = y;
    theBike.anchor.x = .5;
    theBike.anchor.y = .5;
    /*
    var polygonPoints = [
	new SAT.Vector(-width/2,-height/2),
	new SAT.Vector(-width/2,height/2),
	new SAT.Vector(width/2,height/2),
	new SAT.Vector(width/2,-height/2),
	new SAT.Vector(-width/2,-height/2),
    ]
    */
    var polygonPoints = [
	new SAT.Vector(-width,-height),
	new SAT.Vector(-width,height),
	new SAT.Vector(width,height),
	new SAT.Vector(width,-height),
	new SAT.Vector(-width,-height),
    ]
    theBike.polygonPoints = polygonPoints;

    return theBike
}

// take a road center starting point, specify points along its course

function buildLevel(stage, level) {
    var staticCollisionObjects = [];
    var dynamicCollisionObjects = [];
    var stopSignLines = {}; // dict of intersection id to list of stopsign coords at that intersection
    var curblist = [];
    var graphics = new PIXI.Graphics();
    graphics = drawObjects(graphics, stage, staticCollisionObjects, level);
    return {staticCollisionObjects: staticCollisionObjects, 
	    dynamicCollisionObjects: dynamicCollisionObjects, 
	    stage: stage,
	    stopSignLines: stopSignLines,
	   }


    function drawObjects(graphics, stage, staticCollisionObjects, level) {
	// takes the middle of the road start and finish
	var roadDefs = level.roadDefs;
	var intersectionList = level.intersectionDefs;
	var carDefs = level.carDefs;
	var stopSigns = level.stopSigns;
	drawIntersections(graphics, intersectionList, stopSignLines); // basically just fill in black in the polygons in the list for now
	_.each(roadDefs, function(roadDef, idx) {
	    drawRoad(graphics, stage, staticCollisionObjects, roadDef);
	});
	// make sure curbs render on top
	_.each(curblist, function(curb) {
	    stage.addChild(curb);
	});

	_.each(stopSigns, function(stopSign) {
	    drawStopSign(stopSign, stage);
	});

	_.each(carDefs, function(carDef, idx) {
	    drawCar(carDef, stage, idx);
	});

	
	return graphics

	function drawRoad(graphics, stage, staticCollisionObjects, roadDef) {
	    // draws the actual road
            xdiff = roadDef.xFinish - roadDef.xStart
	    ydiff = roadDef.yFinish - roadDef.yStart
    	    roadLength = Math.sqrt(Math.pow(xdiff,2) + Math.pow(ydiff,2))

	    graphics.lineStyle(roadDef.roadWidth, 0x000000, 1);
	    graphics.moveTo(roadDef.xStart, roadDef.yStart);
	    graphics.lineTo(roadDef.xFinish, roadDef.yFinish);

	    graphics = drawSidewalks(graphics, roadDef)

	    graphics = drawYellowLines(graphics, roadDef);
	    stage.addChild(graphics);
    
	    angleOffset = getAngleOffset(roadDef.roadWidth/2)
	    
	    drawCurb(roadDef, 
		     roadDef.xStart-angleOffset.x, 
		     roadDef.yStart+angleOffset.y, 
		     roadDef.xFinish-angleOffset.x, 
		     roadDef.yFinish+angleOffset.y);
		     
	    drawCurb(roadDef, 
		     roadDef.xStart+angleOffset.x, 
		     roadDef.yStart-angleOffset.y, 
		     roadDef.xFinish+angleOffset.x, 
		     roadDef.yFinish-angleOffset.y);

	}

	function drawIntersections(graphics, intersectionDefs, stopSignLines) {
	    _.each(intersectionDefs, function(intersectionDef, key) {
		stopSignLines[key] = [];
		graphics.beginFill(0x000000, 1);
		_.each(intersectionDef, function(coord, idx) {
		    if (idx === 0) {
			graphics.moveTo(coord[0], coord[1]);
		    }
		    else {
			graphics.lineTo(coord[0], coord[1]);
		    }
		});
		graphics.endFill();
	    });
	}
    }

    function drawCar(carDef, stage, carId) {
	var startingCoords = carDef.coordPath[0]
	var car = new PIXI.Graphics();
	var polygonPoints = [];
	var width = carDef.width || 8;
	var height = carDef.height || 16;
	car.lineStyle(2, carDef.fillColor, 1);
	car.beginFill(carDef.fillColor, 1);
	var x = startingCoords[0];
	var y = startingCoords[1];
	car.moveTo(x, y); 
	car.lineTo(x, y-height);
	car.lineTo(x+width, y-height);
	car.lineTo(x+width, y);
	car.lineTo(x, y);
	car.endFill();
	texture = car.generateTexture()
	carSprite = new PIXI.Sprite(texture)
	carSprite.position.x = x;
	carSprite.position.y = y;
	carSprite.anchor.x = .5;
	carSprite.anchor.y = .5;
	var polygonPoints = [
	    new SAT.Vector(-width/2,-height/2),
	    new SAT.Vector(-width/2,height/2),
	    new SAT.Vector(width/2,height/2),
	    new SAT.Vector(width/2,-height/2),
	    new SAT.Vector(-width/2,-height/2),
	]
	carSprite.polygonPoints = polygonPoints;
	lights = drawCarLights(carSprite, width);
	carObj = new Car(carSprite, lights, carDef, stopSignLines, carId);
	carSprite.addChild(lights.rearLights[0]);
	carSprite.addChild(lights.rearLights[1]);
	carSprite.addChild(lights.headLights[0]);
	carSprite.addChild(lights.headLights[1]);
	stage.addChild(carSprite);
	dynamicCollisionObjects.push(carObj);
    };

    function drawCarLights(carSprite, width) {
	// use polygon points to pick corners for 4 lights:
	// 0: frontleft
	// 1: rearleft
	// 2: rearright
	// 3: frontright
	var lightSprites = []
	_.each([1,2,0,3], function(lightIdx, idx) {
	    if (idx < 2) {
		var color = 0xFF0000;
		var alpha = .8
	    }
	    else {
		var color = 0xFFFFFF;
		var alpha = .8
	    }
	    var light = new PIXI.Graphics();
	    var offsetX = carSprite.polygonPoints[lightIdx].x - 2;
	    var offsetY = carSprite.polygonPoints[lightIdx].y - 2;
	    light.beginFill(color, alpha);	 
	    light.drawCircle((carSprite.position.x + offsetX), (carSprite.position.y + offsetY), 2);
	    light.endFill();
	    texture = light.generateTexture()
	    var lightSprite = new PIXI.Sprite(texture)
	    lightSprite.position.x = offsetX; // position is relative to parent (the carSprite)
	    lightSprite.position.y = offsetY;
	    lightSprites.push(lightSprite);
	});
	return {rearLights: [lightSprites[0],lightSprites[1]], headLights:[lightSprites[2],lightSprites[3]]}

    };


    function drawStopSign(stopSignDef) {
	var coords = stopSignDef.coords;
	var rotation = stopSignDef.rotation;
	var sg = new PIXI.Graphics();
	var x = coords[0];
	var y = coords[1];
	sg.lineStyle(2, 0xFF0000, 1);
	sg.beginFill(0xFF0000, 1);
	sg.moveTo(x,y);
	sg.lineTo(x-4, y-8);
	sg.lineTo(x-8, y-4);
	sg.lineTo(x-8, y+4);
	sg.lineTo(x-4, y+8);
	sg.lineTo(x+4, y+8);
	sg.lineTo(x+8, y+4);
	sg.lineTo(x+8, y-4);
	sg.lineTo(x+4, y-8);
	sg.lineTo(x-4, y-8);
	sg.endFill();
	var text = new PIXI.Text("STOP", {font:"6px Arial", fill: "white", align:"center", strokeThickness: 1, stroke: "white", });
	text.anchor.x=.5;
	text.anchor.y=.5;
	text.position.x=x;
	text.position.y=y;
	text.rotation = toRadians(rotation);
	stage.addChild(sg);
	stage.addChild(text);
	// now the white line
	var wl = new PIXI.Graphics();
	wl.lineStyle(4, 0xFFFFFF, 1);
	offsets = [-Math.cos(toRadians(rotation)), -Math.sin(toRadians(rotation))];
	// console.log("offsets are " + offsets);
	var xStart = x+(15*offsets[0]);
	var yStart = y+(15*offsets[1]);
	var xEnd = x+(55*offsets[0]);
	var yEnd = y+(55*offsets[1]);
	wl.moveTo(xStart,yStart);
	wl.lineTo(xEnd,yEnd);
	points = [[xStart,yStart],[xEnd,yEnd]];
	stopSignLines[stopSignDef.intersection].push(points);
	stage.addChild(wl);
    };
    
    function drawCurb(roadDef,xstart,ystart,xfinish,yfinish) {
    	var curb1 = new PIXI.Graphics();
	var polygonPoints = [];
	curb1.lineStyle(5, 0xd3d3d3, 1);
	curb1.moveTo(xstart, ystart);
	curb1.lineTo(xfinish, yfinish);
	//console.log("drawing curb with " + xstart +", " + ystart + ", " + xfinish + ", " + yfinish);
	var angleOffset = getAngleOffset(2.5);
	//console.log("angle offset x: " + angleOffset.x + ", y: " + angleOffset.y);

	var polygonPoints = [
	    new SAT.Vector(-angleOffset.x,angleOffset.y),
	    new SAT.Vector(xfinish-xstart-angleOffset.x,yfinish-ystart + angleOffset.y),
	    new SAT.Vector(xfinish-xstart+angleOffset.x,yfinish-ystart - angleOffset.y),
	    new SAT.Vector(angleOffset.x,-angleOffset.y),
	    new SAT.Vector(-angleOffset.x,angleOffset.y),
	];
	curb1texture = curb1.generateTexture()
	curb1sprite = new PIXI.Sprite(curb1texture)
	curb1sprite.position.x = xstart;
	curb1sprite.position.y = ystart;
	curb1sprite.polygonPoints = polygonPoints;
	//stage.addChild(curb1); // when I added the sprite,
	curblist.push(curb1);
	// it didn't go exactly where it was supposed to
	staticCollisionObjects.push(curb1sprite);
    }
    
    function drawYellowLines(graphics, roadDef) {
	graphics.lineStyle(4,0xffff00, 1);
	graphics.moveTo(roadDef.xStart,roadDef.yStart);
	num_lines = roadLength / 10 / 2
	drawing = true;
	var y = roadDef.yStart;
	var x = roadDef.xStart;
	for (var i=0; i<=num_lines; i++) {
	    if(drawing) {
		graphics.lineTo(x,y);
		drawing = false;
	    }
	    else {
		graphics.moveTo(x,y);
		drawing = true;
	    }
	    y=y+ydiff/num_lines;
	    x=x+xdiff/num_lines;

	}
	return graphics
    }

    function getAngleOffset(offsetDistance) {
	//console.log("xdiff: " + xdiff + ", ydiff: " + ydiff)
	if (ydiff == 0) {
	    var ratio = 0;
	}
	else {
	    var ratio = xdiff/ydiff;
	}
	var angle1 = toDegrees(Math.atan(ratio));
	var angle2 = 90-(90-angle1);
	if (ydiff == 0) {
	    angle2 = 90;
	}
	var x = Math.cos(toRadians(angle2)) * offsetDistance;
	var y = Math.sin(toRadians(angle2)) * offsetDistance;
	//console.log("offsetd: " + offsetDistance + ", ratio: " + ratio + ", angle1: " + angle1 + ", angle2: " + angle2);
	return {x:x,y:y}
    }

    function drawSidewalks(graphics, roadDef) {  
	var angleOffset = getAngleOffset(roadDef.roadWidth/2 + roadDef.sidewalkWidth/2);
	var x=angleOffset.x;
	var y=angleOffset.y;
	//console.log("sidewalk angleoffset: " + x + ", " + y);
	graphics.lineStyle(roadDef.sidewalkWidth, 0x9BB4CD); //lightgray
	leftXStart = roadDef.xStart - x;
	leftXFinish = roadDef.xFinish - x;
	leftYStart = roadDef.yStart + y;
	leftYFinish = roadDef.yFinish + y;

	rightXStart = roadDef.xStart + x;
	rightXFinish = roadDef.xFinish + x;
	rightYStart = roadDef.yStart - y;
	rightYFinish = roadDef.yFinish - y;

	graphics.moveTo(leftXStart, leftYStart);
	graphics.lineTo(leftXFinish, leftYFinish);
	graphics.moveTo(rightXStart, rightYStart);
	graphics.lineTo(rightXFinish, rightYFinish);
	return graphics
    }

}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180/Math.pi);
}
