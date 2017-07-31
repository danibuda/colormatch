function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    // FileList object
    var files = (evt.type == 'change') ? evt.target.files : evt.dataTransfer.files;
    renderFiles(files);
}
function renderFiles(files){
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        progress.style.width = '0%';
        progress.textContent = '0%';
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        reader.onerror = errorHandler;
        reader.onprogress = updateProgress;
        reader.onabort = function(e) {
        alert('File read cancelled');
        };
        reader.onloadstart = function(e) {
        document.getElementById('progress_bar').className = 'loading';
        };
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement('span');
                    console.log(e.target);
                var api = resemble(e.target.result).onComplete(function(data){
                });
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'].join('');

                var drag_and_drop = document.getElementById('drag_drop');
                if(drag_and_drop != null){
                    document.getElementById('drag_drop').style.display = "none";
                }
                document.getElementById('list').insertBefore(span, null);
                progress.style.width = '100%';
                progress.textContent = '100%';
                setTimeout("document.getElementById('progress_bar').style.display = \"none\"", 6000);
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function abortRead() {
    reader.abort();
}
function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
}
function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        // progress.style.width = percentLoaded + '%';
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
}
function split(){
	var t = Date.now();
	var img = new Image();
	var length = 30;
	var ylength = 20;
	img.onload = function() {
		var width = this.width,
			height = this.height,
			_length = -length,
			i, j;

		// create a <div/> with all basic characteristics, to be cloned over and over in the loops below.
		var $basicDiv = jQuery('<div/>', {
			class: 'splitImg',
			css: {
				'width': Math.floor(width/length),
				'height': Math.floor(height/ylength),
				'background-image': 'url(' + img.src + ')'
			}
		});
		// Finding a node in the DOM is slow. Do it once and assign the returned jQuery collection.
		// Also, #wrapper's width can be set here.
		var $wrapper = $('#wrapper').width(width + length * 2); 
		
		for (i = 0; i > _length; i--) {
			for (j = 0; j > _length; j--) {
				$basicDiv.clone().css({'background-position': `${width/length * j}px ${height/ylength * i}px`}).appendTo($wrapper);
			}
		}
		console.log(Date.now() - t);
	}
	img.src = 'http://www.jqueryscript.net/images/Simplest-Responsive-jQuery-Image-Lightbox-Plugin-simple-lightbox.jpg';
}


if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
}
var reader;
var progress = document.querySelector('#percent');
// Setup the dnd listeners.
document.getElementById('upload').addEventListener('change', handleFileSelect, false);
document.getElementById('upload_button').onclick = function() {
    document.getElementById('upload').click();
};


// var dropZone = document.getElementById('drop_zone_outer');
// dropZone.addEventListener('dragover', handleDragOver, false);
// dropZone.addEventListener('drop', handleFileSelect, false)