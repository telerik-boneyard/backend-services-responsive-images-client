module.exports = {
    options: {
        livereload: true,
    },
    scripts: {
        files: ['src/js/*.js'],
        tasks: ['jshint'],
        options: {
            spawn: false,
        }
    },
    html: {
        files: ['./*.html'],
        tasks: [],
        options: {
            spawn: false
        }
    },
    css: {
        files: ['css/*.css'],
        tasks: [],
        options: {
            spawn: false,
        }
    }
};
