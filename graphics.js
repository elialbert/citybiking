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

// take a road center starting point, specify points along its course

function buildLevel(stage) {
    var staticCollisionObjects = [];
    var curblist = [];
    var graphics = new PIXI.Graphics();
    // takes the middle of the road start and finish
    // goes from top to bottom
    roadDefs = [
	{xStart:100,yStart:100, xFinish:300, yFinish:500, roadWidth:100, sidewalkWidth:17},
    ]
    graphics = drawRoadSections(graphics, stage, staticCollisionObjects, roadDefs);
    window.ttt = staticCollisionObjects;
    window.stage = stage;

    return {staticCollisionObjects: staticCollisionObjects, stage: stage}


    function drawRoadSections(graphics, stage, staticCollisionObjects, roadDefs) {
	_.each(roadDefs, function(roadDef, idx) {
	    drawRoad(graphics, stage, staticCollisionObjects, roadDef);
	});
	// make sure curbs render on top
	_.each(curblist, function(curb) {
	    stage.addChild(curb);
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

    }
    
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
	if (ydiff == 0) {
	    var ratio = 0;
	}
	else {
	    var ratio = xdiff/ydiff;
	}
	var angle1 = toDegrees(Math.atan(ratio));
	var angle2 = 90-(90-angle1);
	if (ratio == 0) {
	    angle2 = 90;
	}
	var x = Math.cos(toRadians(angle2)) * offsetDistance;
	var y = Math.sin(toRadians(angle2)) * offsetDistance;
	return {x:x,y:y}
    }

    function drawSidewalks(graphics, roadDef) {  
	var angleOffset = getAngleOffset(roadDef.roadWidth/2 + roadDef.sidewalkWidth/2);
	var x=angleOffset.x;
	var y=angleOffset.y;
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

	//drawSidewalkLines(rightStart, rightEnd);
	
	return graphics

	// not quite ready for sideways / diagonal roads yet
	function drawSidewalkLines(start, end) {
	    numLines = roadLength / 15;
    	    graphics.lineStyle(1, 0x101214, 1); // darker gray
	    var y = roadDef.yStart;
	    var x = start;
	    for (i=0;i<=numLines;i++) {
		graphics.moveTo(x-roadDef.sidewalkWidth/2, y);
		graphics.lineTo(x+roadDef.sidewalkWidth/2, y-ydiff/numLines/2);
		y=y+ydiff/numLines;
		x=x+xdiff/numLines;

    	    }
	    return graphics
	}
    }

}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180/Math.pi);
}
