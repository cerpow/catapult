//ON DRAG OVER
$(document).on('dragover', function(e) {
	e.preventDefault();
	if (e.originalEvent.dataTransfer.effectAllowed === 'move') return;
	$('body').addClass('dragOver');
	$('getstarted img').attr('src', './assets/getstarted_drag.svg');
});

//ON DRAG LEAVE
$(document).on('dragleave', function(e) {
	e.preventDefault();
	if (e.originalEvent.dataTransfer.effectAllowed === 'move') return;
	$('body').removeClass('dragOver');
	$('getstarted img').attr('src', './assets/getstarted.svg');
	return;
});

//ON DROP
$(document).on('drop', function(e) {
	e.preventDefault();
	let file = e.originalEvent.dataTransfer.files[0];
	if (!file) return;

	let hasExtension = file.path.split('.').length < 2;
	$('body').removeClass('dragOver');

	//MODAL
	modal = {
		title: file.name,
		path: file.path,
		openIn: lastApplication || 'Finder'
	};

	//FOLDER
	if (hasExtension) {
		modal.image = './assets/icons/ico_folder.svg';
		return riot.update();
	}

	//GET IMG
	ipcRenderer.send('saveIcon', file.path);
	ipcRenderer.on('saveIconDone', (event, img) => {
		modal.image = img;
		riot.update();
	});
});
