const { app, ipcMain, dialog } = require('electron');
const config = new (require('electron-config'))();
const AutoLaunch = require('auto-launch');
const menubar = require('menubar');
const open = require('mac-open');
const path = require('path');
const fs = require('fs');

//DB
if (config.get('projects')) global.projects = config.get('projects');
if (config.get('lastApplication')) global.lastApplication = config.get('lastApplication');

//CREATE WINDOW
var dir = path.join(app.getAppPath(), '/app');
opts = {
	width: 360,
	height: 400,
	dir: dir,
	preloadWindow: true,
	resizable: false,
	icon: path.join(__dirname, '/app/assets/IconTemplate.png')
};
if (process.env.NODE_ENV === 'dev') {
	opts.width = 1200;
	opts.height = 850;
	opts.resizable = true;
}
var mb = menubar(opts);

//WINDOW CREATED
mb.on('after-create-window', function() {
	//OPEN WINDOW ON DRAG
	mb.tray.on('drag-enter', e => {
		mb.showWindow();
	});

	//SET ZOOM FACTOR
	let webContents = mb.window.webContents;
	webContents.on('did-finish-load', () => {
		webContents.setZoomFactor(1);
	});

	//SHOW DEV TOOL
	if (process.env.NODE_ENV === 'dev') mb.window.openDevTools();
});

//SAVE PROJECTS
ipcMain.on('saveProjects', (e, projects) => {
	config.set('projects', projects);
});

//DELETE PROJECTS
ipcMain.on('deleteProjects', e => {
	config.delete('projects');
});

//SAVE LAST APPLICATION
ipcMain.on('saveLastApplication', (e, application) => {
	config.set('lastApplication', application);
});

//OPEN PROJECT
ipcMain.on('openProject', (e, project) => {
	open(
		project.path,
		{
			a: project.openIn
		},
		function(err) {
			if (!err) return;
			e.sender.send('error', err.message);
		}
	);
});

//SAVE ICON
const util = require('util');
const exec = util.promisify(require('child_process').execFile);

ipcMain.on('saveIcon', (e, path) => {
	getIcon(path).then(function(img) {
		e.sender.send('saveIconDone', img);
	});
});

async function getIcon(imgPath) {
	const now = new Date().getTime();
	const scriptPath = path.join(app.getAppPath(), 'app/assets/getIcon');
	const userDataPath = path.join(app.getPath('userData'), 'icons');
	const savePath = path.join(userDataPath, now + '.png');
	if (!fs.existsSync(userDataPath)) {
		fs.mkdirSync(userDataPath);
	}
	const getImg = await exec(scriptPath, [imgPath, savePath], {
		maxBuffer: 4024 * 500
	});

	return savePath;
}

// AUTO LAUNCH ON LOGIN
var catapultAutoLauncher = new AutoLaunch({ name: 'Catapult', path: '/Applications/Catapult.app' });
catapultAutoLauncher.enable();
catapultAutoLauncher
	.isEnabled()
	.then(function(isEnabled) {
		if (isEnabled) {
			return;
		}
		catapultAutoLauncher.enable();
	})
	.catch(function(err) {
		console.log(err);
	});
