import * as Router from 'koa-router'
import { createSNSTopic, createSQSQueue, getSQSArn, subscribeSQStoSNS, updateSQSPermissions } from './create'

const router: Router = new Router()

router.get('/', ctx => {
  ctx.body = 'Hi there'
})

router.get('/create', async ctx => {
  const sqsQueueUrl = await createSQSQueue('demo')
  if(!sqsQueueUrl) throw new Error('Cannot set up SQS Queue')

  const sqsQueueArn = await getSQSArn(sqsQueueUrl)
  const snsTopicArn = await createSNSTopic('demo')
  if(!(snsTopicArn && sqsQueueArn)) throw new Error('Cannot set up SNS Topic')

  await subscribeSQStoSNS(snsTopicArn, sqsQueueArn)
  await updateSQSPermissions(snsTopicArn, sqsQueueUrl, sqsQueueArn)

  ctx.body = {
    message: 'setup is fine'
  }
})

export { router }