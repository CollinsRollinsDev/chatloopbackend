const express = require('express');
const app = express();
const http = require('http').createServer(app)
// const port = process.env.NODE_ENV === "production" ? 3000 : 5000
const port = process.env.PORT || 5000

// const io = require('socket.io')(http)
const io = require("socket.io")(http, {
  cors: {
    origin: "https://chatloop.vercel.app",
    methods: ["GET", "POST"]
  }
});


app.get("/", (req, res) => {
  res.send("Server is running on this port");
})

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)
  

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})

http.listen(port, () => console.log(`Server is listening on ${port}`))