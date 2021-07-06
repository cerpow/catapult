//Modules
const { app, BrowserWindow, Tray, screen, globalShortcut, ipcMain } = require('electron');
const Store = require('electron-store').initRenderer();
const path = require('path');
require('@electron/remote/main').initialize();

//Vars
let tray = null;
let mb = null;

//On ready
app.on('ready', () => {
	//Create Browser
	createBrowser();

	//Create Tray
	createTray();
});

//Create Browser Window
function createBrowser() {
	//Create Menubar
	mb = new BrowserWindow({
		width: process.env.NODE_ENV ? 1200 : 320,
		height: process.env.NODE_ENV ? 800 : 424,
		frame: false,
		resizable: process.env.NODE_ENV ? true : false,
		minimizable: false,
		closable: false,
		show: false,
		transparent: true,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			backgroundThrottling: false,
		},
	});

	//Load Index
	mb.loadURL(`file://${__dirname}/app/index.html`);

	//Reset Zoom Factor
	mb.once('ready-to-show', () => (mb.webContents.zoomFactor = 1));

	//Hide Browser on blur
	mb.on('blur', (e) => (mb.isVisible() ? showHide(e, null, true) : null));

	mb.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

	//Open Dev Tools
	if (process.env.NODE_ENV) mb.webContents.openDevTools();
}

//Create Tray
function createTray() {
	//Create Tray
	tray = new Tray(path.join(__dirname, '/app/assets/IconTemplate.png'));

	//Disable double Clicks
	tray.setIgnoreDoubleClickEvents(true);

	//On Click
	tray.on('click', (e) => showHide(e));

	//On Right Click
	tray.on('right-click', (e) => showHide(e));

	//Show Browser On Drag
	tray.on('drag-enter', (e) => showHide(e, true));
}

//Show/Hide Browser
function showHide(e, isDrag, hide, shortcut) {
	//Get browser position
	const { x: winX, y: winY } = mb.getBounds();
	const activeDisplay = screen.getDisplayNearestPoint({ x: winX, y: winY });

	// Get mouse cursor absolute position
	const { x: curX, y: curY } = screen.getCursorScreenPoint();
	const currentDisplay = screen.getDisplayNearestPoint({ x: curX, y: curY });

	//Check if same screen
	const isSameScreen = activeDisplay.id == currentDisplay.id;

	//Update position
	if (shortcut) {
		let mbBounds = mb.getBounds();
		mb.setPosition(activeDisplay.bounds.width / 2 - mbBounds.width / 2, activeDisplay.bounds.height / 2 - mbBounds.height / 2 - 150);
	} else {
		mb.setPosition(Math.round(tray.getBounds().x + 18 - mb.getBounds().width / 2), 0);
	}

	//Show app + diff screen
	if (!hide && (!isSameScreen || isDrag || (!mb.isVisible() && !e?.shiftKey && !e?.ctrlKey && !e?.metaKey))) {
		mb.show();
		return globalShortcut.register('Escape', () => showHide());
	}

	//Hide app
	globalShortcut.unregister('Escape');
	mb.hide();
}

//Register show shortcut
ipcMain.handle('setShortcut', (e, key) => {
	globalShortcut.register(key, () => showHide(null, null, null, true));
});

//Hide Dock Icon
app.dock.hide();
