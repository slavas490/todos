import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Debug from 'debug'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import session from 'express-session'
import db from './utils/db'
// import favicon from 'serve-favicon'

import routes from './routes/index'

const app = express()
const debug = Debug('todos:app')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cookieParser())

// session

// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'Afwk39fja0',
  // resave: false,
  // saveUninitialized: true,
  // cookie: { secure: true }
}))

// app.use(express.static(path1.join(__dirname, 'public')))

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.json(err)
})

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err)
  process.exit(1)
})

export default app