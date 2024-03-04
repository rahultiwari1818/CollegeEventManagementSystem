const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_API_SECRET
})

module.exports = {vonage};