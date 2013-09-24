'use strict';

module.exports = function(grunt) {
  var ident = grunt.util._.identity
  // Project configuration.
  grunt.initConfig({
    curl: {
      basex:{
        src: 'http://files.basex.org/releases/BaseX.jar'
      , dest: 'lib/basex.jar'
      }
    , tagsoup:{
        src: 'http://ccil.org/~cowan/XML/tagsoup/tagsoup-1.2.1.jar'
      , dest: 'lib/tagsoup.jar'
      }
    },
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
      files: ['tmp/*', '!tmp/basex', 'tmp/basex/*']
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
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.file.mkdir('tmp/basex')

  var getbasex = !grunt.file.isFile('lib/basex.jar')
    , gettagsoup = !grunt.file.isFile('lib/tagsoup.jar')
    , testTasks = [ 
      getbasex && 'curl:basex', 
      gettagsoup && 'curl:tagsoup', 
      'clean', 
      'nodeunit'
    ].filter(ident)

  grunt.registerTask('test', 'Runs tests', testTasks)

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('prepublish', ['curl:basex', 'curl:tagsoup']);
}