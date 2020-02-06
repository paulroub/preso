const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const { Liquid } = require('liquidjs');
const indexRouter = require('./routes/index');
const gitRouter = require('./routes/git');
const presRouter = require('./routes/pres');

const engine = new Liquid();
const app = express();

engine.registerFilter('json', (thing) => {
    return JSON.stringify(thing);
});
app.set('view engine', 'liquid');
app.engine('liquid', engine.express());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/git', gitRouter);
app.use('/pres', presRouter);

module.exports = app;
