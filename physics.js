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
    window.b=theBike;
    window.o = staticCollisionObjects;
    rb = staticCollisionObjects[1]
    //var bike = new SAT.Polygon(new SAT.Vector(theBike.position.x,theBike.position.y), [
//	new SAT.Vector(theBike.position.x, theBike.position.y),
//	new SAT.Vector(theBike.position.x, theBike.position.y+theBike.height),
//	new SAT.Vector(theBike.position.x+theBike.width, theBike.position.y+theBike.height),
//	new SAT.Vector(theBike.position.x+theBike.width, theBike.position.y)
  //  ]);
    var bike = new SAT.Vector(theBike.position.x, theBike.position.y);
    window.bb=bike;
    //var right = new SAT.Polygon(new SAT.Vector(rb.position.x,rb.position.y), [
//	new SAT.Vector(rb.position.x, rb.position.y),
//	new SAT.Vector(rb.position.x+rb.width, rb.position.y+rb.height),
//	new SAT.Vector(rb.position.x+rb.width+5, rb.position.y+rb.height),
//	new SAT.Vector(rb.position.x+5, rb.position.y)
	
  //  ]);
    _.each(staticCollisionObjects, function(obj) {
	if (SAT.pointInPolygon(bike, obj.bbPoly)) {
	    console.log("hit! " + bike.x);
	}
    });
}

function setupStaticBBs(staticCollisionObjects, stage) {
    _.each(staticCollisionObjects, function(obj) {
	obj.bbPoly = BBFromSprite(obj);
	var ttt = obj.bbPoly;
	var g = new PIXI.Graphics();
	g.lineStyle(2, 0xff0000, 1);
	g.moveTo(ttt.pos.x,ttt.pos.y);
	_.each(ttt.points, function(point) {
	    console.log("check " + ttt.pos.x + point.x);
	    g.lineTo(ttt.pos.x+point.x,ttt.pos.y+point.y);
	});
	stage.addChild(g);
	window.tt1 = ttt;
	window.tt2 = g;

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

function checkCollisions(theBike, staticCollisionObjects, posChange) {
    console.log("bikex: "+ theBike.position.x + ",rightcurbx: " + staticCollisionObjects[1].position.x);
    _.each(staticCollisionObjects, function(obj) {
	var xdist = obj.position.x - theBike.position.x;
	console.log("xdist: " + xdist + ", objwidth/2: " + obj.width/2);
	if (xdist > -obj.width/2 && xdist < obj.width/2) {
	    var ydist = obj.position.y - theBike.position.y;
	    console.log("objpos y: " + obj.position.y + ", ydist: " + ydist + ", objheight/2: " + obj.height/2);
	    // brokenish:
	    if (ydist >= -obj.height && ydist <= obj.height) {
		console.log("hit");
		posChange.speed = posChange.speed / 2;
	    }
	}
    });
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
