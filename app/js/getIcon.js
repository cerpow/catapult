//Modules
const fileIcon = require('extract-file-icon');

//Get Icon
async function getIcon(imgPath) {
	//Return Base64
	return 'data:image/png;base64,' + fileIcon(imgPath, 180).toString('base64');
}

//Export
module.exports = getIcon;
