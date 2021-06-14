//Modules
const { Menu, nativeTheme } = remote;

//Create Settings Menu
const theme = DB.get('theme');
const settingsMenu = Menu.buildFromTemplate([
	{
		label: 'Catapult v' + remote.app.getVersion(),
		type: 'normal',
		enabled: false,
	},
	{ type: 'separator' },
	{
		label: 'Delete all projects',
		type: 'normal',
		click() {
			//Remove all projects
			projects = [];
			DB.set('projects', projects);

			//Refresh Home Page
			showHome();
		},
	},
	{
		label: 'Launch at login',
		type: 'checkbox',
		checked: DB.get('openAtLogin'),
		click(e) {
			try {
				//Get app settings
				let { openAtLogin } = remote.app.getLoginItemSettings();

				//Set open at login setting
				remote.app.setLoginItemSettings({ openAtLogin: !openAtLogin });

				//Save to db
				DB.set('openAtLogin', !openAtLogin);

				//Update checkbox
				e.checked = !openAtLogin;
			} catch (err) {
				console.log(err);
				alert(err);
				e.checked = DB.get('openAtLogin');
			}
		},
	},
	{
		label: 'Theme',
		type: 'submenu',
		submenu: [
			{
				label: 'Dark',
				checked: theme == 'dark',
				type: 'radio',
				click() {
					DB.set('theme', 'dark');
					nativeTheme.themeSource = 'dark';
				},
			},
			{
				label: 'Light',
				checked: theme == 'light',
				type: 'radio',
				click() {
					DB.set('theme', 'light');
					nativeTheme.themeSource = 'light';
				},
			},
			{
				label: 'System',
				checked: theme == 'system',
				type: 'radio',
				click() {
					DB.set('theme', 'system');
					nativeTheme.themeSource = 'system';
				},
			},
		],
	},
	{ type: 'separator' },
	{
		label: 'Check for updates',
		type: 'normal',
		click() {
			checkForUpdates(true);
		},
	},
	{
		label: 'Buy me a coffee',
		type: 'normal',
		click() {
			shell.openExternal('https://www.buymeacoffee.com/catapult');
		},
	},
	{
		label: 'Support',
		type: 'normal',
		click() {
			shell.openExternal('mailto:cerpow@gmail.com');
		},
	},
	{ type: 'separator' },
	{
		label: 'Quit Catapult',
		accelerator: 'Command+Q',
		click() {
			remote.app.exit();
		},
	},
]);

//Show Settings Menu
$('body').on('click contextmenu', '.settings', () => settingsMenu.popup({ window: remote.getCurrentWindow() }));

//Create Edit Menu
const editMenu = Menu.buildFromTemplate([
	{
		label: 'Edit',
		type: 'normal',
		async click() {
			//Show Details Screen
			let project = projects[contextProject];
			let HTML = await Details(project.title, project.path, project.image, project.openIn, 'Edit');

			//Render Details Screen
			$('#app').html(HTML);

			//Set title value
			$('.project-details-name').attr('value', project.title);

			//Focus title
			$('.project-details-name').trigger('focus');

			//Move cursor at end
			$('.project-details-name')[0].setSelectionRange(project.title.length, project.title.length);
		},
	},
	{
		label: 'Delete',
		accelerator: 'Command+Q',
		async click() {
			//Delete Image
			const image = projects[contextProject].image;
			const hasImage = !image.includes('ico_folder');

			//Remove image
			try {
				if (hasImage) await fs.promises.unlink(image);
			} catch (e) {
				console.log('Image file already cleaned');
			}

			//Delete project
			projects.splice(contextProject, 1);
			projects.map((project, i) => (project.i = i));
			DB.set('projects', projects);

			//Refresh Home Page
			showHome();
		},
	},
]);

//Show Project Edit Menu
$('body').on('contextmenu', '.project', (e) => {
	//Get Target
	contextProject = parseInt($(e.currentTarget).attr('i'));

	//Show Context Menu
	editMenu.popup({ window: remote.getCurrentWindow() });
});
