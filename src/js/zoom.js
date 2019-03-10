// DISABLE ZOOM
var keys = {
	cmd: false,
	plus: false,
	minus: false
};

// SET KEY PRESSED
$(document.body).keydown(function(e) {
	if (e.which == '91') {
		//CMD
		keys['cmd'] = true;
	}

	if (e.which == '189') {
		//PLUS
		keys['plus'] = true;
	}

	if (e.which == '187') {
		//MINUS
		keys['minus'] = true;
	}

	if ((keys['cmd'] && keys['plus']) || (keys['cmd'] && keys['minus'])) {
		//BLOCK
		e.preventDefault();
	}
});

// RESET KEY PRESSED
$(document.body).keyup(function(e) {
	if (e.which == '91' || e.which == '189' || e.which == '187') {
		keys['cmd'] = false;
		keys['plus'] = false;
		keys['minus'] = false;
	}
});
