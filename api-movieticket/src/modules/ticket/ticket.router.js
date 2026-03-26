const ticketCtrl = require("./ticket.controller");
const { USER_ROLES } = require("../../config/constants");
const auth = require("../../middlewares/auth.middleware");

const ticketRouter = require("express").Router();

ticketRouter.post(
  "/generate",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  ticketCtrl.generate
);

ticketRouter.post(
  "/verify",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  ticketCtrl.verify
);

module.exports = ticketRouter;