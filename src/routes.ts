import * as Router from 'koa-router';
import { home } from './controllers/home';

export default function (): Router {
  var router = new Router();

  /**
   * Routes
   */
  router.get('/', home);
  router.get('/c', home)
  router.get('/err', async (ctx) => {throw new Error('invalid')})
  return router;
}

