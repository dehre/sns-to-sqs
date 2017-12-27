import * as Router from 'koa-router'
import { createSNSTopic, createSQSQueue } from './create'

const router: Router = new Router()

router.get('/', ctx => {
  ctx.body = 'Hi there'
})

router.get('/create', async ctx => {
  const snsTopicArn = await createSNSTopic('demo')
  const sqsQueueArn = await createSQSQueue('demo')
  ctx.body = {
    snsTopicArn,
    sqsQueueArn
  }
})

export { router }