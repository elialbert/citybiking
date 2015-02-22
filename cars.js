function Car(sprite, startingCoords, type) {
    this.sprite = sprite;
    this.startingCoords = startingCoords;
    this.type = type;
    this.state = 'new';
}

Car.prototype.isInScene = function() {
    if (this.sprite.position.y > 0 && this.sprite.position.y < 600 && this.sprite.position.x > 0 && this.sprite.position.x < 800) {
	return true
    }
    return false
}
