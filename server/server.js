const io = require("socket.io")(5000, { cors: "*" });

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  const name = socket.handshake.query.name;
  socket.join(id);

  socket.on("send-message", ({ recipients, message }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r.id !== recipient.id);
      newRecipients.push({ id, name });
      socket.broadcast.to(recipient.id).emit("receive-message", {
        recipients: newRecipients,
        message,
      });
    });
  });

  socket.on("change-status", ({ recipients, status }) => {
    recipients.forEach((recipient) => {
      socket.broadcast.to(recipient).emit("status-update", {
        name,
        status
      });
    });
  });
});
