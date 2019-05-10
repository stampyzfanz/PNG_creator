class Line {
	constructor(x, y, lifeSpan) {
		this.x = x;
		this.y = y;
		this.col_r = random(255);
		this.col_g = random(255);
		this.col_b = random(255);
		this.lifeLeft = lifeSpan;
	}

	show() {
		stroke(this.col_r, this.col_g, this.col_b, this.lifeLeft);
		strokeWeight(4);
		line(width / 2, 0, this.x, this.y);
	}

	update() {
		this.lifeLeft -= 50;
		if (this.lifeLeft < 0) {
			return true
		}
	}
}