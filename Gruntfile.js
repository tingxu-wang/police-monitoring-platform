/*
 * grunt 配置文件
*/

module.exports=function(grunt){
  require('load-grunt-tasks')(grunt)
  //项目配置
  grunt.initConfig({
    watch:{
      options:{
        livereload:true
      },
      express:{
        //files:['**/*.js','!src/**/*.js','!dist/**/*.js'],
        files:['routes/**/*.js','models/**/*.js','bin/**/*.js','path_index/**/*.js'],
        //files:['*.js','**/*.js'],
        tasks:['express:dev'],
        options: {
          spawn: false // Without this option specified express won't be reloaded
        }
      },
      configFiles: {
        files: [ 'Gruntfile.js' ],
        options: {
          reload: true
        }
      }
    },
    express:{
      options:{},
      dev:{
        options:{
          script:'bin/www',
          reload:true
        }
      }
    }
  })
  grunt.registerTask('default',['express:dev','watch'])
}
