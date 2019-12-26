module.exports = (app) => {
  app.get('/wechat/notify', (req, res, next) => {
    console.log('notifying')
    console.log(req.body.xml)
  })
}