const express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  http = require('http'),
  port = 10001,
  app = express(),
  router = express.Router()

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cors())

const wechat = require('./wechat')(app),
  wechat_notify = require('./wechat_notify')(app)

router.use((req, res, next) => {
  next()
})

router.get('/', (req, res, next) => {
  console.log(req.query)
})


// REGISTER ROUTES
// =============================================================================
app.use('/', router)

// START THE SERVER
// =============================================================================
var server = app.listen(port)
server.timeout = 1000 * 60 * 30
// console.log('Environmental variables: ', process.env)
console.log('Server running on port ' + port)
console.log('=====================================')
