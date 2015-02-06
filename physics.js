// need direction, speed, input
// return change in position for x, y 
function moveBike(direction, speed, input) {
    var changeX = 0;
    var changeY = 0;
    if (input.left) {
	changeX = -1;
    }
    if (input.right) {
	changeX = 1;
    }
    if (input.up) {
	changeY = -1;
    }
    if (input.down) {
	changeY = 1;
    }
    
    return {changeX:changeX, changeY:changeY}
}
