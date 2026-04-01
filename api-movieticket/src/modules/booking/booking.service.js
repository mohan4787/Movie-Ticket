const BaseService = require("../../services/base.service");
const Booking = require("./booking.model");
const { getIO } = require("../../utilities/socket");
const ticketService = require("../ticket/ticket.service");

class BookingService extends BaseService {
  constructor() {
    super(Booking);
  }

  /**
   * Temporarily hold seats for a user
   */
  async holdSeats(data) {
    const { movieId, showtimeId, seats, userId, totalAmount } = data;

    // Validate input
    if (!movieId || !showtimeId || !userId || !Array.isArray(seats) || seats.length === 0) {
      throw new Error("Invalid input: movieId, showtimeId, userId, and seats are required");
    }

    if (!totalAmount || totalAmount <= 0) {
      throw new Error("Invalid totalAmount");
    }

    const seatNumbers = seats.map(s => s.seatNumber);
    const now = new Date();
    const expiryTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 min expiry

    // Check for seat conflicts
    const conflict = await this.exists({
      showtimeId,
      "seats.seatNumber": { $in: seatNumbers },
      $or: [
        { bookingStatus: "confirmed" },
        { bookingStatus: "reserved", createdAt: { $gt: expiryTime } }
      ],
    });

    if (conflict) {
      throw new Error("Some seats are already reserved or booked");
    }

    // Create booking
    const bookingData = {
      userId,
      movieId,
      showtimeId,
      totalAmount,
      seats: seats.map(s => ({ seatNumber: s.seatNumber, status: "reserved" })),
      createdBy: userId,
      bookingStatus: "reserved",
      paymentStatus: "pending",
      createdAt: now
    };

    const booking = await this.create(bookingData);

    // Emit seat locked event
    const io = getIO();
    if (io) {
      io.to(showtimeId.toString()).emit("seat_locked", { seats: seatNumbers });
    } else {
      console.warn("Socket.IO not initialized; cannot emit seat_locked event");
    }

    return booking;
  }

  /**
   * Confirm booking after payment
   */
  async confirmBooking(data) {
    const { bookingId, userId } = data;
    const booking = await this.findById(bookingId);

    if (!booking) throw new Error("Booking not found");
    if (booking.bookingStatus !== "reserved") throw new Error("Invalid booking state");

    booking.seats = booking.seats.map(s => ({ ...s.toObject(), status: "booked" }));
    booking.bookingStatus = "confirmed";
    booking.paymentStatus = "paid";
    booking.updatedBy = userId;
    await booking.save();

    const tickets = await ticketService.createTickets(booking);
    return { booking, tickets };
  }

  /**
   * Release reserved seats manually or on cancellation
   */
  async releaseSeats(data) {
    const { bookingId, userId } = data;
    const booking = await this.findById(bookingId);

    if (!booking) throw new Error("Booking not found");
    if (booking.bookingStatus !== "reserved") throw new Error("Only reserved bookings can be cancelled");

    booking.bookingStatus = "cancelled";
    booking.updatedBy = userId;
    await booking.save();

    const io = getIO();
    if (io) {
      io.to(booking.showtimeId.toString()).emit("seat_released", {
        seats: booking.seats.map(s => s.seatNumber)
      });
    }

    return booking;
  }

  /**
   * Auto-release expired reserved seats (older than 5 minutes)
   */
  async autoReleaseExpired() {
    const expiryTime = new Date(Date.now() - 5 * 60 * 1000);
    const expiredBookings = await this.model.find({
      bookingStatus: "reserved",
      createdAt: { $lt: expiryTime }
    });

    if (expiredBookings.length === 0) return;

    const io = getIO();

    for (const booking of expiredBookings) {
      booking.bookingStatus = "cancelled";
      await booking.save();

      if (io) {
        io.to(booking.showtimeId.toString()).emit("seat_released", {
          seats: booking.seats.map(s => s.seatNumber)
        });
      }
    }
  }
}

module.exports = new BookingService();