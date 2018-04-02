import { argv } from 'yargs'
import { publishToSns } from './aws/publishToSNSTopic'
import { readFromSQS, deleteFromSQS } from './aws/consumeFromSQSQueue'

const run = async () => {
  switch (argv.action) {
    case 'publish':
      console.log(`Start publishing new event..\n`)
      const result = await publishToSns(argv.message || 'Hello There')
      console.log(result)
      break
    case 'consume':
      console.log(`Start consuming last event..\n`)
      const event = await readFromSQS()
      await deleteFromSQS(event)
      console.log(event)
      break
    default:
      console.error('Not valid action provided!')
      process.exit(0)
  }
}

run()
