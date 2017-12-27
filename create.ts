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


// create SQS queue by given topic name and returns queue Url
export async function createSQSQueue(queueName: string): Promise<string | null> {
  const queueParams: SQS.CreateQueueRequest = {
    QueueName: queueName
  }
  const queueResult: SQS.CreateQueueResult  = await sqs.createQueue(queueParams).promise()

  if(!queueResult.QueueUrl) return null
  return queueResult.QueueUrl
}


// receives queue url and return its ARN
export async function getSQSArn(queueUrl: string): Promise<string | null> {
  const queueAttributesParams: SQS.GetQueueAttributesRequest = {
    QueueUrl: queueUrl,
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


// add permissions to enable sns topic to write in sqs queue
export async function updateSQSPermissions(snsTopicArn: string, sqsQueueUrl: string, sqsQueueArn: string): Promise<void> {
  const attributes = {
    'Version': '2012-10-17',
    'Id': sqsQueueArn + '/SQSDefaultPolicy',
    'Statement': [{
      'Sid': 'Sid' + new Date().getTime(),
      'Effect': 'Allow',
      'Principal': {
        'AWS': '*'
      },
      'Action': 'SQS:SendMessage',
      'Resource': sqsQueueArn,
      'Condition': {
        'ArnEquals': {
          'aws:SourceArn': snsTopicArn
        }
      }
    }]
  }
  const params: SQS.SetQueueAttributesRequest = {
    QueueUrl: sqsQueueUrl,
    Attributes: {
      'Policy': JSON.stringify(attributes)
    }
  }

 await sqs.setQueueAttributes(params)
}



