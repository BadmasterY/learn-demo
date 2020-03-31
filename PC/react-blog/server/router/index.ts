import Router from 'koa-router';
import Users from './user';

const router = new Router();

router.use('/user', Users);

const routes = router.routes();
export {
    routes,
}