const { USER_ROLES } = require("../../config/constants");
const auth = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/request-validate.middleware");
const bookingCtrl = require("./booking.controller");
const { BookingCreateDTO } = require("./booking.validator");

const bookingRouter = require("express").Router();

bookingRouter.route("/")
  .post(auth([USER_ROLES.ADMIN, USER_ROLES.USER]), bodyValidator(BookingCreateDTO), bookingCtrl.createBooking);

  module.exports = bookingRouter;