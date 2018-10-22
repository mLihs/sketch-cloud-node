
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sketchrssfeed: {
      data:{
        files:[
         {src: 'input/TestLib.sketch', title: 'My Mobile Lib', minVersion: '49', maxVersion: '53'},
         {src: 'input/vendo/', file: 'all'}
        ],
        options: {
          dest: 'output/',
          name: 'mySketchLib',
          url: 'https://www.martin-lihs.com/test/',
          xml: {
            lang: 'en',
            title: 'The Master Lib',
            description:'My Funky Sketch Library.',
            minVersion: '49',
            maxVersion: '53',
          }
        }
      }
    },
    watch: {
      sketchrssfeed: {
        files: ['tasks/*.js', 'input/*.sketch'],
        tasks: ['sketchrssfeed']
      }
    }
  });


  // Load Custom Plugin
  grunt.task.loadTasks('./tasks');

  // NPM Plugins
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  //grunt.registerTask('default', ['sketchrssfeed']);
  grunt.registerTask('default', ['watch']);

  // 'watch',

};