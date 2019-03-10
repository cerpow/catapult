// SETTINGS MENU
const menu = new Menu();
menu.append(
	new MenuItem({
		label: 'Delete All Projects',
		click() {
			for (const project of projects) {
				try {
					fs.unlinkSync(project.image);
				} catch (err) {
					console.error(err);
				}
			}
			projects = [];
			ipcRenderer.send('deleteProjects');
			riot.update();
		}
	})
);
menu.append(
	new MenuItem({
		label: 'Pixroad.com',
		click() {
			ipcRenderer.send('openProject', { path: 'https://www.pixroad.com' });
		}
	})
);
menu.append(
	new MenuItem({
		label: 'Feedback',
		click() {
			window.location.href = 'mailto:cerpow@gmail.com';
		}
	})
);
menu.append(new MenuItem({ type: 'separator' }));
menu.append(
	new MenuItem({
		label: 'Quit Catapult',
		click: () => {
			remote.app.quit();
		}
	})
);

// EDIT MENU
const menuEdit = new Menu();
menuEdit.append(
	new MenuItem({
		label: 'Edit',
		click() {
			modal = {
				i: contextProject.i,
				title: contextProject.title,
				openIn: contextProject.openIn,
				path: contextProject.path,
				image: contextProject.image
			};
			riot.update();
		}
	})
);
menuEdit.append(
	new MenuItem({
		label: 'Delete',
		click() {
			let hasExtension = contextProject.path.split('.').length > 1;
			if (hasExtension) {
				try {
					fs.unlinkSync(contextProject.image);
				} catch (err) {
					console.error(err);
				}
			}
			projects.splice(contextProject.i, 1);
			ipcRenderer.send('saveProjects', projects);
			riot.update();
		}
	})
);
