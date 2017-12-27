import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk/lib/config'
import { SNS, SQS } from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';
import { Request } from 'aws-sdk/lib/request';
import { GetQueueAttributesRequest, GetQueueAttributesResult } from 'aws-sdk/clients/sqs';
import { topicARN } from 'aws-sdk/clients/sns';

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


// create SNS topic by given a topic name and return ARN
export async function createSNSTopic(topicName: string): Promise<string | null> {
  const topicParams: SNS.CreateTopicInput = {
    Name: topicName
  }
  const topicResponse: SNS.CreateTopicResponse = await sns.createTopic(topicParams).promise()

  if(!topicResponse.TopicArn) return null
  return topicResponse.TopicArn
}


// create SQS queue by given topic name and return ARN
export async function createSQSQueue(queueName: string): Promise<string | null> {
  const queueParams: SQS.CreateQueueRequest = {
    QueueName: queueName
  }
  const queueResult: SQS.CreateQueueResult  = await sqs.createQueue(queueParams).promise()

  const queueAttributesParams: SQS.GetQueueAttributesRequest = {
    QueueUrl: queueResult.QueueUrl as string,
    AttributeNames: ['QueueArn']
  }
  const queueAttributesResult: SQS.GetQueueAttributesResult = await sqs.getQueueAttributes(queueAttributesParams).promise()

  if(!queueAttributesResult.Attributes) return null
  return queueAttributesResult.Attributes.QueueArn as string
}


// enable us to publish to sqs queue
export async function subscribeSQStoSNS(snsTopicARN: string, sqsQueueARN: string): Promise<void> {
  const subscribeParams: SNS.Types.SubscribeInput = {
    TopicArn: snsTopicARN,
    Protocol: 'sqs',
    Endpoint: sqsQueueARN
  }
  
  await sns.subscribe(subscribeParams).promise()
}



