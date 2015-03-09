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

function checkDoorCollisions(bikeObj, doors, posChange) {
    var bikeSprite = bikeObj.sprite;
    var bikeline = [[bikeSprite.position.x+posChange.frontOffsetX, bikeSprite.position.y+posChange.frontOffsetY],
		    [bikeSprite.position.x, bikeSprite.position.y]];
    _.each(doors, function(door, carId) {
	_.each(door, function(doorObj, doorSide) {
	    if ((doorObj.open) && (doorObj.doorLine)) {
		if (isIntersect(bikeline[0],bikeline[1],doorObj.doorLine[0], doorObj.doorLine[1])) {
		    console.log("BIKE HIT DOOR!");
		    posChange.speed = posChange.speed / 1.9;
		    bikeObj.hitSomething("door");
		}
	    }
	});
    });
};

function checkCollisions(bikeObj, collisionObjects, posChange, carMode) { 
    var bikeSprite = bikeObj.sprite;
    var bike = new SAT.Vector(bikeSprite.position.x+posChange.frontOffsetX, bikeSprite.position.y+posChange.frontOffsetY);
    //console.log(bikeSprite.position.x + ", " + bikeSprite.position.y);
    _.each(collisionObjects, function(obj) {
	if (checkCollision(bike, obj.bbPoly)) {
	    //console.log("hit! " + bike.y);
	    posChange.speed = posChange.speed / 1.9;
	    obj.hit = true;
	    bikeObj.hitSomething("curb")
	}
    });
}

function checkBikeCollisions(bikeObj, collisionObjects, posChange) {
    var bikeSprite = bikeObj.sprite;
    if ((bikeSprite.bbPoly === undefined)) {
	return 
    }
    _.each(collisionObjects, function(obj) {
	if ((obj.movementAI.bbPoly === undefined)) {
	    return 
	}
	if (checkCollision2(bikeSprite.bbPoly, obj.movementAI.bbPoly)) {
	    posChange.speed = posChange.speed / 1.9;
	    obj.hit = true;	    
	    bikeObj.hitSomething("car");
	}
    });
}

function checkCollision(point, bbPoly) {
    return SAT.pointInPolygon(point, bbPoly)
}
function checkCollision2(bbPoly1, bbPoly2) {
    return SAT.testPolygonPolygon(bbPoly1, bbPoly2)
}

function checkInIntersection(carPoly, intersectionPoly) {
    var response = new SAT.Response();
    var collided = SAT.testPolygonPolygon(carPoly, intersectionPoly, response)
    return collided;
}

function CCW(p1, p2, p3) {
  a = p1[0]; b = p1[1]; 
  c = p2[0]; d = p2[1];
  e = p3[0]; f = p3[1];
  return (f - b) * (c - a) > (d - b) * (e - a);
}

function isIntersect(p1, p2, p3, p4) {
  return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180/Math.PI);
}
