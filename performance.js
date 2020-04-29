function testDrawImgSpeed() {
	const iterations = 3;
	let avg = [];

	for (let i = 0; i < iterations; i++) {
		let start = performance.now();
		drawImg('normalImg');
		let end = performance.now();
		let elapsed = end - start;
		console.log(`drawImg with normalImg number ${i}: ${elapsed}`);
		avg.push(elapsed);
	}

	let sum = 0;
	for (let n of avg) {
		sum += n;
	}
	avg = sum / iterations; // now an int
	console.log('drawImg with normalImg avg: ' + avg);
}