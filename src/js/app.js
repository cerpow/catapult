const { ipcRenderer, remote, nativeImage } = require('electron');
const { Menu, MenuItem } = remote;
const dialog = remote.dialog;
const app = remote.app;
const $ = require('jquery');
const fs = require('fs');
const Sortable = require('sortablejs');

//VARS
var projects = remote.getGlobal('projects') || [];
var lastApplication = remote.getGlobal('lastApplication');
var contextProject;
var modal = false;
var isError = false;

//RIOT
riot.mount('app');

//ERROR
ipcRenderer.on('error', (e, error) => {
	isError = {
		title: 'Failed To Open Project',
		description: error
	};
	riot.update();
});

//REORDER PROJECTS
const reorderArray = (event, originalArray) => {
	const movedItem = originalArray.filter((item, index) => index === event.oldIndex);
	const remainingItems = originalArray.filter((item, index) => index !== event.oldIndex);

	const reorderedItems = [...remainingItems.slice(0, event.newIndex), movedItem[0], ...remainingItems.slice(event.newIndex)];

	projects = reorderedItems;
};
