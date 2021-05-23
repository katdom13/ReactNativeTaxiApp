const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server }=  require('socket.io')
const io = new Server(server)
const port = 3000

let driverSocket = null
let passengerSocket = null

io.on('connection', socket => {
  console.log('a user connected :D')
  socket.on('chat message', message => {
    console.log(message)
    io.emit('chat message', message)
  })
  socket.on('taxiRequest', routeResponse => {
    console.log("PASSENGER: I am looking for a driver")
    passengerSocket = socket
    if (driverSocket != null) {
      driverSocket.emit('taxiRequest', routeResponse)
    }
  })
  socket.on('findPassenger', () => {
    console.log('DRIVER: I am looking for a passenger')
    driverSocket = socket
  })
  // Send driver location to passenger socket
  socket.on('driverLocation', location => {
    passengerSocket.emit('driverLocation', location)
  })
})

server.listen(port, () => {
  console.log(`server running on port ${port}...`)
})
