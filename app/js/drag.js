//On Drag Over
let lastenter;

// //On Drag Enter
$(document).on('dragenter', (e) => {
	e.preventDefault();
	if (e.originalEvent.dataTransfer.effectAllowed === 'move') return; //Fix sortable
	lastenter = e.target;
	$('.drag').show();
});

// //On Drag Enter
$(document).on('dragover', (e) => e.preventDefault());

//On Drag Leave
$(document).on('dragleave', (e) => {
	e.preventDefault();
	if (lastenter === e.target) $('.drag').hide();
});

//On Drop
$(document).on('drop', async function (e) {
	e.preventDefault();
	let file = e.originalEvent.dataTransfer.files[0];
	if (!file) return;

	//Is Folder
	let isApp = file.path.split('.').pop() == 'app';
	let isFolder = isApp ? false : fs.statSync(file.path).isDirectory();

	//Hide Blue Border
	$('.drag').hide();

	//Get Icon
	let icon = isFolder ? './assets/icons/ico_folder.svg' : await getIcon(file.path);

	//Show Details Screen
	let HTML = await Details(file.name, file.path, icon, DB.get('lastApplication'), 'New');

	//Render Details Screen
	$('#app').html(HTML);

	//Focus Title
	$('.project-details-name').trigger('focus');
});
