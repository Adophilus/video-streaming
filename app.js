const express = require('express')
const pug = require('pug')
const http = require('http')
const config = require('./config')

const app = express()
const server = http.createServer(app)

app.set('view engine', 'pug')
app.use(express.static('public'))

require('./router')({ app })
require('./socket-io')({ server })

module.exports = {
  server,
  listen: (port) => {
    port = port || config.server.port
    app.use('/peerjs', require('peer').ExpressPeerServer(server, {
      debug: true,
      port: port
    }))

    server.listen(port, (err) => {
      if (!err) console.log(`Server running on port ${port}`)
    })
  }
}
