const BaseService = require("../../services/base.service");
const Booking = require("./booking.model");
const { getIO } = require("../../utilities/socket");
const ticketService = require("../ticket/ticket.service");
const ShowTimeModel = require("../showtime/showtime.model");

class BookingService extends BaseService {
  constructor() {
    super(Booking);
  }

// Inside your Booking Service or Controller
async holdSeats(data) {
  const { movieId, showtimeId, seats, userId, totalAmount } = data;

  // 1. Validation
  if (!movieId || !showtimeId || !userId || !Array.isArray(seats) || seats.length === 0) {
    throw new Error("Invalid input data");
  }

  const seatNumbers = seats.map((s) => s.seatNumber);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes expiry

  // 2. Conflict Check (Ensure no one else has booked/reserved these in the meantime)
  const conflict = await this.model.findOne({
    showtimeId,
    "seats.seatNumber": { $in: seatNumbers },
    $or: [
      { bookingStatus: "confirmed" },
      {
        bookingStatus: "reserved",
        expiresAt: { $gt: now },
      },
    ],
  });

  if (conflict) {
    throw new Error("Some seats are already reserved or booked by another user");
  }

  // 3. Create the Booking entry
  const booking = await this.model.create({
    userId,
    movieId,
    showtimeId,
    totalAmount,
    seats: seats.map((s) => ({
      seatNumber: s.seatNumber,
      status: "reserved",
    })),
    createdBy: userId,
    bookingStatus: "reserved",
    expiresAt,
  });

  // 4. THE FIX: Update the Showtime document's seat statuses
  // This ensures the map reflects the reservation immediately
  await ShowTimeModel.updateOne(
    { 
      _id: showtimeId, 
      "seats.seatNumber": { $in: seatNumbers } 
    },
    { 
      $set: { "seats.$[elem].status": "reserved" } 
    },
    { 
      arrayFilters: [{ "elem.seatNumber": { $in: seatNumbers } }] 
    }
  );

  // 5. Real-time update via Socket.io
  const io = getIO();
  if (io) {
    io.to(showtimeId.toString()).emit("seat_locked", {
      seats: seatNumbers,
      status: "reserved"
    });
  }

  return booking;
}
  async confirmBooking(bookingId, userId) {
    const booking = await this.findById(bookingId);

    if (!booking) throw new Error("Booking not found");

    if (booking.bookingStatus === "confirmed") {
      return booking;
    }

    if (booking.bookingStatus !== "reserved") {
      throw new Error(`Invalid booking state: ${booking.bookingStatus}`);
    }

    if (booking.expiresAt < new Date()) {
      booking.bookingStatus = "cancelled";
      await booking.save();
      throw new Error("Booking expired");
    }

    booking.seats = booking.seats.map((s) => ({
      ...s.toObject(),
      status: "booked",
    }));

    booking.bookingStatus = "confirmed";
    booking.updatedBy = userId;

    await booking.save();
    return booking;
  }

  async getBookingById(bookingId) {
    const booking = await this.model
      .findById(bookingId)
      .populate("movieId", "title")
      // .populate("showtimeId")
      .lean();
    if (!booking) throw new Error("Booking not found");
    return booking;
  }


  async releaseSeats(data) {
    const { bookingId, userId } = data;

    const booking = await this.findById(bookingId);

    if (!booking) throw new Error("Booking not found");

    if (booking.bookingStatus !== "reserved") {
      throw new Error("Only reserved bookings can be cancelled");
    }

    booking.bookingStatus = "cancelled";
    booking.updatedBy = userId;

    await booking.save();

    const io = getIO();
    if (io) {
      io.to(booking.showtimeId.toString()).emit("seat_released", {
        seats: booking.seats.map((s) => s.seatNumber),
      });
    }

    return booking;
  }

  async autoReleaseExpired() {
    const now = new Date();

    const expiredBookings = await this.model.find({
      bookingStatus: "reserved",
      expiresAt: { $lt: now },
    });

    const io = getIO();

    for (const booking of expiredBookings) {
      booking.bookingStatus = "cancelled";
      await booking.save();

      if (io) {
        io.to(booking.showtimeId.toString()).emit("seat_released", {
          seats: booking.seats.map((s) => s.seatNumber),
        });
      }
    }
  }
}

module.exports = new BookingService();
