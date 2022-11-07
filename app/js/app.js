//Settings DB
const Store = require('electron-store');
const DB = new Store({ defaults: { openAtLogin: false, lastApplication: 'Finder', projects: [], theme: 'system', shortcut: true } });

//Modules
const remote = require('@electron/remote');
const { shell, ipcRenderer } = require('electron');
const $ = require('cash-dom');
const Home = require('./js/home.js');
const GetStarted = require('./js/getstarted.js');
const Details = require('./js/details.js');
const Drag = require('./js/drag.js');
const Menus = require('./js/menus.js');
const getIcon = require('./js/getIcon.js');
const fs = require('fs');
const path = require('path');
const checkForUpdates = require('./js/updates');

//Get Projects + Set ID
let contextProject = null;
let projects = DB.get('projects');
projects.map((project, i) => (project.i = i));

//On Ready Show Home or Get Started
$(() => showHome());

//Show Home
function showHome() {
	console.log(projects);
	projects.length ? Home() : GetStarted();
}

//Disable Zoom Factor + Quit
document.onkeydown = function (e) {
	if (e.key == 'Enter') $('.selected').trigger('click'); // Open selected project
	if (e.metaKey && !isNaN(e.key) && e.key != 0)
		// Open cmd + project
		$('.project')
			.eq(e.key - 1)
			.trigger('click');

	if (e.metaKey && (e.key === '=' || e.key === '-')) return false; //Cmd + -
	if (e.metaKey && e.key === 'q') remote.app.exit(); //Quit on Cmd+Q

	//Navigate projects
	if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
		let selected = $('.selected');
		let next;
		if (e.key == 'ArrowUp') next = selected.prev('.project');
		if (e.key == 'ArrowDown') next = selected.next('.project');
		if (!next.length && e.key == 'ArrowUp') next = $('.project').last();
		if (!next.length && e.key == 'ArrowDown') next = $('.project').first();
		selected.removeClass('selected');
		next.addClass('selected');
	}
};

//Set show shortcut
async function setShortcut() {
	await ipcRenderer.invoke('setShortcut', DB.get('shortcut'));
}
setShortcut();
