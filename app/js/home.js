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

	//Get results
	let results = projects.filter((project) => project.title.toLowerCase().includes(term));

	//Render html
	$('.projects').html(renderProjects(results));
});

//Export
module.exports = Home;
