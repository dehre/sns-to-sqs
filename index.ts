import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { router } from './router'

const app: Koa = new Koa()


// error handler
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(err){
    ctx.status = err.status || 500
    ctx.body = {
      status: err.status || 500,
      errorMessage: err.message || `Internal Server Error`
    }
    // disable error logs when testing
    if(process.env.NODE_ENV !== 'test'){
      console.log(`Server Error --> ${err}`);
    }
  }
})

app.use(bodyParser())
app.use(router.routes())

const PORT: number = 3000
app.listen(PORT)
console.log(`Server listening on port ${PORT}`)