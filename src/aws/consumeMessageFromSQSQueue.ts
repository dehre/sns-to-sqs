import * as AWS from 'aws-sdk'
import { AWSError, SQS } from 'aws-sdk'

// config
AWS.config.loadFromPath('./config.json')
const queueUrl = 'https://sqs.eu-west-1.amazonaws.com/xxxxxxxxx/xxxxx'

const sqs = new AWS.SQS()

const receiveMessageParams: SQS.Types.ReceiveMessageRequest = {
  QueueUrl: queueUrl,
}
sqs.receiveMessage(receiveMessageParams, receiveMessageCallback)

function receiveMessageCallback(
  err: AWSError,
  data: SQS.Types.ReceiveMessageResult
): void {
  console.log('Received message')
  console.log(data)

  if (data.Messages && data.Messages.length) {
    console.log('Do something with message, eg. write to DB')

    const deleteMessageParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: data.Messages[0].ReceiptHandle,
    }
    sqs.deleteMessage(deleteMessageParams, deleteMessageCallback)
  }
}

function deleteMessageCallback(
  err: AWSError,
  data: SQS.Types.ReceiveMessageResult
): void {
  console.log('message deleted')
  console.log(data)
}
