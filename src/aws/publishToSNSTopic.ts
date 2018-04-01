import * as AWS from 'aws-sdk'
import { SNS, AWSError } from 'aws-sdk'
import { TConfig } from '../types'
const {
  accessKeyId,
  secretAccessKey,
  region,
  snsTopicArn,
} = require('../../config.json') as TConfig

// write AWS access credentials
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
})

const sns = new AWS.SNS()

const publishParams: SNS.Types.PublishInput = {
  TopicArn: snsTopicArn,
  Message: 'Hello There',
}
sns.publish(publishParams, publishCallback)

function publishCallback(err: AWSError, data: SNS.Types.PublishResponse): void {
  console.log('message published')
  console.log(data)
}
