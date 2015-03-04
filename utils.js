function drawLinesFromBBPoly(sprite, bbPoly, num, color) {
    if (!sprite.redLines) {
	sprite.redLines = {};
    }
    var g = new PIXI.Graphics()
    g.lineStyle(2, color, 1);
    _.each(bbPoly.calcPoints, function(point, idx) {
	var x = bbPoly.pos.x+point.x;
	var y = bbPoly.pos.y+point.y;
	if (idx === 0) {
	    g.moveTo(x,y);
	}
	else {
	    g.lineTo(x,y);
	}
    });

    oldSprite = sprite.redLines[num];
    redLineSprite = g//new PIXI.Sprite(g.generateTexture());

    if (sprite.parent.children.indexOf(oldSprite) !== -1) {
	sprite.parent.removeChild(oldSprite);
    }
    //redLineSprite.position.x = bbPoly.pos.x;
    //redLineSprite.position.y = bbPoly.pos.y;
    //redLineSprite.anchor.x = .5;
    //redLineSprite.anchor.y = .5;

    sprite.redLines[num] = redLineSprite;
    sprite.parent.addChild(redLineSprite);
}

function setupBBs(collisionObjects, stage, skipDraw, carMode) {
    _.each(collisionObjects, function(obj) {
	if (carMode) {
	    obj.bbPoly = BBFromSprite(obj.sprite);
	}
	else {
	    obj.bbPoly = BBFromSprite(obj);
	};
	if (skipDraw) {
	    return 
	}
	// draw red lines around bbs for testing:
	var ttt = obj.bbPoly;
	var g = new PIXI.Graphics();
	g.lineStyle(2, 0xff0000, 1);
	if (carMode) {
	    g.moveTo(ttt.pos.x-6,ttt.pos.y-12);
	}
	else {
	    g.moveTo(ttt.pos.x,ttt.pos.y);
	}
	_.each(ttt.points, function(point) {
	    //console.log("X: " + (ttt.pos.x+point.x) + ", Y: " + (ttt.pos.y+point.y));
	    g.lineTo(ttt.pos.x+point.x,ttt.pos.y+point.y);
	});
	stage.addChild(g);	
    });
}

function BBFromSprite(sprite) {
    // take a pixi sprite, return a SAT.js polygon
    // SAT.js polygon requires a position and then counterclockwise points referenced off of initial position
    var bb = new SAT.Polygon(new SAT.Vector(sprite.position.x,sprite.position.y), sprite.polygonPoints);    
    bb=bb.setAngle(sprite.rotation);
    return bb
}

function BBFromPoints(pos, points) {
    var pp = [];
    _.each(points, function(point) {
	pp.push(new SAT.Vector(point[0],point[1]));
    });
    return new SAT.Polygon(new SAT.Vector(pos[0],pos[1]), pp);
}

function getLineBB(points) {
    return new SAT.Polygon(new SAT.Vector(points[0][0], points[0][1]), [new SAT.Vector(points[0][0],points[0][1]), new SAT.Vector(points[1][0],points[1][1])]);
}


function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180/Math.PI);
}

function consoleLog(msg) {
    if (globalOptions.debugMode) {
	console.log(msg);
    }
}
