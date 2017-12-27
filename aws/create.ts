import { sns, sqs } from './initialize'
import { SNS, SQS } from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';
import { Request } from 'aws-sdk/lib/request';
import { GetQueueAttributesRequest, GetQueueAttributesResult } from 'aws-sdk/clients/sqs';
import { topicARN } from 'aws-sdk/clients/sns';


// create SNS topic by given a topic name and return Arn
export interface SNSTopicInterface {
  arn: string
}

export async function createSNSTopic(topicName: string): Promise<SNSTopicInterface | null> {
  const topicParams: SNS.CreateTopicInput = {
    Name: topicName
  }
  const topicResponse: SNS.CreateTopicResponse = await sns.createTopic(topicParams).promise()

  if(!topicResponse) return null
  return {
    arn: topicResponse.TopicArn
  }
}



// create SQS queue by given topic name and return queue Url and Arn
export interface SQSQueueInterface {
  url: string
  arn: string
}

export async function createSQSQueue(queueName: string): Promise<SQSQueueInterface | null> {
  const queueParams: SQS.CreateQueueRequest = {
    QueueName: queueName
  }
  const queueResult: SQS.CreateQueueResult  = await sqs.createQueue(queueParams).promise()

  if(!queueResult.QueueUrl) return null
  const queueAttributesParams: SQS.GetQueueAttributesRequest = {
    QueueUrl: queueResult.QueueUrl,
    AttributeNames: ['QueueArn']
  }
  const queueAttributesResult: SQS.GetQueueAttributesResult = await sqs.getQueueAttributes(queueAttributesParams).promise()

  if(!queueAttributesResult.Attributes) return null
  return {
    url: queueResult.QueueUrl,
    arn: queueAttributesResult.Attributes.QueueArn
  }
}



// enable us to publish to sqs queue
export async function subscribeSQStoSNS({snsTopicArn, sqsQueueArn}: {snsTopicArn: string, sqsQueueArn: string}): Promise<void> {
  const subscribeParams: SNS.Types.SubscribeInput = {
    TopicArn: snsTopicArn,
    Protocol: 'sqs',
    Endpoint: sqsQueueArn
  }
  
  await sns.subscribe(subscribeParams).promise()
}



// add permissions to enable sns topic to write in sqs queue
export async function updateSQSPermissions({snsTopicArn, sqsQueueUrl, sqsQueueArn}: {snsTopicArn: string, sqsQueueUrl: string, sqsQueueArn: string}): Promise<void> {
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



