import { sqs } from './initialize'
import { SQS } from 'aws-sdk'

// get the messages and clear the pool
export async function consumeMessages(queueUrl: string): Promise<boolean> {
  const receiveParams: SQS.ReceiveMessageRequest = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
  }

  const data: SQS.ReceiveMessageResult = await sqs
    .receiveMessage(receiveParams)
    .promise()
  if (!(data && data.Messages && data.Messages.length > 0)) return false

  // do something with messages
  data.Messages.forEach((message: SQS.Message) => {
    console.log('message -->')
    console.log(message.Body)

    // Delete the message when we've successfully processed it
    var deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    }
    sqs.deleteMessage(deleteParams, () => {})
  })

  return true
}
