const request = require('request'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5')

module.exports = (app) => {
  app.get('/wechat', (req, res, next) => {
    let options = {
      url: WXPAY.URL,
      method: 'POST',
      body: WXPAY.buildXML(WXPAY.buildOptions('114.243.34.99' || req.ip, 1))
    }

    console.log('before sending to wechat')
    console.log(options.body)

    sendToWeChat(options, (err, data) => {
      if (!err) {
        res.status(200).send(data)
      } else {
        res.status(500).send(err)
      }
    })
  })
}

function sendToWeChat(options, callback) {
  request(options, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      console.log('after sending to wechat')
      console.log(body)

      // let result = JSON.stringify(JSON.parse(body))
      return callback(null, body)
    } else {
      return callback(err, null)
    }
  })
}

const WXPAY = {
  APP_ID: 'wx63ebcb09dd2f6e6a',
  APP_SECRET: 'Woailexuexizaixianyingyujiaoyu20',
  MCH_ID: '1436091002',
  BODY: '微信测试支付',
  SCENE_INFO: '{"h5_info":{"type":"Wap","wap_url":"https://39.97.182.211/","wap_name":"微信支付测试"}}',
  URL: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
  NOTIFY_URL: 'https://39.97.182.211/wechat/notify',
  DEVICE_INFO: 'WEB',
  TRADE_TYPE: 'MWEB',

  MAX_NONCE_STRING_LENGTH: 32,

  isNumeric: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  },

  randomstring: function() {
    let length = 10,
      str = ''

    if (arguments && this.isNumeric(arguments[0])) {
      length = arguments[0]
    }

    let repeat = Math.ceil(length / 10)
    
    for (let i = 0; i < repeat; i++) {
      str += Math.random().toString(36).substring(2, 15)
    }

    return str.substring(0, length)
  },

  obj2str: (obj) => {
    let str = '',
      keyArray = Object.keys(obj).sort()

    keyArray.forEach((k) => {
      str += '&' + k + '=' + obj[k]
    })

    return str.substring(1)
  },

  getCost: (amount) => {
    return parseFloat(amount) * 100
  },

  getNonceStr: function() {
    let length = (arguments && this.isNumeric(arguments[0])) ? arguments[0] : this.MAX_NONCE_STRING_LENGTH
    length = (length > this.MAX_NONCE_STRING_LENGTH || length < 0) ? this.MAX_NONCE_STRING_LENGTH : length

    return this.randomstring(length)
  },

  getTimestamp: () => {
    return parseInt(new Date().getTime() / 1000).toString()
  },

  signString: (str) => {
    return md5(str).toUpperCase()
  },

  buildOptions: function(ip, total) {
    let opts = {
      appid: this.APP_ID,
      mch_id: this.MCH_ID,
      body: this.BODY,
      scene_info: this.SCENE_INFO,
      nonce_str: this.getNonceStr(),
      out_trade_no: this.getTimestamp(),
      spbill_create_ip: ip,
      total_fee: total,
      trade_type: this.TRADE_TYPE,
    }

    opts.sign = this.signString(this.obj2str(opts) + '&key=' + this.APP_SECRET)

    return opts
  },

  buildXML: (json) => {
    let xml = '<xml>'

    for (let prop in json) {
      xml += '<' + prop + '>' + json[prop] + '</' + prop + '>'
    }

    xml += '</xml>'

    return xml
  }
}