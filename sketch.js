let img;

// Disco:
// let filteredImg;
// let lines = [];

let wordToFunction = {
	"normal image": "normalImg",
	"image with some of the colors": "someColorsImg",
	"image with inverted colors": "inverseColorsImg",
	"image with inverted colors that's darker": "darkInverseColorsImg",
	"greyscale image": "greyscaleColorsImg",
	"some greyscale image with green normal": "yellowGreyscaleColorsImg",
	"some greyscale image with some colors normal": "greyscaleSomeColorsImg",
	"image with increased brightness (saturation?)": "brighterImg",
	"image with white being transparent": "transparentWhitespaceImg",
	"image where the brightness of each part of the image \
	determines its transparency": "mapWhitenessToTransparencyImg",
	"": "averagePixels",
};

function preload() {
	img = loadImage('kitten.jpg');
}

let maxWidth = 1000;

function setup() {
	doc.canvas = createCanvas(img.width, img.height);

	// update sizes
	if (img.width > maxWidth) {
		let diff = img.width / maxWidth;
		resizeCanvas(img.width / diff, img.height / diff);
	} else if (img.height > maxWidth) {
		let diff = img.height / maxWidth;
		resizeCanvas(img.width / diff, img.height / diff);
	} else {
		resizeCanvas(img.width, img.height);
	}
	pixelDensity(1);
	background(0);
	img.resize(width, height);

	// you have to call it twice but im not sure why
	// trust me
	drawImg('normalImg');
	drawImg('normalImg');

	addDropdowns();
}

function drawImg(mode) {
	// update sizes
	if (img.width > 512) {
		let diff = img.width / 512;
		resizeCanvas(img.width / diff, img.height / diff);
	} else if (img.height > 512) {
		let diff = img.height / 512;
		resizeCanvas(img.width / diff, img.height / diff);
	} else {
		resizeCanvas(img.width, img.height);
	}
	pixelDensity(1);
	background(0);
	img.resize(width, height);

	console.log(mode, arguments);

	img.loadPixels();
	loadPixels();

	// Averaging all pixels:
	// let r = 0,
	// 	g = 0,
	// 	b = 0,
	// 	i = 0;

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let index = (x + y * width) * 4;

			// can be useful for greyscale and things
			let cols = img.pixels.slice(index, index + 3);
			let avg = (cols[0] + cols[1] + cols[2]) / 3;

			let functions = {};

			// Normal img:
			functions.normalImg = function() {
				pixels[index + 0] = img.pixels[index + 0];
				pixels[index + 1] = img.pixels[index + 1];
				pixels[index + 2] = img.pixels[index + 2];
			}

			// Magenta img:
			functions.someColorsImg = function(r, g, b) {
				if (r) pixels[index + 0] = img.pixels[index + 0];
				if (g) pixels[index + 1] = img.pixels[index + 1];
				if (b) pixels[index + 2] = img.pixels[index + 2];
			}

			// Inverse colors img:
			functions.inverseColorsImg = function() {
				pixels[index + 0] = 255 - img.pixels[index + 0];
				pixels[index + 1] = 255 - img.pixels[index + 1];
				pixels[index + 2] = 255 - img.pixels[index + 2];
			}

			// Dark inverse colors img:
			functions.darkInverseColorsImg = function() {
				pixels[index + 0] = 128 - img.pixels[index + 0];
				pixels[index + 1] = 128 - img.pixels[index + 1];
				pixels[index + 2] = 128 - img.pixels[index + 2];
			}

			// Greyscale colors img:
			functions.greyscaleColorsImg = function() {
				pixels[index + 0] = avg;
				pixels[index + 1] = avg;
				pixels[index + 2] = avg;
			}

			// Yellow greyscale colors img:
			functions.yellowGreyscaleColorsImg = function() {
				pixels[index + 0] = avg;
				pixels[index + 1] = avg;
				pixels[index + 2] = img.pixels[index + 2];
			}

			// Greyscale some colors img:
			functions.greyscaleSomeColorsImg = function(r, g, b) {
				pixels[index + 0] = avg;
				pixels[index + 1] = avg;
				pixels[index + 2] = avg;

				if (r) pixels[index + 0] = img.pixels[index + 0];
				if (g) pixels[index + 1] = img.pixels[index + 1];
				if (b) pixels[index + 2] = img.pixels[index + 2];
			}

			// Brighter img:
			functions.brighterImg = function(r, b, g) {
				if (arguments.length == 1) {
					// make all colors brighter by same amount
					b = r;
					g = r;
				}

				if (arguments.length == 0) {
					// default brightness increase is 1.5
					r = 1.5;
					g = 1.5;
					b = 1.5;
				}

				pixels[index + 0] = img.pixels[index + 0] * r;
				pixels[index + 1] = img.pixels[index + 1] * g;
				pixels[index + 2] = img.pixels[index + 2] * b;
			}

			// Transparant whitespace img:
			functions.transparentWhitespaceImg = function(whiteThreshold) {
				if (typeof(whiteThreshold) !== Number) {
					whiteThreshold = 200;
				}

				if (avg < whiteThreshold) { // if it isnt white
					pixels[index + 0] = img.pixels[index + 0];
					pixels[index + 1] = img.pixels[index + 1];
					pixels[index + 2] = img.pixels[index + 2];
					pixels[index + 3] = 255;
				} else {
					pixels[index + 3] = 0; // transparent
				}
			}

			// TODO: fix this, and create new one that user can input 2 colors
			// and it replaces one with the other, with a user given threshold

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
			functions.mapWhitenessToTransparencyImg = function() {
				let cols = img.pixels.slice(index, index + 3);
				let avg = (cols[0] + cols[1] + cols[2]) / 3;
				pixels[index + 0] = img.pixels[index + 0];
				pixels[index + 1] = img.pixels[index + 1];
				pixels[index + 2] = img.pixels[index + 2];
				pixels[index + 3] = map(brightness(avg), 100, 0, 0, 255);
				// 255 is vis
			}

			// Averaging all pixels:
			functions.averagePixels = function() {
				r += img.pixels[index + 0];
				g += img.pixels[index + 1];
				b += img.pixels[index + 2];
				i++;
			}

			// functions['normalImg']();
			functions[mode](arguments[1], arguments[2], arguments[3]);


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

	// Strobe lights for disco mode
	// for (let i in lines) {
	// 	lines[i].show();
	// 	if (lines[i].update()) {
	// 		lines.splice(i, 1);
	// 	};
	// }

}