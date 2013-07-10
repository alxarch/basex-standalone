'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    curl: {
      basex:{
        src: 'http://files.basex.org/releases/BaseX.jar'
      , dest: 'tmp/basex.jar'
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
      files: ['tmp/*', '!tmp/basex.jar', '!tmp/basex', 'tmp/basex/*']
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

  var jar = grunt.file.isFile('tmp/basex.jar')
    , testTasks = [ jar ? undefined : 'curl:basex', 'clean', 'nodeunit'].filter(function(t){ return t })

  grunt.registerTask('test', 'Runs tests', testTasks)

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);

}