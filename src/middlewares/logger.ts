import morgan = require('koa-morgan')
import fs = require('fs')
import path = require('path')

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

export default morgan('combined', {
  skip: (req, res) => true,
  stream: accessLogStream
})
