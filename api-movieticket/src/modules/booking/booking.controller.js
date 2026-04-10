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
      const booking = await bookingSvc.confirmBooking(req.body.bookingId, req.userId);

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
      const booking = await bookingSvc.releaseSeats(req.body.bookingId, req.userId);

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
}}

const bookingCtrl = new BookingController();
module.exports = bookingCtrl;
