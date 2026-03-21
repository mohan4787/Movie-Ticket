const bookingSvc = require("./booking.service");

class BookingController {
  async createBooking(req, res, next) {
    try {
      const { movieId, showtimeId, seats, totalAmount } = req.body;
      const booking = await bookingSvc.createBooking(
        req.loggedInUser._id,
        movieId,
        showtimeId,
        seats.length,
        totalAmount,
      );
      res.json({
        data: booking,
        message: "Booking created successfully",
        status: "BOOKING_CREATED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }
}

const bookingCtrl = new BookingController();
module.exports = bookingCtrl;
