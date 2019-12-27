const request = require('request'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5'),
  xmlParser = require('xml2js').parseString

module.exports = (app) => {
  app.post('/wechat', (req, res, next) => {
    let options = {
      url: WXPAY.URL,
      method: 'POST',
      body: WXPAY.buildXML(WXPAY.buildOptions(
        req.ip || '114.243.34.99',
        1,
        {
          "campaign": "乐学习英语名师精品英语全能专项小班课，59元特惠大礼包",
          "platform": "多点",
          "name": req.body.name,
          "grade": req.body.grade,
          "mobile": req.body.mobile
        }
      ))
    }

    // console.log('发送信息')
    // console.log(options.body)

    sendToWeChat(options, (err, data) => {
      if (!err) {
        xmlParser(data, {explicitArray : false}, (error, result) => {
          res.status(200).send(result.xml)
        })
      } else {
        xmlParser(err, {explicitArray : false}, (error, result) => {
          res.status(500).send(result.xml)
        })
      }
    })
  })
}

function sendToWeChat(options, callback) {
  request(options, (err, res, body) => {
    if (!err && res.statusCode === 200) {
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
  BODY: '乐学习微信H5支付测试',
  SCENE_INFO: '{"h5_info":{"type":"Wap","wap_url":"https://39.97.182.211/","wap_name":"乐学习"}}',
  NOTIFY_URL: 'https://39.97.182.211/wechat/notify',

  URL: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
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

  buildOptions: function(ip, total, detail) {
    let opts = {
      appid: this.APP_ID,
      mch_id: this.MCH_ID,
      body: this.BODY,
      detail: detail,
      scene_info: this.SCENE_INFO,
      nonce_str: this.getNonceStr(),
      out_trade_no: this.getTimestamp(),
      spbill_create_ip: ip,
      total_fee: total,
      trade_type: this.TRADE_TYPE,
      notify_url: this.NOTIFY_URL
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
