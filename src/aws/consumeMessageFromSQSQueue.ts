import * as AWS from 'aws-sdk'
import { AWSError, SQS } from 'aws-sdk'
import { TConfig } from '../types'
const {
  accessKeyId,
  secretAccessKey,
  region,
  sqsQueueUrl,
} = require('../../config.json') as TConfig

// write AWS access credentials
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
})
const sqs = new AWS.SQS()

export async function readFromSQS() {
  const receiveMessageParams: SQS.ReceiveMessageRequest = {
    QueueUrl: sqsQueueUrl,
  }
  console.log('read-event')
  return sqs.receiveMessage(receiveMessageParams).promise()
}

export async function deleteFromSQS(event: SQS.ReceiveMessageResult) {
  if (event.Messages && event.Messages.length) {
    const deleteMessageParams: SQS.DeleteMessageRequest = {
      QueueUrl: sqsQueueUrl,
      ReceiptHandle: event.Messages[0].ReceiptHandle,
    }
    console.log('delete-event')
    return sqs.deleteMessage(deleteMessageParams).promise()
  }
}

/*
// CALLBACK VERSION


const receiveMessageParams: SQS.ReceiveMessageRequest = {
  QueueUrl: sqsQueueUrl,
}
sqs.receiveMessage(receiveMessageParams, receiveMessageCallback)

function receiveMessageCallback(
  err: AWSError,
  data: SQS.ReceiveMessageResult
): void {
  console.log('Received message')
  console.log(data)

  if (data.Messages && data.Messages.length) {
    console.log('Do something with message, eg. write data to DB')

    const deleteMessageParams = {
      QueueUrl: sqsQueueUrl,
      ReceiptHandle: data.Messages[0].ReceiptHandle,
    }
    sqs.deleteMessage(deleteMessageParams, deleteMessageCallback)
  }
}

function deleteMessageCallback(
  err: AWSError,
  data: SQS.ReceiveMessageResult
): void {
  console.log('message deleted')
  console.log(data)
}

*/
