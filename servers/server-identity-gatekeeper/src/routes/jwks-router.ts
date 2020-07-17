import Router from '@koa/router';

const router = new Router({
  prefix: '/jwks'
});

router.get('/access-tokens', async (ctx) => {
  ctx.status = 200
  ctx.body = {};
});

export { router };