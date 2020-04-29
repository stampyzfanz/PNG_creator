/*
TODO:
1. Add drag and drop option to add picture
2. Allow user to add functions
3. Apply function to circle of img
4. Load transparent pics
5. Checkbox to either apply new style to img or originalimg - \
	Gives users ability to chain commands - eg greyscale img
	then remove transparent whitespace
6. Chromakey the white threshold
*/

let img;
let originalImg;

// names of functions shown to users, compared to their actual name
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
	"find the average of all the pixels": "averagePixels()",
};

function preload() {
	originalImg = loadImage('kitten.jpg');
}

let maxWidth = 612;

function setup() {
	img = originalImg.get();
	doc.canvas = createCanvas(img.width, img.height);
	drawImg('normalImg');
	addDropdowns();
}

function drawImg(mode, ...params) {
	// all parameters are between 0 and 255 (apart from mode)
	img = originalImg.get();

	if (params && params[0]) {
		params = params[0];
	}

	// update sizes of canvas and img
	let diff = maxNum(img.width, img.height) / maxWidth;
	resizeCanvas(round(img.width / diff), round(img.height / diff));
	pixelDensity(1);
	background(0);
	img.resize(width, height);

	img.loadPixels();
	loadPixels();

	// for any functions that need to use memory for any reason
	let memory = {};

	// TODO: let functions do code at start and end of drawImg
	let startFunctions = {}; // will get deleted
	startFunctions.averagePixels = function() {
		memory.r = 0;
		memory.g = 0;
		memory.b = 0;
		memory.i = 0;
	}

	// startFunctions['averagePixels']();
	if (startFunctions[mode]) {
		if (params) {
			startFunctions[mode](params[0], params[1], params[2], params[3]);
		} else {
			startFunctions[mode]();
		}
	}
	startFunctions = null;

	// if canvas and pic arent same size, give error
	if (img.width !== width || img.height !== height) {
		console.log(height, width);
		console.log(img.height, img.width);
		console.error('the image isnt same dimensions as canvas');
	}

	// apply function to every pixel of img
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let index = (x + y * width) * 4;

			// can be useful for greyscale and things
			let cols = img.pixels.slice(index, index + 3);
			let avg = (cols[0] + cols[1] + cols[2]) / 3;

			let functions = {};

			functions.normalImg = function() {
				pixels[index + 0] = img.pixels[index + 0];
				pixels[index + 1] = img.pixels[index + 1];
				pixels[index + 2] = img.pixels[index + 2];
			}

			functions.someColorsImg = function(r, g, b) {
				if (r) pixels[index + 0] = img.pixels[index + 0];
				if (g) pixels[index + 1] = img.pixels[index + 1];
				if (b) pixels[index + 2] = img.pixels[index + 2];
			}

			functions.inverseColorsImg = function() {
				pixels[index + 0] = 255 - img.pixels[index + 0];
				pixels[index + 1] = 255 - img.pixels[index + 1];
				pixels[index + 2] = 255 - img.pixels[index + 2];
			}

			functions.darkInverseColorsImg = function() {
				pixels[index + 0] = 128 - img.pixels[index + 0];
				pixels[index + 1] = 128 - img.pixels[index + 1];
				pixels[index + 2] = 128 - img.pixels[index + 2];
			}

			functions.greyscaleColorsImg = function() {
				pixels[index + 0] = avg;
				pixels[index + 1] = avg;
				pixels[index + 2] = avg;
			}

			functions.yellowGreyscaleColorsImg = function() {
				pixels[index + 0] = avg;
				pixels[index + 1] = avg;
				pixels[index + 2] = img.pixels[index + 2];
			}

			functions.greyscaleSomeColorsImg = function(r, g, b) {
				pixels[index + 0] = avg;
				pixels[index + 1] = avg;
				pixels[index + 2] = avg;

				if (r) pixels[index + 0] = img.pixels[index + 0];
				if (g) pixels[index + 1] = img.pixels[index + 1];
				if (b) pixels[index + 2] = img.pixels[index + 2];
			}

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

			// AKA: Disco mode
			functions.mapWhitenessToTransparencyImg = function() {
				let cols = img.pixels.slice(index, index + 3);
				let avg = (cols[0] + cols[1] + cols[2]) / 3;
				pixels[index + 0] = img.pixels[index + 0];
				pixels[index + 1] = img.pixels[index + 1];
				pixels[index + 2] = img.pixels[index + 2];
				pixels[index + 3] = map(brightness(avg), 100, 0, 0, 255);
				// 255 is vis
			}

			functions.averagePixels = function() {
				memory.r += img.pixels[index + 0];
				memory.g += img.pixels[index + 1];
				memory.b += img.pixels[index + 2];
				memory.i++;
			}

			// functions['normalImg']();
			if (params) {
				functions[mode](params[0], params[1], params[2], params[3]);
			} else {
				functions[mode]();
			}


		}
	}


	updatePixels();

	img.pixels = pixels;
	img.updatePixels();

	// console.log(params);

	// TODO: let functions do code at start and end of drawImg
	let endFunctions = {};
	endFunctions.averagePixels = function() {
		memory.r /= memory.i;
		memory.g /= memory.i;
		memory.b /= memory.i;
		background(memory.r, memory.g, memory.b);
		console.log(memory.r, memory.g, memory.b);
	}

	// endFunctions['averagePixels']();
	if (endFunctions[mode]) {
		if (params) {
			endFunctions[mode](params[0], params[1], params[2], params[3]);
		} else {
			endFunctions[mode]();
		}
	}
}

// draw loops every frame
function draw() {
	// if disco mode is on
	if (doc.discoMode && doc.discoMode.checked()) {
		// Change bg color
		selectAll('body')[0].style('background', `hsl(${frameCount}, 100%, 80%)`);

		// Add strobe lights
		// Every 10 frames, one gets added
		if (frameCount % 10 == 0) {
			stroke(random(255), random(255), random(255), 100);
			strokeWeight(4);
			line(width / 2, 0, random(width), random(height));
		}
	}
}