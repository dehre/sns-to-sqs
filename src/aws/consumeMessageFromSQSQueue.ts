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

const receiveMessageParams: SQS.Types.ReceiveMessageRequest = {
  QueueUrl: sqsQueueUrl,
}
sqs.receiveMessage(receiveMessageParams, receiveMessageCallback)

function receiveMessageCallback(
  err: AWSError,
  data: SQS.Types.ReceiveMessageResult
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
  data: SQS.Types.ReceiveMessageResult
): void {
  console.log('message deleted')
  console.log(data)
}
