const ticketCtrl = require("./ticket.controller");
const { USER_ROLES } = require("../../config/constants");
const auth = require("../../middlewares/auth.middleware");

const ticketRouter = require("express").Router();
ticketRouter.post(
  "/verify",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  ticketCtrl.verify
);

ticketRouter.get(
  "/my-tickets",
  auth([USER_ROLES.ADMIN, USER_ROLES.USER]),
  ticketCtrl.getMyTickets
);

module.exports = ticketRouter;