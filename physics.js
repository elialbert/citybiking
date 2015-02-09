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

function checkCollisions(theBike, staticCollisionObjects, posChange) {
    // console.log(theBike.position.x + ": " + staticCollisionObjects[0].position.x);
    _.each(staticCollisionObjects, function(obj) {
	var xdist = obj.position.x - theBike.position.x;
	// console.log("A: " + xdist + ", " + obj.width/2);
	if (xdist > -obj.width && xdist < obj.width) {
	    var ydist = obj.position.y - theBike.position.y;
	    // console.log("B: " + obj.position.y + ": " + ydist + ", " + obj.height/2);
	    if (ydist >= -obj.height && ydist <= obj.height) {
		posChange.speed = posChange.speed / 2;
	    }
	}
    });
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
