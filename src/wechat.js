const request = require('request'),
  fs = require('fs'),
  path = require('path')

module.exports = (app) => {
  app.get('/wechat', (req, res, next) => {
    res.status(200).send('ip: ' + req.ip)
  })
}