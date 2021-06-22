//Modules
const compareVersions = require('compare-versions');
const axios = require('axios-slim');

//Check for updates
function checkForUpdates(force) {
	axios('https://api.github.com/repos/cerpow/catapult/releases')
		.then(async function ({ body }) {
			let currentVer = remote.app.getVersion();
			let updateVer = body[0].tag_name.replace('v', '');
			let hasUpdate = compareVersions.compare(currentVer, updateVer, '<');
			let skipVersion = (await DB.get('skipVersion')) == updateVer;

			//Stop if skip version
			if (!force && skipVersion) return;

			//Update available
			if (hasUpdate) {
				let { response } = await showMessage('A new version of Catapult is available!', 'Catapult v' + updateVer + ' is now available. Would you like to download it now?', [
					'Download',
					'Skip this version',
					'Cancel',
				]);

				//Download latest version
				if (response === 0) shell.openExternal(body[0].assets[0].browser_download_url);

				//Skip this version
				if (response === 1) await DB.set('skipVersion', updateVer);

				//Stop
				return;
			}

			//Up to date
			if (force) showMessage('You’re up to date!', 'Catapult v' + currentVer + ' is currently the newest version available.', ['OK']);

			//Log
			console.log('Checked for updates');
		})
		.catch(function (error) {
			if (force) showMessage('Ooups!', 'An error occured checking for updates. Please try again or contact support.', ['OK']);
			console.log(error);
		});
}
checkForUpdates();

//Show Message
function showMessage(message, detail, buttons) {
	return remote.dialog.showMessageBox(null, {
		message: message,
		defaultId: 0,
		detail: detail,
		buttons: buttons,
	});
}

//On sleep
remote.powerMonitor.on('resume', () => {
	checkForUpdates();
});

//Export
module.exports = checkForUpdates;
