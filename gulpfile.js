// gulpfile.js
const { src, dest, parallel, series, watch } = require('gulp');
const { deleteAsync } = require('del');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();

// ------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------
const paths = {
    src: 'src',
    dist: 'dist',

    // --- Input globs
    html: 'src/**/*.html',
    css: 'src/**/*.css',
    js: 'src/**/*.js',

    // --- Assets (everything except .html/.css/.js)
    assets: ['src/**/*', '!src/**/*.{html,css,js}'],
};

// ------------------------------------------------------------
// ---------- CLEAN ----------
function clean() {
    return deleteAsync([paths.dist]); // <-- async delete
}

// ------------------------------------------------------------
// COPY STATIC ASSETS (binary-safe)
// ------------------------------------------------------------
function copyAssets() {
    return src(paths.assets, {
        base: paths.src,
        encoding: false,
        dot: true,
    }).pipe(dest(paths.dist));
}

// ------------------------------------------------------------
// MINIFY + RENAME + RELINK
// ------------------------------------------------------------
function minifyHtml() {
    return src(paths.html, { base: paths.src })
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
            })
        )
        .pipe(dest(paths.dist));
}

function minifyCss() {
    return src(paths.css, { base: paths.src })
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.dist));
}

function minifyJs() {
    return src(paths.js, { base: paths.src })
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.dist));
}

// ------------------------------------------------------------
// RELINK HTML → .min.* files
// ------------------------------------------------------------
function relinkHtml() {
    return src(`${paths.dist}/**/*.html`)
        .pipe(
            replace(
                /(<link[^>]*href=["'].*?)\.css(["'][^>]*>)/g,
                '$1.min.css$2'
            )
        )
        .pipe(
            replace(
                /(<script[^>]*src=["'].*?)\.js(["'][^>]*><\/script>)/g,
                '$1.min.js$2'
            )
        )
        .pipe(dest(paths.dist));
}

// ------------------------------------------------------------
// SERVE / WATCH
// ------------------------------------------------------------
function serve(done) {
    browserSync.init({ server: { baseDir: paths.dist }, open: true });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    watch(paths.assets, series(copyAssets, reload));
    watch(paths.html, series(minifyHtml, relinkHtml, reload));
    watch(paths.css, series(minifyCss, relinkHtml, reload));
    watch(paths.js, series(minifyJs, relinkHtml, reload));
}

// ---------- WATCH-ONLY (no build) ----------
function watchOnly(done) {
    watch(paths.assets, series(copyAssets, reload));
    watch(
        'src/**/*.{html,css,js}',
        series(
            parallel(minifyHtml, minifyCss, minifyJs), // re-minify changed pieces
            relinkHtml,
            reload
        )
    );
    serve(done);
}

// ------------------------------------------------------------
// EXPORTED TASKS
// ------------------------------------------------------------
const build = series(
    clean,
    parallel(copyAssets, minifyHtml, minifyCss, minifyJs),
    relinkHtml
);

exports.clean = clean;
exports.copy = copyAssets;
exports.watchOnly = watchOnly;
exports.build = build;
exports.dev = series(build, serve, watchFiles);
exports.default = build;
