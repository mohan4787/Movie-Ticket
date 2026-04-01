const { Server } = require("socket.io");

let io;

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - Node HTTP server
 * @returns {Server} io instance
 */
function initSocket(server) {
  if (io) return io; // Prevent multiple initializations

  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // Join showtime room
    socket.on("join_showtime", (showtimeId) => {
      if (showtimeId) {
        socket.join(showtimeId.toString());
        console.log(`Socket ${socket.id} joined showtime ${showtimeId}`);
      }
    });

    // Seat locked from client
    socket.on("seat_locked_client", ({ seats, showtimeId }) => {
      if (io && showtimeId) {
        io.to(showtimeId.toString()).emit("seat_locked", { seats: seats || [] });
      }
    });

    // Seat released
    socket.on("seat_released_client", ({ seats, showtimeId }) => {
      if (io && showtimeId) {
        io.to(showtimeId.toString()).emit("seat_released", { seats: seats || [] });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

/**
 * Get initialized io instance safely
 * @returns {Server | null} io instance or null if not initialized
 */
function getIO() {
  if (!io) {
    console.warn("Socket.IO not initialized yet. Call initSocket(server) first.");
    return null;
  }
  return io;
}

module.exports = { initSocket, getIO };