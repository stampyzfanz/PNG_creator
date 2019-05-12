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


	// https://stackoverflow.com/questions/2933681/how-to-position-an-element-next-to-another-an-element-of-undefined-position
	// also see interface.css
	doc.downloadImg.parent('#settings');
	doc.chooseSetting.parent('#settings');




}