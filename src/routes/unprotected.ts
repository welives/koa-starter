import Router from 'koa-router'
import { generalController } from '../controllers/general.ctrl'

const unprotectedRouter = new Router()
unprotectedRouter.get('/', generalController.hello)

export { unprotectedRouter }
