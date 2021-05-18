const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server }=  require('socket.io')
const io = new Server(server)
const port = 3000

io.on('connection', socket => {
  console.log('a user connected :D')
  socket.on('chat message', message => {
    console.log(message)
    io.emit('chat message', message)
  })
})

server.listen(port, () => {
  console.log(`server running on port ${port}...`)
})
