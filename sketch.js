/*
TODO:
1. Reimplement line.js in disco mode.
2. Remove some bad comments, add more good comments
3. Add to README
4. Add drag and drop option to add picture
*/

let img;

let disco = {
	"disco.lines": [],
	"filteredImg": ""
};

let wordToFunction = {
	"normal image": "normalImg()",
	"image with some of the colors": "someColorsImg(r, g, b)",
	"image with inverted colors": "inverseColorsImg()",
	"image with inverted colors that's darker": "darkInverseColorsImg()",
	"greyscale image": "greyscaleColorsImg()",
	"some greyscale image with green normal": "yellowGreyscaleColorsImg()",
	"some greyscale image with some colors normal": "greyscaleSomeColorsImg(r, g, b)",
	"image with increased brightness (saturation?)": "brighterImg(r, g, b)",
	"image with white being transparent": "transparentWhitespaceImg(whiteThreshold)",
	"image where the brightness of each part of the image \
	determines its transparency": "mapWhitenessToTransparencyImg()",
	"": "averagePixels()",
};

function preload() {
	img = loadImage('kitten.jpg');
}

let maxWidth = 612;

function setup() {
	doc.canvas = createCanvas(img.width, img.height);

	// update sizes
	if (maxNum(img.width, img.height) > maxWidth) {
		let diff = maxNum(img.width, img.height) / maxWidth;
		resizeCanvas(round(img.width / diff), round(img.height / diff));
	} else {
		resizeCanvas(img.width, img.height);
	}
	pixelDensity(1);
	background(0);
	img.resize(width, height);

	drawImg('normalImg');

	addDropdowns();
}

function drawImg(mode, ...params) {
	// all parameters are between 0 and 255 (apart from mode)

	if (params && params[0]) {
		params = params[0];
	}

	// update sizes
	if (maxNum(img.width, img.height) > maxWidth) {
		let diff = maxNum(img.width, img.height) / maxWidth;
		resizeCanvas(round(img.width / diff), round(img.height / diff));
	} else {
		resizeCanvas(img.width, img.height);
	}
	pixelDensity(1);
	background(0);
	img.resize(width, height);

	img.loadPixels();
	loadPixels();

	// Averaging all pixels:
	// let r = 0,
	// 	g = 0,
	// 	b = 0,
	// 	i = 0;

	if (img.width !== width || img.height !== height) {
		console.log(height, width);
		console.log(img.height, img.width);
		console.error('the image isnt same dimensions as canvas');
	}
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
			functions.brighterImg = function(r, g, b) {
				if (params.length == 3) {
					r = map(r, 0, 255, -10, 10);
					g = map(g, 0, 255, -10, 10);
					b = map(b, 0, 255, -10, 10);
				}

				if (params.length == 1) {
					b = r;
					g = r;
				}

				if (params.length == 0) {
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
				if (typeof(whiteThreshold) !== 'number') {
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
			// TODO: add extra params
			if (params) {
				functions[mode](params[0], params[1], params[2]);
			} else {
				functions[mode]();
			}


		}
	}


	updatePixels();

	img.pixels = pixels;
	img.updatePixels();

	console.log(params);

	// Averaging all pixels:
	// r /= i;
	// g /= i;
	// b /= i;
	// background(r, g, b);

	disco.filteredImg =

}

function draw() {
	// TODO: Add disco

	// Disco:
	if (doc.discoMode && doc.discoMode.checked()) {
		selectAll('body')[0].style('background', `hsl(${frameCount}, 100%, 80%)`);

		tint(255, 50);
		image(disco.filteredImg, 0, 0, width, height);
		ellipse(width / 3, random(height), 20);

		disco.lines.push(new Line(random(width), random(height), 255));

		// Strobe lights
		for (let i in disco.lines) {
			disco.lines[i].show();
			if (disco.lines[i].update()) {
				disco.lines.splice(i, 1);
			};
		}
	}
}