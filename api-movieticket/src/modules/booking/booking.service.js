const mongoose = require("mongoose");
const BookingModel = require("./booking.model");
const ShowTimeModel = require("../showtime/showtime.model");
const BaseService = require("../../services/base.service");

class BookingService extends BaseService {
  async allocateBestSeats(showtimeId, numberOfSeats) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const showtime =
        await ShowTimeModel.findById(showtimeId).session(session);
      if (!showtime) {
        throw {
          statusCode: 404,
          message: "Showtime not found",
          status: "SHOWTIME_NOT_FOUND",
        };
      }
      const rows = {};
      showtime.seats.forEach((seat) => {
        const row = seat.seatNumber[0];
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
      });

      let allocatedSeats = [];

      for (const rowKey of Object.keys(rows)) {
        const seatsRow = rows[rowKey];
        seatsRow.sort(
          (a, b) =>
            parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)),
        );

        for (let i = 0; i <= seatsRow.length - numberOfSeats; i++) {
          const window = seatsRow.slice(i, i + numberOfSeats);
          if (window.every((seat) => seat.status === "available")) {
            allocatedSeats = window;
            break;
          }
        }
        if (allocatedSeats.length) break;
      }
      if (!allocatedSeats.length) {
        throw {
          statusCode: 400,
          message: "Not enough contiguous seats available",
          status: "SEATS_NOT_AVAILABLE",
        };
      }
      allocatedSeats.forEach((seat) => (seat.status = "reserved"));
      await showtime.save({ session });
      await session.commitTransaction();
      session.endSession();

      return allocatedSeats.map((seat) => seat.seatNumber);
    } catch (exception) {
      await session.abortTransaction();
      session.endSession();
      throw exception;
    }
  }
  async createBooking(userId, movieId, showtimeId, numberOfSeats, totalAmount) {
    const allocatedSeats = await this.allocateBestSeats(
      showtimeId,
      numberOfSeats,
    );

    const booking = await BookingModel.create({
      userId,
      movieId,
      showtimeId,
      seats: allocatedSeats.map((seat) => ({
        seatNumber: seat,
        status: "reserved",
      })),
      totalAmount,
      bookingStatus: "reserved",
      paymentStatus: "pending",
    });
    return booking;
  }
}

const bookingSvc = new BookingService(BookingModel);
module.exports = bookingSvc;
