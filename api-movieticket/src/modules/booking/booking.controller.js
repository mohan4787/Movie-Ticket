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
      const booking = await bookingSvc.confirmBooking(
        req.body.bookingId,
        req.userId,
      );

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
      const booking = await bookingSvc.releaseSeats(
        req.body.bookingId,
        req.userId,
      );

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

  async listAllBookings(req, res, next) {
    try {
      let filter = {};

      // 1. Handle existing filters
      if (req.query.userId) {
        filter.createdBy = req.query.userId;
      }

      if (req.query.status) {
        filter.bookingStatus = req.query.status;
      }

      // 2. Extract Pagination Params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // 3. Calculate Skip (Crucial for data to actually change)
      const skip = (page - 1) * limit;

      // 4. Pass options to the service
      const bookings = await bookingSvc.getMultipleRowsByFilter(filter, {
        limit: limit,
        skip: skip,
        sort: { createdAt: -1 }, // Optional: keeps newest bookings at the top
      });

      res.json({
        data: bookings, // bookings now contains { data, pagination }
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

  async getAllBookingsForUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const AllBookings = await BookingModel.find({ userId })
        .populate("movieId", "title")
        .lean();
      if (!AllBookings || AllBookings.length === 0) {
        return res.status(404).json({
          data: null,
          message: "No bookings found for this user",
          status: "USER_BOOKINGS_NOT_FOUND",
          options: null,
        });
      }
      res.json({
        data: AllBookings,
        message: "All bookings for user fetched successfully",
        status: "USER_BOOKINGS_FETCHED",
        options: null,
      });
    } catch (exception) {
      throw exception;
    }
  }

  async getBookingDetails(req, res, next) {
    try {
      const bookingId = req.params.bookingId;
      const booking = await bookingSvc.getBookingById(bookingId);

      if (!booking) {
        return res.status(404).json({
          data: null,
          message: "Booking not found",
          status: "BOOKING_NOT_FOUND",
          options: null,
        });
      }
      res.json({
        data: booking,
        message: "Booking details fetched successfully",
        status: "BOOKING_DETAILS_FETCHED",
      });
    } catch (exception) {
      throw exception;
    }
  }
}

const bookingCtrl = new BookingController();
module.exports = bookingCtrl;
