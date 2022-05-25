class Broadcaster
{
  constructor ({ socketIoServer, peerServer }) {
    this.events = {
      error: (err) => {
        alert(err)
      }
    }

    this.socket = io(socketIoServer, {
      path: '/socket-io'
    })

    this.socket.on("connect_error", (err) => console.warn(err))

    this.peer = new Peer(undefined, peerServer)
    this.stream = null

    // on peer ready
    this.peer.on('open', (id) => this.socket.emit('broadcaster', id))

    // handle errors
    this.peer.on('error', this.events.error)

    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        this.peer.call(conn.peer, this.stream)
      })
    })
  }

  start () {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then((stream) => {
        this.stream = stream
      })
      .catch(this.events.error)
  }

  stop () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.socket.disconnect()
  }

  pause () {
    this.stream.getTracks().forEach((track) => track.enabled = false)
  }

  resume () {
    this.stream.getTracks().forEach((track) => track.enabled = true)
  }


  on(event, callback) {
    this.events[event] = callback
  }
}
