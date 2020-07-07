const gulp = require('gulp');
const babel = require('gulp-babel');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const argv = require('yargs').argv;
const webpackConfig = require('./webpack.config');

const argHost = argv.host || 'localhost';
const argPort = argv.port || 4000;
const webpackPort = argPort + 1;
const proxyPort = argPort;
const hangerStore = { data: null };

gulp.task('build-webpack', callback => {
    webpack(webpackConfig('production'), (err, stats) => {
        if (err) {
            throw Error('build-webpack', err);
        }
        if (stats.hasErrors()) {
            throw Error('Compile errors have occurred.');
        }
        callback();
    });
});

gulp.task('dev-webpack', () => {
    const config = webpackConfig('development');
    DevServer.addDevServerEntrypoints(config, {
        ...config.devServer,
        host: 'localhost',
    });
    const compiler = webpack(config);
    const server = new DevServer(compiler, config.devServer);
    server.listen(webpackPort, 'localhost', err => {
        if (err) {
            throw err;
        }
        console.log('Dev server is running.');
    });
});


gulp.task('run-proxy', () => {
    const webpackProxy = httpProxy.createProxyServer({
        target: {
            host: 'localhost',
            port: webpackPort,
        },
    });
    webpackProxy.on('error', err => {
        console.log('[run-proxy]', `Error on Webpack proxy.`, err);
    });

    const app = express();

    // Run "Hanger" server for test.

    app.use(bodyParser.text());
    app.post('/hanger/open/', (req, res) => {
        res.send('vuepythonpadrunner');
    });

    app.post('/hanger/vuepythonpadrunner/write/', (req, res) => {
        hangerStore.data = req.body;
        res.send('vuepythonpadrunner');
    });

    app.post('/hanger/vuepythonpadrunner/read/', (req, res) => {
        const respond = () => {
            if (hangerStore.data !== null) {   
                res.send(hangerStore.data);
                hangerStore.data = null;
            } else {
                setTimeout(() => respond(), 1000);
            }
        };
        respond();
    });

    app.get('/hanger/sleep/', (req, res) => {
        const duration = req.query.duration;
        setTimeout(() => res.send(duration), duration * 1000);
    });

    app.all('/*', (req, res) => {
        webpackProxy.web(req, res);
    });

    const server = http.createServer(app);
    server.listen(proxyPort);
});

gulp.task('dev', gulp.parallel('run-proxy', 'dev-webpack'));
gulp.task('build', gulp.parallel('build-webpack'));