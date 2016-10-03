import Koa = require('koa')
import {includes} from 'lodash'

export const CSRFSettings = {
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  disableQuery: false
}

export const CSRFTokenValitor = (ctx: Koa.Context, next) => {
  const sid = ctx.cookies.get('sid')
  const store = ctx['session']['cookie']
  const method = ctx.method
  if (sid
    && store.csrf
    && !includes(CSRFSettings.excludedMethods, method)
    && ctx.cookies.get('csrf-token') !== store.csrf) {
    delete store.csrf
    ctx.throw('Unprocessable Entity', 422)
  }
  return next()
}

export const updateCSRFToken = (ctx: Koa.Context, next) => {
  const csrf = ctx['csrf']
  ctx.cookies.set('csrf-token', csrf)
  ctx['session']['cookie']['csrf'] = csrf
  return next();
}