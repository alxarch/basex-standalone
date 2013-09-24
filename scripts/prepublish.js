var http = require('http');
var fs = require('fs');
var basex = 'http://files.basex.org/releases/BaseX.jar';
var tagsoup = 'http://ccil.org/~cowan/XML/tagsoup/tagsoup-1.2.1.jar';

function downloadBaseX(cb){
	console.log('Downloading BaseX jar...')

	download('lib/basex.jar', basex, function(e){
		if(e){
			console.log('Failed to download BaseX!')
			console.log('org.basex.BaseX class must be available on the classpath.');
		}
		else{
			console.log('Done!')
			if(cb) cb()
		}
	})
};

function downloadTagsoup(cb){
	console.log('Downloading TagSoup jar...')
	download('lib/tagsoup.jar', tagsoup, function(e){
		if(e) 
			console.log('Failed to download TagSoup, html importing will not be available.');
		else{
			console.log('Done!')
			if(cb) cb()
		} 
	})
}

function download(filename, url, cb) {
	if(fs.existsSync(filename)) {
		if(cb) cb()
	}
	else{

		
		var file = fs.createWriteStream(filename);
		var request = http.get(url, function(response) {
		    response.pipe(file);
		   	response.on('end', function(){
				if(cb) cb()
		   	}) 
		   	response.on('error', function(e){
				if(cb) cb(e)
		   	})
		});

		request.on('error', function(e){
			if(cb) cb(e)
		})
	}

}

downloadBaseX(downloadTagsoup)