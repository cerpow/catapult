//Modules
const open = require('open');

//Render Home Screen
async function Home() {
	let html = '';
	return new Promise((r) => {
		//Settings Icon

		//Search
		html += '<div class="projects-search">';
		html += '<img class="project-search-icon" src="./assets/ico_search.svg">';
		html += '<input type="text" spellcheck="false" placeholder="Search...">';
		html +=
			'<svg class="projects-search-reset hidden" width="13" height="13" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.4608 0.539168C18.1797 1.25806 18.1797 2.42361 17.4608 3.1425L11.6033 9L17.4608 14.8575C18.1797 15.5764 18.1797 16.7419 17.4608 17.4608C16.7419 18.1797 15.5764 18.1797 14.8575 17.4608L9 11.6033L3.1425 17.4608C2.42361 18.1797 1.25806 18.1797 0.539167 17.4608C-0.179723 16.7419 -0.179722 15.5764 0.539168 14.8575L6.39667 9L0.539168 3.1425C-0.179722 2.42361 -0.179723 1.25806 0.539167 0.539169C1.25806 -0.179722 2.42361 -0.179722 3.1425 0.539169L9 6.39667L14.8575 0.539168C15.5764 -0.179723 16.7419 -0.179723 17.4608 0.539168Z"/></svg>';
		html += '<div class="settings"><img draggable="false" src="./assets/ico_settings.svg"></div>';
		html += '</div><hr>';

		//Projects List Screen
		html += '<div class="projects">';

		//Projects
		html += renderProjects(projects);

		//End Projects
		html += '</div>';
		let projectName = projects.length > 1 ? 'Projects' : 'Project';
		html += '<footer><a href="#" class="addProject" draggable="false">New Project</a><span>' + projects.length + ' ' + projectName + '</span></footer>';

		//Resolve
		r(html);
	});
}

//Render Projects
function renderProjects(projects) {
	let html = '';

	//Loop Projects
	projects.forEach((project) => {
		html += '<div class="project" openIn="' + project.openIn + '" path="' + project.path + '" i="' + project.i + '">';
		html += '<img draggable="false" src="' + project.image + '">';
		html += '<div class="project-info"><h1>' + project.title + '</h1>';
		html += '<p>' + project.openIn + '</p></div>';
		html += '</div>';
	});

	//Return
	return html;
}

//Open Projects
$('body').on('click', '.project', async (e) => {
	//Get Project Info
	let project = $(e.currentTarget);
	let path = project.attr('path');
	let openIn = project.attr('openIn');

	//If file doesn't exist
	if (!fs.existsSync(path)) return alert('File does not exist');

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

	//Open Project
	open(path, { app: { name: openIn } });

	//Clear Search
	$('.projects-search input').val('').trigger('input');
});

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
	//Search term
	const term = $('.projects-search input').val().toLowerCase();

	//Show Reset search icon

	if (term.length === 0) $('.projects-search-reset').addClass('hidden');
	if (term.length > 0) $('.projects-search-reset').removeClass('hidden');

	//Get results
	let results = projects.filter((project) => project.title.toLowerCase().includes(term));

	//Render html
	$('.projects').html(renderProjects(results));
});

//Reset search
$('body').on('click', '.projects-search-reset', () => {
	//Reset term
	$('.projects-search input').val('');

	//Render html
	$('.projects').html(renderProjects(projects));

	//Hide button
	$('.projects-search-reset').addClass('hidden');
});

//Export
module.exports = Home;
