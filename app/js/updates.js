//Modules
const compareVersions = require('compare-versions');
const CronJob = require('cron').CronJob;
const axios = require('axios');

//Check for updates
function checkForUpdates(force) {
	axios
		.get('https://api.github.com/repos/cerpow/catapult/releases')
		.then(async function ({ data }) {
			let currentVer = remote.app.getVersion();
			let updateVer = data[0].tag_name.replace('v', '');
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
				if (response === 0) shell.openExternal(data[0].assets[0].browser_download_url);

				//Skip this version
				if (response === 1) await DB.set('skipVersion', updateVer);

				//Stop
				return;
			}

			//Up to date
			if (force) showMessage('You’re up to date!', 'Catapult v' + updateVer + ' is currently the newest version available.', ['OK']);

			//Log
			console.log('Checked for updates');
		})
		.catch(function (error) {
			if (force) showMessage('Ooups!', 'An error occured checking for updates. Please try again or contact support.', ['OK']);
			console.log(error);
		});
}

//Show Message
function showMessage(message, detail, buttons) {
	return remote.dialog.showMessageBox(null, {
		message: message,
		defaultId: 0,
		detail: detail,
		buttons: buttons,
	});
}

//Check for updates
new CronJob({
	cronTime: '0 13 * * 1', //Every week on Monday
	onTick: () => checkForUpdates(),
	start: true,
	runOnInit: true,
});

//On sleep
remote.powerMonitor.on('resume', () => {
	checkForUpdates();
});

//Export
module.exports = checkForUpdates;
