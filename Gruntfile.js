module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
            options: {
                separator: ';'
            },
            dist:{
                src:['src/*.js', 'node_modules/kinetic/kinetic.min.js', 'node_modules/jquery.scrollTo/jquery.scrollTo.min.js'],
                dest: 'dist/enjoyhint.js'
            },
            all: {
              src: ['node_modules/jquery/dist/jquery.min.js', 'dist/enjoyhint.js'],
              dest: 'dist/all.js',
            },
        },
        uglify: {
            main: {
                files: {
                    'dist/enjoyhint.min.js': ['<%= concat.dist.dest %>'],
                    'dist/all.min.js': ['<%= concat.all.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js'],
            options: {
                "eqnull": true,
                "globals": {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'dist/enjoyhint.css': ['src/jquery.enjoyhint.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask("default", ["concat", "uglify", "cssmin"])

};
