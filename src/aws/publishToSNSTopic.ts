import * as AWS from 'aws-sdk'
import { SNS, AWSError } from 'aws-sdk'

// config
AWS.config.loadFromPath('./config.json')
const topicArn = 'arn:aws:sns:eu-west-1:xxxxxxxxx:xxxxx'

const sns = new AWS.SNS()

const publishParams: SNS.Types.PublishInput = {
  TopicArn: topicArn,
  Message: 'Hello There',
}
sns.publish(publishParams, publishCallback)

function publishCallback(err: AWSError, data: SNS.Types.PublishResponse): void {
  console.log('message published')
  console.log(data)
}
