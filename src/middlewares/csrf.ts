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



export const updateCSRFToken = (ctx: Koa.Context, next) => {
  const csrf = ctx['csrf']
  ctx.cookies.set('csrf-token', csrf)
  return next();
}