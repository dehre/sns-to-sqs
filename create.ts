import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk/lib/config'
import { SNS, SQS } from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';
import { Request } from 'aws-sdk/lib/request';
import { GetQueueAttributesRequest, GetQueueAttributesResult } from 'aws-sdk/clients/sqs';

// configure AWS
const { region, accessKeyId, secretAccessKey } = require('../secret.json')
const configurationOptions: ConfigurationOptions = {
  region,
  accessKeyId,
  secretAccessKey
}
AWS.config.update(configurationOptions)


const sns: SNS = new AWS.SNS()
const sqs: SQS = new AWS.SQS()


// create SNS topic
const snsTopicParams: SNS.CreateTopicInput = {
  Name: 'demo'
}
sns.createTopic(snsTopicParams, (err: AWSError, data: SNS.CreateTopicResponse): void => {
  if(err) {
    console.log(err, err.stack)
  }
  const { TopicArn } = data
  console.log(`Topic ARN --> ${TopicArn}`)
})


// create SQS queue
const sqsQueueParams: SQS.CreateQueueRequest = {
  QueueName: 'demo'
}
sqs.createQueue(sqsQueueParams, (err: AWSError, data: SQS.CreateQueueResult):void => {
  if(err) {
    console.log(err, err.stack)
  }
  const { QueueUrl } = data
  console.log(`Queue Url --> ${QueueUrl}`)
  const params: GetQueueAttributesRequest = {
    QueueUrl: QueueUrl as string,
    AttributeNames: ['QueueArn']
  }

  sqs.getQueueAttributes(params, (err: AWSError, data: GetQueueAttributesResult): void => {
    if(err){
      console.log(err)
    }
    console.log(`Queue ARN --> ${data.Attributes.QueueArn}`)
  })
})