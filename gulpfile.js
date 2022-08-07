const { src, dest, parallel, series, watch } = require("gulp");

const browserSync = require("browser-sync").create();
const ssi = require("browsersync-ssi");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;

const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const del = require("del");


function browsersync() {
    browserSync.init({
        proxy: "todo-list/app",
        notify: false,
        online: true,
        //tunnel: true
    });
}

function startwatch() {
    watch(["app/**/*.js", "!app/**/*.min.js"], scripts);
    watch("app/styles/*.sass", styles);
    watch("app/*.html").on("change", browserSync.reload);
}

function scripts() {
    return src([
        //Node
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.js",
        "app/scripts/router.js",
        "app/scripts/app.js"
    ])
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(dest("app/scripts/"))
        .pipe(browserSync.stream());
}

function styles() {
    return src([
        "node_modules/bootstrap/scss/bootstrap.scss",
        "app/styles/main.sass",
    ])
        .pipe(eval("sass")())
        .pipe(concat("app.min.css"))
        .pipe(
            autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
        )
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(dest("app/styles/css/"))
        .pipe(browserSync.stream());
}

function cleandist() {
    return del("build/**/*", { force: true });
}
function cleanstyles() {
    return del("app/styles/css/app.min.css", { force: true });
}
function cleanscripts() {
    return del("app/scripts/app.min.js", { force: true });
}


function buildcopy() {
    return src([
        "app/styles/css/app.min.css",
        "app/scripts/app.min.js",
        "app/index.html",
    ], { base: "app" }).pipe(dest("dist"));
}

exports.build = series(
    cleandist,
    cleanstyles,
    cleanscripts,
    parallel(scripts, styles),
    buildcopy
);
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;

exports.watch = series(
    cleanstyles,
    cleanscripts,
    parallel(scripts, styles),
    parallel(browsersync, startwatch)
);




