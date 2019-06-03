let doc = {};

function addDropdowns() {
	doc.canvas.parent('#canvas');


	doc.downloadImg = createButton('Download New Image')
		.mousePressed(() => save('canvas.png'));
	// save is p5 function to download canvas

	// TODO: make btn to make img smaller

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

			deleteAllArguments();
			drawImg('normalImg');
		}
	}

	doc.chooseSetting.changed(() => {
		let word = doc.chooseSetting.value();
		let functionStr = wordToFunction[word].split('(')[0];
		// console.log(word);
		// console.log(functionStr);

		deleteAllArguments();
		createSettingArguments();
		execDrawImg();
	});

	function execDrawImg() {
		let word = doc.chooseSetting.value();
		let functionStr = wordToFunction[word].split('(')[0];

		let args = [];
		for (let i = 0; i < doc.args.length; i++) {
			args.push(doc.args[i].value());
		}

		console.log(args);

		drawImg(functionStr, args);
	}


	doc.args = [];
	doc.argExplanationArr = [];

	function createSettingArguments() {
		let word = doc.chooseSetting.value();
		let functionStr = wordToFunction[word];
		let argsStr = functionStr.split(/\(|\)/)[1];
		// functionStr.split() gives eg ["someColorsImg", "r, g, b", ""]
		// [1] is middle elt of array eg "r, g, b"
		let argsArr = argsStr.split(/, /);
		// WILL cause bug, as it argsArr can be [""]
		argsArr = argsArr.filter(arg => arg); // if arg then keep it
		console.log(argsArr, argsArr.length);

		for (let i = 0; i < argsArr.length; i++) {
			// all arguments are between 0 and 255
			doc.args[i] = createSlider(0, 255, 128, 3);
			doc.args[i].style('display', 'inline-block');
			doc.args[i].changed(execDrawImg);
			doc.args[i].parent('#settings');

			doc.argExplanationArr[i] =
				createP(`This will change the ${argsArr[i]} of the picture.`);
			doc.argExplanationArr[i].style('display', 'inline-block');
			doc.argExplanationArr[i].parent('#settings');
		}
	}

	function deleteAllArguments() {
		for (let elt of doc.args) {
			elt.remove();
		}

		for (let elt of doc.argExplanationArr) {
			elt.remove();
		}

		doc.args = [];
		doc.argExplanationArr = [];
	}


	doc.discoMode = createCheckbox('disco mode', false);
	doc.discoMode.changed(discoModeChanged);

	async function discoModeChanged() {
		if (!doc.discoMode.checked()) {
			// wait for draw to stop reversing the background change
			await sleep(1000);
			// remove the strobe lights
			execDrawImg();
			document.getElementsByTagName('body')[0].style = {
				'background': 'linear - gradient(to bottom right, red, orange, yellow) !important'
			}

			console.log('reverting bg to normal');
		}
	}

	doc.imgSize = createInput('Size of image')
		.changed(() => {
			if (typeof(parseInt(doc.imgSize.value())) == 'number') {
				maxWidth = parseInt(doc.imgSize.value());
				execDrawImg();
			}
		});

	// https://stackoverflow.com/questions/2933681/how-to-position-an-element-next-to-another-an-element-of-undefined-position
	// also see interface.css
	doc.downloadImg.parent('#settings');
	doc.chooseSetting.parent('#settings');
	doc.choosePicture.parent('#settings');
	doc.discoMode.parent('#settings');
	doc.imgSize.parent('#settings');




}