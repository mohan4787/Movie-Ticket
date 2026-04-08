const { USER_ROLES } = require("../../config/constants");
const auth = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/request-validate.middleware");
const bookingCtrl = require("./booking.controller");
const { BookingCreateDTO } = require("./booking.validator");

const bookingRouter = require("express").Router();

bookingRouter.post(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bodyValidator(BookingCreateDTO),
  bookingCtrl.holdSeats,
);
bookingRouter.post(
  "/confirm",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.confirmBooking,
);

bookingRouter.post(
  "/cancel",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.cancelBooking,
);

bookingRouter.get(
  "/",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  bookingCtrl.listAllBookings,
);
bookingRouter.post(
  "/auto-release",
  auth([USER_ROLES.ADMIN]),
  bookingCtrl.autoReleaseExpired,
);
module.exports = bookingRouter;
