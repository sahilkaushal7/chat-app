const io = require("socket.io")(5000, { cors: "*" });

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, message }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r.id !== recipient.id);
      newRecipients.push({ id, name: "Test" });
      socket.broadcast.to(recipient.id).emit("receive-message", {
        recipients: newRecipients,
        message,
      });
    });
  });
});
