//Settings DB
const Store = require('electron-store');
const DB = new Store({ defaults: { launchAtLogin: false, lastApplication: 'Finder', projects: [], theme: 'system' } });

//Modules
const remote = require('@electron/remote');
const { shell } = require('electron');
const $ = require('jquery');
const Home = require('./js/home.js');
const GetStarted = require('./js/getstarted.js');
const Details = require('./js/details.js');
const Drag = require('./js/drag.js');
const Menus = require('./js/menus.js');
const getIcon = require('./js/getIcon.js');
const fs = require('fs');
const path = require('path');

//Set Dark Mode
remote.nativeTheme.themeSource = DB.get('theme');

//Get Projects + Set ID
let contextProject = null;
let projects = DB.get('projects');
projects.map((project, i) => (project.i = i));

//On Ready Show Home or Get Started
$(() => showHome());

//Show Home
function showHome() {
	projects.length ? Home(projects) : GetStarted();
}

//Disable Zoom Factor
document.onkeydown = function (e) {
	if (e.metaKey && (e.keyCode === 187 || e.keyCode === 189)) return false;
};
