const SocketIO = require('socket.io')

class User
{
  constructor ({ socket, peer }) {
    this.socket = socket
    this.peer = peer
  }
}

module.exports = ({ server }) => {
  const io = SocketIO(server, {
    cors: { origin: "*" },
    path: '/socket-io'
  })

  let broadcaster = null
  let users = []

  io.on('connection', (socket) => {
    users.push(socket)

    socket.on('broadcaster', (peer) => {
      if (!broadcaster) {
        broadcaster = new User({ socket, peer })
      }
    })

    socket.on('new-user', (peer) => {
      users.push(new User({ socket, peer }))

      if (broadcaster) {
        socket.emit('broadcaster', broadcaster.peer)
      }
    })

    socket.on('disconnect', () => {
      if (broadcaster && socket === broadcaster.socket) {
        broadcaster = null
      }

      users = users.filter((user) => socket !== user.socket)
    })
  })
}
