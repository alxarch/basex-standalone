'use strict';

var http = require('http');
var fs = require('fs');
var basexurl = 'http://files.basex.org/releases/BaseX.jar';

function download(filename, url, cb) {
	var callback = function (e){
		if (typeof cb === 'function') {
			cb(e);
		}
	}

	if (fs.existsSync(filename)) {
		callback()
	}
	else{
		var file = fs.createWriteStream(filename);
		var request = http.get(url, function (response) {
			response.pipe(file);
			response.on('end', callback);
			response.on('error', callback);
		});

		request.on('error', callback);
	}

}

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		
		nodeunit: {
			files: ['test/**/*_test.js'],
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},
		clean: {
			files: ['tmp/*', '!tmp/basex.jar']
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			},
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');


	grunt.registerTask('basexpath', function(){
		grunt.file.mkdir('tmp/basex');
	});

	grunt.registerTask('install', function(){
		var done = this.async();
		
		download('tmp/basex.jar', basexurl, function (e){
			if (e) {
				throw e;
			}
			done();
		});
	})
	// Default task.
	grunt.registerTask('test', ['clean', 'install', 'basexpath', 'nodeunit']);
	grunt.registerTask('default', ['jshint', 'test']);
}