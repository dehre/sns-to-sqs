import * as Router from 'koa-router'
import { publishToSns } from './aws/publishToSNSTopic'
import { readFromSQS, deleteFromSQS } from './aws/consumeFromSQSQueue'

export const router: Router = new Router()

router.get('/', ctx => {
  ctx.body = 'Hi there'
})

router.post('/publish', async ctx => {
  const { message } = ctx.request.body
  ctx.body = await publishToSns(message || 'Hello There')
})

router.get('/consume', async ctx => {
  const event = await readFromSQS()
  // Do something with event, eg. write data to DB..
  await deleteFromSQS(event)
  ctx.body = event
})
