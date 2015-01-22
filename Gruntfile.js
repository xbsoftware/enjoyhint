module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        concat:{
            options: {
                separator: ';'
            },
            dist:{
                src:['src/*.js', 'lib/kinetic/kinetic.min.js'],
                dest: '<%= pkg.name %>.js'
            }
        },
        uglify: {
            main: {
                files: {
                    '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask("default", ["concat", "uglify"])

};
