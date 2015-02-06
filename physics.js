// need direction, speed, input
// return change in position for x, y 
// speed is pixels/second
// direction is degrees
// so another way to look at it is we have angle and distance and need to calculate x and y offset
function moveBike(direction, speed, input) {
    if (input.down) {
	speed -= .1;
    }
    if (input.up) {
	speed += .05;
    }
    if (input.left) {
	if (speed != 0) {
	    direction -= 3.1/speed;
	}
    }
    if (input.right) {
	if (speed != 0) {
	    direction += 3.1/speed;
	}
    }
    
    direction = direction % 360;
    speed -= .02; // friction
    if (speed < 0) {
	speed = 0;
    }
    if (speed > 3) {
	speed = 3;
    }
    // now find the x and y offset
    changeX = Math.cos(toRadians(direction)) * speed;
    changeY = Math.sin(toRadians(direction)) * speed;
    //console.log("changex: " + changeX + " changey: " + changeY + " speed: " + speed);

    return {changeX:changeX, changeY:changeY, direction:direction, speed:speed}
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
