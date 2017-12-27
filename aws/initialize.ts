import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from "aws-sdk/lib/config";

// configure AWS
const { region, accessKeyId, secretAccessKey } = require('../../secret.json')
const configurationOptions: ConfigurationOptions = {
  region,
  accessKeyId,
  secretAccessKey
}
AWS.config.update(configurationOptions)


export const sns: AWS.SNS = new AWS.SNS()
export const sqs: AWS.SQS = new AWS.SQS()