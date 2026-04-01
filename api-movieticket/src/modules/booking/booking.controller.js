const BookingModel = require("./booking.model");
const bookingSvc = require("./booking.service");

class BookingController {
  async holdSeats(req, res, next) {
    try {
      const booking = await bookingSvc.holdSeats(req.body);

      res.json({
        data: booking,
        message: "Seats held for 5 minutes",
        status: "SEATS_HELD",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async confirmBooking(req, res, next) {
    try {
      const booking = await bookingSvc.confirmBooking(req.body);

      res.json({
        data: booking,
        message: "Booking confirmed successfully",
        status: "BOOKING_CONFIRMED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const booking = await bookingSvc.releaseSeats(req.body);

      res.json({
        data: booking,
        message: "Booking cancelled successfully",
        status: "BOOKING_CANCELLED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getAllBooking(req, res, next) {
    try {
      const getAll = await BookingModel.find();
      if (!getAll) {
        throw {
          code: 404,
          message: "Not found bookings!",
        };
      }
      res.json({
        data: getAll,
        message: "Booking Fetched Successfully!",
      });
    } catch (error) {}
  }

  async getBookingDetailByUserId(req, res, next) {
    try {
      const userId = req.params.UserId;

      // Fetch booking for the user and populate user details
      const bookingDetail = await BookingModel.findOne({ userId }).populate(
        "userId",
        "name email",
      ); // pass a string with field names

      if (!bookingDetail) {
        return res.status(404).json({ message: "Booking not found" });
      }

      console.log(bookingDetail);

      // Send response
      return res.status(200).json({ data: bookingDetail });
    } catch (error) {
      console.error("Error fetching booking:", error);
      next(error); // pass to error middleware
    }
  }

  async listAllBookings(req, res, next) {
    try {
      let filter = {};

      if (req.query.userId) {
        filter.createdBy = req.query.userId;
      }

      if (req.query.status) {
        filter.bookingStatus = req.query.status;
      }

      const bookings = await bookingSvc.getMultipleRowsByFilter(filter);

      res.json({
        data: bookings,
        message: "Booking list fetched successfully",
        status: "BOOKING_LIST_FETCHED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async autoReleaseExpired(req, res, next) {
    try {
      await bookingSvc.autoReleaseExpired();

      res.json({
        data: null,
        message: "Expired bookings released",
        status: "BOOKING_AUTO_RELEASE",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }
}

const bookingCtrl = new BookingController();
module.exports = bookingCtrl;
