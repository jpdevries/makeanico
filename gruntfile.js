module.exports = function(grunt) {
  var webpackConfig = require('./webpack.config.js');
  grunt.initConfig({
    dirs:{
      build:'_build/',
      theme:'./',
      lib:'./lib/',
      assets:'assets/',
      js:'./js/',
      css:'./css/',
      font:'./font/',
      img:'./img/',
      scss:'_build/scss/'
    },
    bower: {
        install: {
            options: {
                targetDir: './lib',
                layout: 'byComponent'
            }
        }
    },
    copy: {
      misc: {
        files: [{
            src: 'bourbon/**/*',
            cwd: '<%= dirs.lib %>',
            dest: '<%= dirs.scss %>',
            expand: true
        }, {
            src: 'neat/**/*',
            cwd: '<%= dirs.lib %>',
            dest: '<%= dirs.scss %>',
            expand: true
        }, {
            src: 'spec/**/*',
            cwd: '<%= dirs.lib %>spectacular',
            dest: '<%= dirs.scss %>',
            expand: true
        }, {
            src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.img %>sprite.svg',
            dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.img %>sprite.min.svg'
        },{
            src: '<%= dirs.build %><%= dirs.js %>globals.js',
            dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>globals.js'
        }]
      }
    },
    sass:{
      dev: {
				options: {
					style: 'expanded',
					compass: false,
          sourcemap: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>swatches.css': '<%= dirs.scss %>swatches.scss',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>alert.css': '<%= dirs.scss %>alert.scss',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>preferences.css': '<%= dirs.scss %>preferences.scss',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>preferences-page.css': '<%= dirs.scss %>preferences-page.scss'
				}
			}
    },
    postcss: {
      options: {
        map: false, // inline sourcemaps
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
          //require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>*.css'
      }
    },
    cssmin:{
      ship: {
        options:{
          report:'gzip'
        },
        files: {
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css',
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>swatches.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>swatches.css',
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>alert.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>alert.css',
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>preferences.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>preferences.css',
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.font %>opendyslexic/opendyslexic.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.font %>opendyslexic/opendyslexic.css',
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.font %>fira/fira.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.font %>fira/fira.css',
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>preferences-page.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>preferences-page.css',

        }
      },
    },
    svgmin: {
        options: {
            plugins: [
                {
                    removeViewBox: false
                }, {
                    removeUselessDefs: false
                }
            ]
        },
        dist: {
            files: {
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.img %>sprite.min.svg': '<%= dirs.theme %><%= dirs.assets %><%= dirs.img %>sprite.svg'
            }
        }
    },
    webpack:{
      options:webpackConfig,
      dist:{

      }
    },
    babel: {
        options: {
            sourceMap: false,
            presets: ['es2015']
        },
        dist: {
            files: {
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>init.js': '<%= dirs.build %><%= dirs.js %>init.js',
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences.js': '<%= dirs.build %><%= dirs.js %>preferences.js',
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences_listeners.js': '<%= dirs.build %><%= dirs.js %>preferences_listeners.js',
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/export.js': '<%= dirs.build %><%= dirs.js %>components/export.js',
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/shortcuts.js': '<%= dirs.build %><%= dirs.js %>components/shortcuts.js',
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences_contrastlisteners.js': '<%= dirs.build %><%= dirs.js %>preferences_contrastlisteners.js',
                '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>init_preferences.js': '<%= dirs.build %><%= dirs.js %>init_preferences.js'
            }
        }
    },
    uglify: {
      js: {
        options:{
          report:"gzip"
        },
        files: {
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.min.js': ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.js'],
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>lazylist.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>lazylist.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>globals.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>globals.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>common.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>common.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>init.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>init.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences_listeners.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences_listeners.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>init_preferences.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>init_preferences.js',

          '<%= dirs.theme %><%= dirs.assets %>serviceWorker.min.js': '<%= dirs.theme %><%= dirs.assets %>serviceWorker.js',

          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/export.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/export.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/shortcuts.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/shortcuts.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/swatches.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>components/swatches.js',
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences_contrastlisteners.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>preferences_contrastlisteners.js'
        }
      }
    },
    growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
      sass: {
          message: "Sass files created.",
          title: "grunt"
      },
      build: {
          title: "grunt",
          message: "Build complete."
      },
      watch: {
          title: "grunt",
          message: "Watching. Grunt has its eye on you."
      },
      concat: {
          title: "grunt",
          message: "JavaScript concatenated."
      },
      uglify: {
          title: "grunt",
          message: "JavaScript minified."
      }
    },
    watch: { /* trigger tasks on save */
      options: {
          livereload: true
      },
      scss: {
          options: {
              livereload: false
          },
          files: '<%= dirs.scss %>**/*.scss',
          tasks: ['sass:dev','postcss', 'cssmin', 'growl:sass']
      },
      js: {
          files: ['<%= dirs.build %><%= dirs.js %>**/*.js'],
          tasks: ['webpack', 'babel', 'uglify', 'growl:uglify']
      }
    },
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default',['growl:watch','watch']);
  grunt.registerTask('build',['bower','copy','babel','webpack','uglify','sass','postcss','cssmin','growl:build']);
};
