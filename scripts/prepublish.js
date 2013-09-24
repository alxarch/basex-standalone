var http = require('http');
var fs = require('fs');
var Q = require('Q');

function download(filename, url, msg) {
	var def = Q.defer();
	var file = fs.createWriteStream(filename);
	console.log(msg)
	var request = http.get(url, function(response) {
	    response.pipe(file);
	   	response.on('end', function(){
	   		def.resolve()
	   	}) 
	   	response.on('error', function(e){
	   		def.reject(e)
	   	})
	});

	request.on('error', function(e){
		def.reject(e)
	})

	return def.promise;
}

Q.all([
	download('lib/basex.jar', 'http://files.basex.org/releases/BaseX.jar', 'Downloading latest BaseX jar.'),
	download('lib/tagsoup.jar', 'http://ccil.org/~cowan/XML/tagsoup/tagsoup-1.2.1.jar', 'Downloading TagSoup jar.')
])
.fail(function(){
	console.log('Failed to download latest BaseX jar. Try to run `npm install` again later.')
})
.then(function(){
	console.log('Done!')
})
.done();