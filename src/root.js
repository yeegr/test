import index from './index.html'
import icons from './0.jpg'
import i1 from './1.jpg'
import i2 from './2.jpg'
import i3 from './3.jpg'
import i4 from './4.jpg'
import i5 from './5.jpg'
import i6 from './6.jpg'
import success from './success.html'
import z from './z.png'

const express = require('express'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  http = require('http'),
  port = 80,
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

app.use(express.static('./dev/static'))

const wechat = require('./wechat')(app)

router.use((req, res, next) => {
  next()
})

router.get('/', (req, res, next) => {
  console.log('router')
  console.log(req.query)
})

app.get('/', (req, res) => {
  console.log('get static file')
  res.sendFile('./dev/static/index.html', {
    root: __dirname
  })
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
