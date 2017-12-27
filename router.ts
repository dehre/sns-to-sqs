import * as Router from 'koa-router'
import { createSNSTopic, createSQSQueue, getSQSArn, subscribeSQStoSNS, updateSQSPermissions } from './aws/create'

const router: Router = new Router()

router.get('/', ctx => {
  ctx.body = 'Hi there'
})

router.get('/create', async ctx => {
  const sqsQueueUrl = await createSQSQueue('demo')
  if(!sqsQueueUrl) throw new Error('SQS Queue Url is not available')

  const sqsQueueArn = await getSQSArn(sqsQueueUrl)
  const snsTopicArn = await createSNSTopic('demo')
  if(!(snsTopicArn && sqsQueueArn)) throw new Error('ARN is missing in SNS or SQS')

  await subscribeSQStoSNS(snsTopicArn, sqsQueueArn)
  await updateSQSPermissions(snsTopicArn, sqsQueueUrl, sqsQueueArn)

  ctx.body = {
    message: 'Setup is fine'
  }
})

export { router }