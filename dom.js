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
			await console.log(file.data);
			img = await loadImage(file.data);
			await img;

			await sleep(300);

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

	doc.discoMode = createCheckbox('disco mode', false);

	// https://stackoverflow.com/questions/2933681/how-to-position-an-element-next-to-another-an-element-of-undefined-position
	// also see interface.css
	doc.downloadImg.parent('#settings');
	doc.chooseSetting.parent('#settings');
	doc.choosePicture.parent('#settings');
	doc.discoMode.parent('#settings');




}