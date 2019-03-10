<error>
	<div class="error-data">
		<h1>{title}</h1>
		<p>{description}</p>
	</div>
	<a href="#" onclick="{closeError}">Ok</a>

	<script>
		this.title = isError.title;
		this.description = isError.description;

		//UPDATE
		this.on('update', function() {
		   this.title = isError.title;
		   this.description = isError.description;
		});

		//CLOSE ERROR
		closeError() {
		   isError = false;
		   this.parent.update();
		}
	</script>
</error>
