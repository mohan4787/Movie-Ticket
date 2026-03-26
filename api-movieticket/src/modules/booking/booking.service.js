const BaseService = require("../../services/base.service");
const Booking = require("./booking.model");
const {getIO} = require("../../utilities/socket")
class BookingService extends BaseService {
  constructor() { super(Booking); }

  async holdSeats(data) {
    const { movieId, showtimeId, seats, userId } = data;
    const now = new Date();
    const expiryTime = new Date(now.getTime() - 5 * 60 * 1000);
    const seatNumbers = seats.map(s => s.seatNumber);

    const conflict = await this.exists({
      showtimeId,
      "seats.seatNumber": { $in: seatNumbers },
      bookingStatus: { $in: ["reserved","confirmed"] },
      $or: [{ bookingStatus:"confirmed"},{ createdAt:{ $gt: expiryTime } }],
    });
    if(conflict) throw new Error("Some seats are already reserved/booked");

    const booking = await this.create({
      movieId, showtimeId,
      seats: seats.map(s => ({ seatNumber: s.seatNumber, status:"reserved" })),
      createdBy: userId,
      bookingStatus:"reserved",
      paymentStatus:"pending"
    });

    const io = getIO();
    io.to(showtimeId.toString()).emit("seat_locked", { seats: seatNumbers });
    return booking;
  }

  async confirmBooking(data) {
    const { bookingId, userId } = data;
    const booking = await this.findById(bookingId);
    if(!booking) throw new Error("Booking not found");
    if(booking.bookingStatus !== "reserved") throw new Error("Invalid booking state");

    booking.seats = booking.seats.map(s => ({ ...s.toObject(), status:"booked" }));
    booking.bookingStatus = "confirmed";
    booking.paymentStatus = "paid";
    booking.updatedBy = userId;
    await booking.save();
    return booking;
  }

  async releaseSeats(data) {
    const { bookingId, userId } = data;
    const booking = await this.findById(bookingId);
    if(!booking) throw new Error("Booking not found");
    if(booking.bookingStatus !== "reserved") throw new Error("Only reserved bookings can be cancelled");

    booking.bookingStatus = "cancelled";
    booking.updatedBy = userId;
    await booking.save();

    const io = getIO();
    io.to(booking.showtimeId.toString()).emit("seat_released", { seats: booking.seats.map(s => s.seatNumber) });
    return booking;
  }

  async autoReleaseExpired() {
    const expiryTime = new Date(Date.now() - 5 * 60 * 1000);
    const expiredBookings = await this.model.find({ bookingStatus:"reserved", createdAt: { $lt: expiryTime } });
    if(expiredBookings.length===0) return;
    const io = getIO();

    for(const booking of expiredBookings){
      booking.bookingStatus = "cancelled";
      await booking.save();
      io.to(booking.showtimeId.toString()).emit("seat_released", { seats: booking.seats.map(s=>s.seatNumber) });
    }
  }
}

module.exports = new BookingService();