//Get Started Screen
async function GetStarted() {
	let html = '';
	return new Promise((r) => {
		//Settings Icon
		html +=
			'<svg class="settings" xmlns="http://www.w3.org/2000/svg" width="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>';

		//Get Started Screen
		html += '<div class="get-started">';
		html += '<div class="get-started-image"><img draggable="false" class="ico-flower" src="./app/assets/icons/ico_flower.svg"><img draggable="false" src="./app/assets/icons/ico_file.svg"></div>';
		html += '<p>To get started, drag and drop a folder or a file here</p></div>';
		html += '<footer><a href="#" class="addProject">New Project</a></footer>';

		//Render Get Started Screen
		$('#app').html(html);

		//Resolve
		r();
	});
}

//Export
module.exports = GetStarted;
