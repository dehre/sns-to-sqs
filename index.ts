import * as express from 'express'

const app: express.Express = express()

app.get('/', (req: express.Request, res: express.Response): void => {
  let person = {
    name: 'Bob'
  }
  res.json(person)
})

app.listen('3000', () => console.log('Server listening on port 3000'))