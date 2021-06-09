//Get Started Screen
async function Details(title, path, icon, openIn, action) {
	let html = '';
	let trimPath = path;
	if (path.length > 28) trimPath = '...' + path.substr(path.length - 28);
	return new Promise((r) => {
		//Close Icon
		html +=
			'<svg class="close" xmlns="http://www.w3.org/2000/svg" width="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';

		//Details Screen
		html += '<p class="project-details-path" path="' + path + '">' + trimPath + '</p>';
		html += '<div class="project-details-info">';
		html += '<img class="project-details-icon" src="' + icon + '" draggable="false" alt="File Icon" />';
		html += '<input class="project-details-name"  size="' + title.length + '" alt="' + title.length + '" type="text" placeholder="' + title + '" spellcheck="false" autofocus>';
		html +=
			'<p class="project-details-openIn">Open In: <span>' +
			openIn +
			'</span> <svg xmlns="http://www.w3.org/2000/svg" width="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg></p>';
		html += '<p class="project-details-useFinder">Use Finder</p>';
		html += '</div>';
		if (action == 'Edit') html += '<footer><a href="#" class="project-edit" draggable="false">Update Project</a></footer>';
		if (action == 'New') html += '<footer><a href="#" class="project-save" draggable="false">Save Project</a></footer>';

		//Resolve
		r(html);
	});
}

//Update input size
$('body').on('input', '.project-details-name', (e) => (e.target.value.length ? (e.target.size = e.target.value.length) : (e.target.size = e.target.alt)));

//Keep input focused
$('body').on('blur', '.project-details-name', (e) => $(e.target).trigger('focus'));

//Close Details Screen
$('body').on('click', '.close', () => showHome());

//Open OpenIn Dialog
$('body').on('click', '.project-details-openIn', async () => {
	remote.dialog
		.showOpenDialog({
			defaultPath: '/Applications',
			properties: ['openFile'],
			message: 'Select Open In Application',
			filters: [
				{
					name: 'Applications',
					extensions: ['app'],
				},
			],
		})
		.then(async (result) => {
			if (result.canceled) return;

			//Replace openIn
			$('.project-details-openIn span').text(result.filePaths[0].split('/').pop().replace('.app', ''));
		});
});

//Use Finder
$('body').on('click', '.project-details-useFinder', () => $('.project-details-openIn span').text('Finder'));

//Edit Project
$('body').on('click', '.project-edit', async () => {
	//Get Project Details
	let { projectPath, projectTitle, projectIcon, projectOpenIn } = getProjectDetails();

	//Set Edit Project
	projects[contextProject] = {
		i: contextProject,
		title: projectTitle,
		path: projectPath,
		image: projectIcon,
		openIn: projectOpenIn,
	};

	//Save New Project + Last App
	saveProject(projectOpenIn);
});

//Save Project
$('body').on('click', '.project-save', async () => {
	//Get Project Details
	let { projectPath, projectTitle, projectIcon, projectOpenIn } = getProjectDetails();

	//If not a folder save new icon
	if (projectIcon.includes('base64')) {
		//Get Paths
		let userDataPath = path.join(remote.app.getPath('userData'), 'Icons');
		let savePath = path.join(userDataPath, new Date().getTime() + '.png');
		let base64 = projectIcon.replace(/^data:image\/png;base64,/, '');

		//Create Icons Folder
		if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath);

		//Save Icon PNG
		await fs.promises.writeFile(savePath, base64, { encoding: 'base64' });

		//Change Icon Path
		projectIcon = savePath;
	}

	//Set New Project
	projects.push({
		i: projects.length,
		title: projectTitle,
		path: projectPath,
		image: projectIcon,
		openIn: projectOpenIn,
	});

	//Save New Project + Last App
	saveProject(projectOpenIn);
});

//Save/Edit Project
async function saveProject(lastOpenIn) {
	//Save New Project + Last App
	await DB.set('projects', projects);
	await DB.set('lastApplication', lastOpenIn);

	//Home Screen
	let HTML = await Home(projects);

	//Render Home Screen
	$('#app').html(HTML);
}

//Get Project Details
function getProjectDetails() {
	//Get Project Details
	let projectPath = $('.project-details-path').attr('path');
	let projectTitle = $('.project-details-name').val() || $('.project-details-name').attr('placeholder');
	let projectIcon = $('.project-details-icon').attr('src');
	let projectOpenIn = $('.project-details-openIn span').text();

	return { projectPath: projectPath, projectTitle: projectTitle, projectIcon: projectIcon, projectOpenIn: projectOpenIn };
}

//Export
module.exports = Details;
