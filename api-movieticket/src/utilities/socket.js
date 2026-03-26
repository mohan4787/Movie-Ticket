const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // Join showtime room
    socket.on("join_showtime", (showtimeId) => {
      socket.join(showtimeId);
      console.log(`Socket ${socket.id} joined showtime ${showtimeId}`);
    });

    // Seat locked
    socket.on("seat_locked_client", ({ seats, showtimeId }) => {
      io.to(showtimeId).emit("seat_locked", { seats });
    });

    // Seat released (IMPORTANT)
    socket.on("seat_released_client", ({ seats, showtimeId }) => {
      io.to(showtimeId).emit("seat_released", { seats });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = { initSocket, getIO: () => io };