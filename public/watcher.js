class Watcher
{
  constructor ({ video, socketIoServer, peerServer }) {
    this.events = {
      error: (err) => {
        alert(err)
      }
    }

    this.socket = io(socketIoServer, { path: '/socket-io' })
    this.peer = new Peer(undefined, peerServer)
    this.stream = null
    this.video = video

    this.video.addEventListener('loadedmetadata', () => this.video.play())

    // on peer ready
    this.peer.on('open', (id) => this.socket.emit('new-user', id))

    // handle errors
    this.peer.on('error', this.events.error)

    this.socket.on('broadcaster', (broadcaster) => {
      this.peer.connect(broadcaster)
    })

    this.peer.on('call', (call) => {
      call.on('stream', (stream) => {
        this.stream = stream
        this.video.srcObject = stream
      })
      call.answer(null)
    })
  }

  stop () {
    this.video.srcObject = null
  }
}
