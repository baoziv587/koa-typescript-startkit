import * as Koa from 'koa'
import json = require('koa-json')
import compress = require('koa-compress')
import logger = require('koa-logger')
import staticServer = require('koa-static')
import * as path from 'path'
import routerFactory from './routes'
import http = require('http')
import helmet = require('koa-helmet')
import bodyParser = require('koa-bodyparser')
import convert = require('koa-convert')
import session = require('koa-generic-session');
import CSRF from 'koa-csrf'

import logMiddleWare from './middlewares/logger'
import {CSRFTokenValitor, updateCSRFToken, CSRFSettings} from './middlewares/csrf'
import sessionSettings from './middlewares/session'

const app = new Koa();
const router = routerFactory();
app.keys = ['a', 'b']

app.use(function* (next) {
    try {
        yield next;
    } catch (err) {
        this.status = 200;
        console.log(err.stack);
        this.body = {
            status: err.status || 500,
            error: err.message
        };
    }
});

/**  use middleware*/

app.use(helmet())
app.use(logMiddleWare)

/**
 * add session support 
 */

app.use(convert(session(sessionSettings)))
app.use(bodyParser())
/** 
 *  add the CSRF middleware
 */
app.use(CSRFTokenValitor)
app.use(new CSRF(sessionSettings) as any);
app.use(updateCSRFToken);

app.use(router.routes());
app.use(compress())
app.use(json({ pretty: app.env === 'development' }));

app.use(staticServer(path.join(__dirname, './../../../public'), {
    index: 'index.html'
}))

//init
app.on('error', function () {
    this.status = 200
    this.body = {
        message: 'hh'
    }
})
export = app;
