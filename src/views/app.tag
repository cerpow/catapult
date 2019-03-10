<app>
	<!-- ERROR -->
	<error if="{isError}"></error>

	<!-- NAV -->
	<nav></nav>

	<!-- PROJECTS -->
	<projects if="{projects.length&&!modal}"></projects>

	<!-- GET STARTED -->
	<getstarted if="{!projects.length&&!modal}"></getstarted>

	<!-- MODAL -->
	<editproject if="{modal}" filename="{modal.name}" path="{modal.path}"></editproject>

	<!-- SCRIPTS -->
	<script>
		this.projects = projects;
		this.modal = modal
		this.isError = isError

		//UPDATE
		this.on('update', function() {
		   this.projects = projects;
		   this.modal = modal;
		   this.isError = isError
		   update = function() {
		      this.update()
		   }.bind(this)
		});

		//MOUNT
		this.on('mount', function() {
		   this.projects = projects;
		   this.modal = modal;
		   update = function() {
		      this.update()
		   }.bind(this)
		});

		//OPEN PROJECT DIALOG
		openProjectDialog() {
		   dialog.showOpenDialog({
		      properties: ['openFile', 'openDirectory', 'createDirectory']
		   }, function(fileNames) {
		      if (!fileNames) return
		      let hasExtension = fileNames[0].split('.').length < 2;

		      modal = {
		         title: fileNames[0].split('/').pop(),
		         path: fileNames[0],
		         openIn: lastApplication || 'Finder'
		      };

		      //FOLDER
		      if (hasExtension) {
		         modal.image = './assets/icons/ico_folder.svg'
		         return riot.update();
		      }

		      //GET IMG
		      ipcRenderer.send('saveIcon', fileNames[0])
		      ipcRenderer.on('saveIconDone', (event, img) => {
		         modal.image = img
		         riot.update();
		      })

		      update();
		   });
		}
	</script>
</app>
