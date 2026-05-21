// socket.js

let ioInstance = null;

module.exports = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

// Export a function to emit emails
module.exports.sendEmailToClients = (email) => {
  if (ioInstance) {
    ioInstance.emit("new-email", email);
    console.log("Emitted new email to all admins");
  }
};
