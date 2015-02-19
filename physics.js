// need direction, speed, input
// return change in position for x, y 
// speed is pixels/second
// direction is degrees
// so another way to look at it is we have angle and distance and need to calculate x and y offset
function moveBike(direction, speed, input) {
    if (input.down) {
	speed -= .05;
    }
    if (input.up) {
	speed += Math.pow(.03,2)*22; // meh
    }
    if (input.left) {
	if (speed >= 1) {
	    direction -= 1/speed;
	}
	else if (speed >= 0) {
	    direction -= 1.5;
	}
    }
    if (input.right) {
	if (speed >= 1) {
	    direction += 1/speed;
	}	
	else if (speed >= 0) {
	    direction += 1.5;
	}

    }
    
    direction = direction % 360;
    speed -= .005; // friction
    if (speed < 0) { // no backwards
	speed = 0;
    }
    if (speed > 1.3) { // speed cap 
	speed = 1.3;
    }
    // now find the x and y offset
    changeX = Math.cos(toRadians(direction)) * speed;
    changeY = Math.sin(toRadians(direction)) * speed;
    frontOffsetX = Math.cos(toRadians(direction)) * 5
    frontOffsetY = Math.sin(toRadians(direction)) * 5
    //console.log("changex: " + changeX + " changey: " + changeY + " speed: " + speed);
    //console.log("fchangex: " + frontOffsetX + " fchangey: " + frontOffsetY + " speed: " + speed);
    return {changeX:changeX, 
	    changeY:changeY, 
	    frontOffsetX: frontOffsetX,
	    frontOffsetY: frontOffsetY,
	    direction:direction, 
	    speed:speed}
}

function checkCollisions(theBike, collisionObjects, posChange) { 
    var bike = new SAT.Vector(theBike.position.x+posChange.frontOffsetX, theBike.position.y+posChange.frontOffsetY);
    //console.log(theBike.position.x + ", " + theBike.position.y);
    _.each(collisionObjects, function(obj) {
	if (SAT.pointInPolygon(bike, obj.bbPoly)) {
	    //console.log("hit! " + bike.y);
	    posChange.speed = posChange.speed / 1.9;
	    obj.hit = true;
	}
    });
}

function setupBBs(collisionObjects, stage, skipDraw, carMode) {
    _.each(collisionObjects, function(obj) {
	obj.bbPoly = BBFromSprite(obj);
	var ttt = obj.bbPoly;
	// draw red lines around bbs for testing:
	
	if (skipDraw) {
	    return 
	}
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
    if (sprite.polygonPoints) {
	var poly = new SAT.Polygon(new SAT.Vector(sprite.position.x,sprite.position.y), sprite.polygonPoints);
    }
    else { // for right now, assume it's a car with size 20,8
	var x = sprite.position.x;
	var y = sprite.position.y;
	var polygonPoints = [
	    new SAT.Vector(-6,-12),
	    new SAT.Vector(-6,12),
	    new SAT.Vector(6,12),
	    new SAT.Vector(6,-12),
	    new SAT.Vector(-6,-12),
	]
	var poly = new SAT.Polygon(new SAT.Vector(x,y), polygonPoints);
	//console.log("drew car");
	//console.dir(poly);
    }
    return poly;
    
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180/Math.PI);
}
