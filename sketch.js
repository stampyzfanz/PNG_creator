let img;

// Disco:
// let filteredImg;
// let lines = [];

function preload() {
	img = loadImage('kitten.jpg');
}

function setup() {
	// console.log(img.width, img.height);
	// createCanvas(img.width, img.height);
	createCanvas(img.width / 4 * 3, img.height / 4 * 3);
	pixelDensity(1);

	background(0);
	// clear();

	// filteredImg = createGraphics(width, height);


	// image(img, 0, 0, width, height);

	img.resize(width, height);

	drawImg();

}

function drawImg() {
	img.loadPixels();
	// filteredImg.background(0);

	// filteredImg.loadPixels();
	loadPixels();

	// Averaging all pixels:
	// let r = 0,
	// 	g = 0,
	// 	b = 0,
	// 	i = 0;

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let index = (x + y * width) * 4;

			// Normal img:
			// pixels[index + 0] = img.pixels[index + 0];
			// pixels[index + 1] = img.pixels[index + 1];
			// pixels[index + 2] = img.pixels[index + 2];

			// Red img:
			// pixels[index + 0] = img.pixels[index + 0];

			// Magenta img:
			// pixels[index + 0] = img.pixels[index + 0];
			// pixels[index + 2] = img.pixels[index + 2];

			// Inverse colors img:
			// pixels[index + 0] = 255 - img.pixels[index + 0];
			// pixels[index + 1] = 255 - img.pixels[index + 1];
			// pixels[index + 2] = 255 - img.pixels[index + 2];

			// Dark inverse colors img:
			// pixels[index + 0] = 128 - img.pixels[index + 0];
			// pixels[index + 1] = 128 - img.pixels[index + 1];
			// pixels[index + 2] = 128 - img.pixels[index + 2];

			// Greyscale colors img:
			// let cols = img.pixels.slice(index, index + 3);
			// let avg = (cols[0] + cols[1] + cols[2]) / 3;
			// pixels[index + 0] = avg;
			// pixels[index + 1] = avg;
			// pixels[index + 2] = avg;

			// Yellow greyscale colors img:
			// let cols = img.pixels.slice(index, index + 3);
			// let avg = (cols[0] + cols[1] + cols[2]) / 3;
			// pixels[index + 0] = avg;
			// pixels[index + 1] = avg;
			// pixels[index + 2] = img.pixels[index + 2];

			// Brighter img:
			// pixels[index + 0] = img.pixels[index + 0] * 1.5;
			// pixels[index + 1] = img.pixels[index + 1] * 1.5;
			// pixels[index + 2] = img.pixels[index + 2] * 1.5;

			// Weighted color img
			// pixels[index + 0] = img.pixels[index + 0] * 1.3;
			// pixels[index + 1] = img.pixels[index + 1] * 0.85;
			// pixels[index + 2] = img.pixels[index + 2] * 1.3;

			// Transparant whitespace img:
			// let cols = img.pixels.slice(index, index + 3);
			// let avg = (cols[0] + cols[1] + cols[2]) / 3;
			// if (avg < 200) { // if it isnt white
			// 	// if (avg === 255) { // if it isnt white
			// 	pixels[index + 0] = img.pixels[index + 0];
			// 	pixels[index + 1] = img.pixels[index + 1];
			// 	pixels[index + 2] = img.pixels[index + 2];
			// 	pixels[index + 3] = 255;
			// } else {
			// 	pixels[index + 3] = 0; // transparent
			// }

			// Magenta blackness img:
			// let avg = (cols[0] + (255 - cols[1]) + cols[2]) / 3;
			// if (avg < 200) { // if it isnt white
			// 	// if (avg === 255) { // if it isnt white
			// 	pixels[index + 0] = img.pixels[index + 0];
			// 	pixels[index + 1] = img.pixels[index + 1];
			// 	pixels[index + 2] = img.pixels[index + 2];
			// 	pixels[index + 3] = 255;
			// } else {
			// 	pixels[index + 1] = 255 - img.pixels[index + 1]; // magenta
			// }

			// Transparant corresponding to brightness img:
			// AKA: Disco
			let cols = img.pixels.slice(index, index + 3);
			let avg = (cols[0] + cols[1] + cols[2]) / 3;
			pixels[index + 0] = img.pixels[index + 0];
			pixels[index + 1] = img.pixels[index + 1];
			pixels[index + 2] = img.pixels[index + 2];
			pixels[index + 3] = map(brightness(avg), 100, 0, 0, 255);
			// 255 is vis

			// Averaging all pixels:
			// r += img.pixels[index + 0];
			// g += img.pixels[index + 1];
			// b += img.pixels[index + 2];
			// i++;


		}
	}


	updatePixels();

	// filteredImg.pixels = pixels;
	// filteredImg.updatePixels();

	img.pixels = pixels;
	img.updatePixels();


	// Averaging all pixels:
	// r /= i;
	// g /= i;
	// b /= i;
	// background(r, g, b);


}

function draw() {
	// Disco:
	// selectAll('body')[0].style('background-color', `hsl(${frameCount}, 100%, 80%)`);

	// drawImg();
	// tint(255, 50);
	// image(filteredImg, 0, 0, width, height);
	// ellipse(width / 3, random(height), 20);

	// lines.push(new Line(random(width), random(height), 255));

	// Strobe lights for disco
	// for (let i in lines) {
	// 	lines[i].show();
	// 	if (lines[i].update()) {
	// 		lines.splice(i, 1);
	// 	};
	// }

}

function mousePressed() {
	save('canvas.png');








}