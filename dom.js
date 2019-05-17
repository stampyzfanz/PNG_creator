let doc = {};

function addDropdowns() {
	doc.canvas.parent('#canvas');


	doc.downloadImg = createButton('Download New Image')
		.mousePressed(() => save('canvas.png'));
	// save is p5 function to download canvas

	doc.chooseSetting = createSelect();
	for (let a in wordToFunction) {
		if (wordToFunction.hasOwnProperty(a)) {
			doc.chooseSetting.option(a);
		}
	}


	doc.choosePicture = createFileInput(handleFile);
	async function handleFile(file) {
		print(file);
		if (file.type === 'image') {
			// creates img elt. doesnt have loadPixels
			// img_elt = await createImg(file.data);
			// img_elt.hide();

			console.log(file.data);
			img = await loadImage(file.data);
			await img;

			// let fake_canvas = createGraphics(file.width, file.height);
			// fake_canvas.background(0);
			// fake_canvas.image(img_elt);

			// img = fake_canvas;

			drawImg('normalImg');
		}
	}

	doc.chooseSetting.changed(() => {
		let word = doc.chooseSetting.value();
		let functionStr = wordToFunction[word];
		// console.log(word);
		// console.log(functionStr);

		drawImg(functionStr);
	});


	// https://stackoverflow.com/questions/2933681/how-to-position-an-element-next-to-another-an-element-of-undefined-position
	// also see interface.css
	doc.downloadImg.parent('#settings');
	doc.chooseSetting.parent('#settings');
	doc.choosePicture.parent('#settings');




}