const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server }=  require('socket.io')
const io = new Server(server)
const port = 3000

let driverSocket = null

io.on('connection', socket => {
  console.log('a user connected :D')
  socket.on('chat message', message => {
    console.log(message)
    io.emit('chat message', message)
  })
  socket.on('taxiRequest', routeResponse => {
    console.log("PASSENGER: I am looking for a driver")
    if (driverSocket != null) {
      driverSocket.emit('taxiRequest', routeResponse)
    }
  })
  socket.on('findPassenger', () => {
    console.log('DRIVER: I am looking for a passenger')
    driverSocket = socket
  })
})

server.listen(port, () => {
  console.log(`server running on port ${port}...`)
})
