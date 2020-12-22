// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const md5 = require('gulp-md5-assets');
const rename = require('gulp-rename');
const htmlMini = require('gulp-html-minifier');
const del = require('del');

// File paths
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    jquery: 'node_modules/jquery/dist/jquery.slim.min.js',
    popper: 'node_modules/popper.js/dist/popper.min.js',
    bootstrap_Js: './src/bootstrap/js/bootstrap.min.js'
}

// Sass task: compiles the style.scss file into style.css
function styles_Dist(){
    return src(paths.scss)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // compile SCSS to CSS
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(rename("styles.min.css"))
        .pipe(dest('dist/css')) // put final CSS in dist folder
        .pipe(browserSync.stream());
}

function styles_bootstrap(){
    return src('src/bootstrap/scss/bootstrap.scss')
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // compile SCSS to CSS
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(rename("bootstrap.min.css"))
        .pipe(dest('dist/css')) // put final CSS in dist folder
        .pipe(browserSync.stream());
}

function styles_Src(){
    return src(paths.scss)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // compile SCSS to CSS
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(rename("styles.css"))
        .pipe(dest('src/css')) // put final CSS in src folder
}

function vendor_styles(){
    return src('src/plugins/**/*.css')
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(concat("vendor.min.css"))
        .pipe(dest('dist/css')) // put final CSS in dist folder
        .pipe(browserSync.stream());
}

// JS task: concatenates and uglifies JS paths to script.js
function js(){
    return src(paths.js)
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

function vendor_js(){
    return src('src/plugins/**/*.js')
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// For Build Task
function html() {
    return src('./index.html')
        .pipe(htmlMini({collapseWhitespace: true}))
        .pipe(dest('dist'));
}

function hashCss () {
   return src("dist/css/styles.min.css")
        .pipe( md5(5,'./index.html'))
        .pipe(dest('dist/css'));
}

function hashJs () {
   return src("dist/js/scripts.min.js")
        .pipe( md5(5,'./index.html'))
        .pipe(dest('dist/js'));
}

function image_compress() {
  return src('src/images/**/*.*')
        .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.mozjpeg({quality: 75, progressive: true}),
          imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]})
        ]))
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());
}

function clean() {
  return del('./dist/**');
}
function copy_Css_files() {
  return src('./src/css/all.min.css')
        .pipe(dest('./dist/css'))
}

function copy_fonts() {
  return src('./src/webfonts/**')
        .pipe(dest('./dist/webfonts'))
}

function copy_Js_files() {
  return src([paths.jquery, paths.popper, paths.bootstrap_Js])
        .pipe(dest('./dist/js'))
}
// End Tasks of build process


// Watch task: watch SCSS and JS paths for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    browserSync.init({
      server: {
        baseDir: "./"
      }
    });

    watch("./*.html").on('change', browserSync.reload);
    watch(paths.scss, parallel(styles_Src, styles_Dist));
    watch('src/bootstrap/scss/**.*scss', styles_bootstrap);
    watch('src/plugins/**/*.css', vendor_styles);
    watch(paths.js, js);
    watch('src/plugins/**/*.js', vendor_js);
    watch('src/images/**/*.*', image_compress);

}

// Export the default Gulp task so it can be run
exports.default = series(
  clean,
  parallel(copy_fonts, copy_Css_files, copy_Js_files),
  series(styles_Src, styles_Dist, styles_bootstrap, vendor_styles),
  parallel(js, vendor_js),
  image_compress,
  watchTask
);

// Export the build gulp task so it can be return

exports.build = series(
  clean,
  parallel(copy_fonts, copy_Css_files, copy_Js_files),
  parallel(styles_Dist, styles_bootstrap, vendor_styles),
  parallel(js, vendor_js),
  image_compress,
  parallel(hashCss, hashJs, html)
);
