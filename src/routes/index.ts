import Router from 'koa-router'
import UserController from '../controllers/user.controller'

const router = new Router()
router.get('/user', UserController.getUser)

export default router
