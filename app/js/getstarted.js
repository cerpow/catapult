//Get Started Screen
async function GetStarted() {
	let html = '';
	return new Promise((r) => {
		//Settings Icon
		html += '<div class="settings"><img draggable="false" src="./assets/ico_settings.svg"></div>';

		//Get Started Screen
		html += '<div class="get-started">';
		html += '<div class="get-started-image"><img draggable="false" class="ico-flower" src="./assets/ico_flower.svg"><img draggable="false" src="./assets/ico_file.svg"></div>';
		html +=
			'<div class="get-started-image get-started-image-drag"><img draggable="false" class="ico-flower" src="./assets/ico_flower_drag.svg"><img draggable="false" src="./assets/ico_file_drag.svg"></div>';
		html += '<p>To get started, drag and drop a folder or a file here</p></div>';
		html += '<footer><a href="#">Open Browser</a></footer>';

		//Resolve
		r(html);
	});
}

//Export
module.exports = GetStarted;
