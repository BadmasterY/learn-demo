import Router from 'koa-router';
import Users from './user';
import Article from './article';
import Comment from './comment';

const router = new Router();

router.use('/user', Users);
router.use('/article', Article);
router.use('/comment', Comment);

const routes = router.routes();

export {
    routes,
}