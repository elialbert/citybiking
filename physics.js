// need direction, speed, input
// return change in position for x, y 
// speed is pixels/second
// direction is degrees
// so another way to look at it is we have angle and distance and need to calculate x and y offset
function moveBike(direction, speed, input) {
    if (input.down) {
	speed -= .07;
    }
    if (input.up) {
	speed += .04;
    }
    if (input.left) {
	if (speed >= 1) {
	    direction -= 3.8/speed;
	}
	else if (speed >= 0) {
	    direction -= 2;
	}
    }
    if (input.right) {
	if (speed >= 1) {
	    direction += 3.8/speed;
	}	
	else if (speed >= 0) {
	    direction += 2;
	}

    }
    
    direction = direction % 360;
    speed -= .01; // friction
    if (speed < 0) {
	speed = 0;
    }
    if (speed > 2.7) {
	speed = 2.7;
    }
    // now find the x and y offset
    changeX = Math.cos(toRadians(direction)) * speed;
    changeY = Math.sin(toRadians(direction)) * speed;
    //console.log("changex: " + changeX + " changey: " + changeY + " speed: " + speed);

    return {changeX:changeX, changeY:changeY, direction:direction, speed:speed}
}

function checkCollisions2(theBike, staticCollisionObjects, posChange) { 
    var bike = new SAT.Vector(theBike.position.x, theBike.position.y);
    //console.log(theBike.position.x + ", " + theBike.position.y);
    _.each(staticCollisionObjects, function(obj) {
	if (SAT.pointInPolygon(bike, obj.bbPoly)) {
	    //console.log("hit! " + bike.y);
	    posChange.speed = posChange.speed / 1.9;
	}
    });
}

function setupStaticBBs(staticCollisionObjects, stage) {
    _.each(staticCollisionObjects, function(obj) {
	obj.bbPoly = BBFromSprite(obj);
	var ttt = obj.bbPoly;
	// draw red lines around bbs for testing:
	
	var g = new PIXI.Graphics();
	g.lineStyle(2, 0xff0000, 1);
	g.moveTo(ttt.pos.x,ttt.pos.y);
	_.each(ttt.points, function(point) {
	    //console.log("X: " + (ttt.pos.x+point.x) + ", Y: " + (ttt.pos.y+point.y));
	    g.lineTo(ttt.pos.x+point.x,ttt.pos.y+point.y);
	});
	stage.addChild(g);
	window.ttt =ttt;
	
    });
}

function BBFromSprite(sprite) {
    // take a pixi sprite, return a SAT.js polygon
    // SAT.js polygon requires a position and then counterclockwise points referenced off of initial position
    if (sprite.polygonPoints) {
	var poly = new SAT.Polygon(new SAT.Vector(sprite.position.x,sprite.position.y), sprite.polygonPoints);
    }
    else {
	console.log("NO POLY POINTS!");
    }
    return poly;
    
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180/Math.PI);
}
