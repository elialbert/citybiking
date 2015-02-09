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
    var graphics = new PIXI.Graphics();
    // takes the middle of the road start and finish
    // goes from top to bottom
    roadDefs = [{xStart:300,yStart:0, xFinish:350, yFinish:600, roadWidth:100, sidewalkWidth:17}]
    graphics = drawRoadSections(graphics, stage, staticCollisionObjects, roadDefs);
    window.ttt = staticCollisionObjects;
    window.stage = stage;

    return {staticCollisionObjects: staticCollisionObjects, stage: stage}


    function drawRoadSections(graphics, stage, staticCollisionObjects, roadDefs) {
	_.each(roadDefs, function(roadDef, idx) {
	    drawRoad(graphics, stage, staticCollisionObjects, roadDef);
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
    
	    drawCurb(roadDef, roadDef.xStart-roadDef.roadWidth/2,roadDef.xFinish-roadDef.roadWidth/2)
    	    drawCurb(roadDef, roadDef.xStart+roadDef.roadWidth/2,roadDef.xFinish+roadDef.roadWidth/2)
	}

    }
    
    function drawCurb(roadDef, xstart, xfinish) {
    	var curb1 = new PIXI.Graphics();
	curb1.lineStyle(5, 0xd3d3d3, 1);
	curb1.moveTo(xstart, roadDef.yStart);
	curb1.lineTo(xfinish, roadDef.yFinish);
	curb1texture = curb1.generateTexture()
	curb1sprite = new PIXI.Sprite(curb1texture)
	curb1sprite.position.x = xstart;
	curb1sprite.position.y = roadDef.yStart;
	stage.addChild(curb1); // when I added the sprite,
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

    function drawSidewalks(graphics, roadDef) {    
	// left sidewalk
	graphics.lineStyle(roadDef.sidewalkWidth, 0x9BB4CD); //lightgray
	leftStart = roadDef.xStart - roadDef.roadWidth/2 - roadDef.sidewalkWidth/2;
	leftEnd = roadDef.xFinish - roadDef.roadWidth/2 - roadDef.sidewalkWidth/2;
	graphics.moveTo(leftStart, roadDef.yStart);
	graphics.lineTo(leftEnd, roadDef.yFinish);
	drawSidewalkLines(leftStart, leftEnd);


	// right sidewalk
	graphics.lineStyle(roadDef.sidewalkWidth, 0x9BB4CD); //lightgray
	rightStart = roadDef.xStart + roadDef.roadWidth/2 + roadDef.sidewalkWidth/2;
	rightEnd = roadDef.xFinish + roadDef.roadWidth/2 + roadDef.sidewalkWidth/2;
	graphics.moveTo(rightStart, roadDef.yStart);
	graphics.lineTo(rightEnd, roadDef.yFinish);
	drawSidewalkLines(rightStart, rightEnd);
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
