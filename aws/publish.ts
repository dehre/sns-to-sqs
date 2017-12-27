import { sns } from './initialize'
import { SNS } from 'aws-sdk';

// publish 'Hello World' message
export async function publish(topicArn: string): Promise<SNS.PublishResponse> {
  const publishParams: SNS.PublishInput = { 
    TopicArn : topicArn,
    Message: "Hello World" 
  }
  
  const publishResponse: SNS.PublishResponse = await sns.publish(publishParams).promise()
  return publishResponse
}