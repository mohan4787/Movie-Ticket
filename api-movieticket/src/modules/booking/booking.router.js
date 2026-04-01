const { USER_ROLES } = require("../../config/constants");
const auth = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/request-validate.middleware");
const bookingCtrl = require("./booking.controller");
const { BookingCreateDTO } = require("./booking.validator");

const bookingRouter = require("express").Router();

// Create booking (hold seats)
bookingRouter.post(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bodyValidator(BookingCreateDTO),
  bookingCtrl.holdSeats, // ✅ standard method, no ()
);

// Confirm booking
bookingRouter.post(
  "/confirm",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.confirmBooking,
);

// Cancel booking
bookingRouter.post(
  "/cancel",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.cancelBooking,
);

// Get booking by ID
// bookingRouter.get(
//   "/:bookingId",
//   auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
//   bookingCtrl.getBookingDetailsById,
// );

bookingRouter.get(
  "/:UserId",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.getBookingDetailByUserId,
);

// List bookings
bookingRouter.get(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.listAllBookings,
);

module.exports = bookingRouter;
