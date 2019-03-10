<projects>
	<ul class="projects">
		<li class="project" each="{project, i in projects}" test="test" data-path="{project.path}" data-openIn="{project.openIn}" onclick="{openProject}" oncontextmenu="{showMenu}">
			<div class="project-image">
				<img src="{project.image}" alt="Icon" />
			</div>
			<div class="project-data">
				<h1>{project.title}</h1>
				<p>{project.openIn}</p>
			</div>
		</li>
	</ul>

	<footer>
		<a href="#" onclick="{openDialog}">Add Project</a>
		<span>{projects.length} Project<normal if="{projects.length>1}">s</normal></span>
	</footer>

	<script>
		this.projects = this.parent.projects;

		//SORT PROJECTS
		this.on('mount', function() {
		   update = function() {
		      this.projects = projects;
		      this.update();
		   }.bind(this)

		   let sortable = Sortable.create($('.projects')[0], {
		      animation: 250,
		      direction: 'vertical',
		      onEnd: function(evt) {

		         reorderArray({
		            newIndex: evt.newIndex,
		            oldIndex: evt.oldIndex
		         }, projects);

		         ipcRenderer.send('saveProjects', projects);
		         update();
		      },
		   });
		});



		//OPEN PROJECT
		openProject(e) {
		   let project = {
		      path: e.currentTarget.getAttribute('data-path'),
		      openIn: e.currentTarget.getAttribute('data-openIn')
		   }
		   ipcRenderer.send('openProject', project);
		}

		//SHOW CONTEXT MENU
		showMenu(e) {
		   console.log(e.item.i)
		   contextProject = {
		      i: e.item.i,
		      title: e.item.project.title,
		      path: e.item.project.path,
		      openIn: e.item.project.openIn,
		      image: e.item.project.image,
		   }
		   menuEdit.popup(remote.getCurrentWindow());
		}

		//OPEN PROJECT DIALOG
		openDialog() {
		   this.parent.openProjectDialog();
		}
	</script>
</projects>
