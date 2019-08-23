module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            main: {
                files: {
                    '<%= pkg.name %>.min.js': './src/enjoyhint.js'
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
                    'enjoyhint.css': ['src/jquery.enjoyhint.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask("default", ["uglify", "cssmin"])

};
