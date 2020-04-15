import Router from 'koa-router';
import Users from './user';
import Article from './article';

const router = new Router();

router.use('/user', Users);
router.use('/article', Article);

const routes = router.routes();

export {
    routes,
}