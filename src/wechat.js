const request = require('request'),
  fs = require('fs'),
  path = require('path')

module.exports = (app) => {
  app.get('/wechat', (req, res, next) => {
    console.log('ip: ' + req.ip)

    res.status(200).send('this is wechat')
  })
}