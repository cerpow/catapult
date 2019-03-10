<editproject class="content">
	<form class="project-info" onsubmit="{saveProject}">
		<img class="project-icon" src="{image}" alt="File Icon" />
		<input type="text" size="{title.length}" placeholder="{title}" ref="input" oninput="{updateSize}" />
		<div class="project-app">
			<p onclick="{openAppDialog}">Opens in: {openIn} <img src="./assets/ico_arrow.svg" alt="Dropdown" /></p>
		</div>
	</form>

	<footer>
		<a href="#" onclick="{saveProject}">Save Project</a>
	</footer>

	<!-- SCRIPTS -->
	<script>
		this.openIn = modal.openIn
		this.title = modal.title
		this.image = modal.image

		//SET FOCUS
		this.on("update", function() {
		   this.image = modal.image
		});

		//SET FOCUS
		this.on("mount", function() {
		   this.refs.input.focus();
		});

		updateSize(e) {
		   let value = e.target.value.length
		   if (value) {
		      e.target.size = e.target.value.length
		   } else {
		      e.target.size = this.title.length
		   }

		};

		saveProject(e) {
		   e.preventDefault();
		   let project = {
		      title: this.refs.input.value || this.title,
		      path: this.opts.path,
		      openIn: this.openIn,
		      image: this.image
		   }

		   if (modal.i != undefined) {
		      projects[modal.i] = project
		   }
		   if (modal.i == undefined) {
		      projects.push(project);
		   }

		   ipcRenderer.send('saveProjects', projects);
		   ipcRenderer.send('saveLastApplication', this.openIn);

		   lastApplication = this.openIn
		   modal = false;
		   this.parent.update();
		};

		openAppDialog() {
		   dialog.showOpenDialog({
		      defaultPath: '/Applications',
		      properties: ['openFile', 'createDirectory'],
		      filters: [{
		         name: 'Applications',
		         extensions: ['app']
		      }]
		   }, function(fileNames) {
		      let app = fileNames[0].split('/').pop().replace('.app', '')
		      update(app);
		   });
		}

		update = function(data) {
		   this.update({
		      openIn: data
		   })
		}.bind(this)
	</script>
</editproject>
