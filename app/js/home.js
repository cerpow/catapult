//Modules
const open = require('open');
const sortable = require('sortablejs');
let Sortable;

//Render Home Screen
async function Home() {
	let html = '';
	return new Promise((r) => {
		//Settings Icon

		//Search
		html += '<div class="projects-search">';
		html +=
			'<div class="projects-search-input-wrapper"><svg xmlns="http://www.w3.org/2000/svg" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>';
		html += '<input type="text" spellcheck="false" placeholder="Search..." autofocus>';
		html +=
			'<svg class="projects-search-reset hidden" width="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></div>';
		html +=
			'<svg class="settings" xmlns="http://www.w3.org/2000/svg" width="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>';
		html += '</div>';

		//Projects List Screen
		html += '<div class="projects">';

		//Projects
		html += renderProjects(projects);

		//End Projects
		html += '</div>';
		let projectName = projects.length > 1 ? 'Projects' : 'Project';
		html += '<footer><a href="#" class="addProject" draggable="false">New Project</a><span>' + projects.length + ' ' + projectName + '</span></footer>';

		//Render Home Screen
		$('#app').html(html);

		$('.projects-search input').trigger('focus');

		//Sort projects
		Sortable = sortable.create($('.projects')[0], {
			animation: 250,
			direction: 'vertical',
			onEnd: async function (e) {
				const movedItem = projects.filter((item, index) => index === e.oldIndex);
				const remainingItems = projects.filter((item, index) => index !== e.oldIndex);
				const reorderedItems = [...remainingItems.slice(0, e.newIndex), movedItem[0], ...remainingItems.slice(e.newIndex)];
				projects = reorderedItems;
				projects.map((project, i) => (project.i = i));
				await DB.set('projects', projects);

				//Refresh
				Home(projects);
			},
		});

		//Resolve
		r();
	});
}

//Render Projects
function renderProjects(projects) {
	let html = '';

	//Loop Projects
	projects.forEach((project, i) => {
		html += '<div class="project" openIn="' + project.openIn + '" path="' + project.path + '" i="' + project.i + '">';
		html += '<img draggable="false" src="' + project.image + '">';
		html += '<div class="project-info"><h1>' + project.title + '</h1>';
		html += '<p>' + project.openIn + '</p></div>';
		html += '<div class="project-shortcut">' + keyboardShortcut(i) + '</div>';
		html += '</div>';
	});

	//Return
	return html;
}

//Create keyboard shortcut
function keyboardShortcut(i) {
	if (i == 0) return '↩';
	if (i < 9) return '⌘' + (i + 1);
	return '';
}

//Open Projects
$('body').on('click', '.project', async (e) => {
	//Get Project Info
	let project = $(e.currentTarget);
	let path = project.attr('path');
	let openIn = project.attr('openIn');

	//If file doesn't exist
	if (!fs.existsSync(path)) return alert('File or folder was removed.');

	//Open folder or show file if Finder
	if (openIn == 'Finder') {
		//Detect if folder
		let isApp = path.split('.').pop() == 'app';
		let isFolder = isApp ? false : fs.statSync(path).isDirectory();

		//Open In Finder If Folder
		if (openIn == 'Finder' && isFolder) return shell.openPath(path);

		//Show In Finder If Not A Folder
		if (openIn == 'Finder' && !isFolder) return shell.showItemInFolder(path);
	}

	//Open app only
	if (path.split('.').pop() == 'app' && path.split('/').pop().split('.').slice(0, -1).join('.') == openIn) return openApp(path);

	//Open Project
	open(path, { app: { name: openIn } });
});

//Open app only
const { exec } = require('child_process');
function openApp(path) {
	exec('open ' + path.replaceAll(' ', '\\ '), (error) => {
		if (error) alert(error.message);
	});
}

//New Project Dialog
$('body').on('click', '.addProject', async () => {
	remote.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'createDirectory'] }).then(async (result) => {
		if (result.canceled) return;

		//Get Project Info
		let isFolder = result.filePaths[0].split('.').length < 2;
		let title = result.filePaths[0].split('/').pop();
		let path = result.filePaths[0];
		let openIn = 'Finder';

		//Get Icon
		let icon = isFolder ? './assets/icons/ico_folder.svg' : await getIcon(path);

		//Show Details Screen
		let HTML = await Details(title, path, icon, openIn, 'New');

		//Render Details Screen
		$('#app').html(HTML);

		//Focus Title
		$('.project-details-name').trigger('focus');
	});
});

//Search Projects
$('body').on('input', '.projects-search input', () => {
	//Scroll top
	window.scrollTo(0, 0);

	//Disable sort
	Sortable.option('disabled', true);

	//Search term
	const term = $('.projects-search input').val().toLowerCase();

	//Show Reset search icon
	if (term.length === 0) {
		$('.projects-search-reset').addClass('hidden');

		//Enble sort
		Sortable.option('disabled', false);
	}
	if (term.length > 0) $('.projects-search-reset').removeClass('hidden');

	//Get results
	let results = projects.filter((project) => (project.title + ' ' + project.openIn).toLowerCase().includes(term));

	//Render html
	results.length ? $('.projects').html(renderProjects(results)) : $('.projects').html('<p class="no-results">No results found...</p>');
});

//Reset search
$('body').on('click', '.projects-search-reset', () => {
	//Clear Search
	$('.projects-search input').val('').trigger('input');

	//Hide button
	$('.projects-search-reset').addClass('hidden');

	//Enble sort
	Sortable.option('disabled', false);
});

//Make search field focused on open and clear on close
window.addEventListener('focus', () => $('.projects-search input').trigger('focus'));
// window.addEventListener('blur', () => $('.projects-search input').val('').trigger('input'));

//Clear search from main
ipcRenderer.on('clearSearch', () => $('.projects-search input').val('').trigger('input'));

//Export
module.exports = Home;
