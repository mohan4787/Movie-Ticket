const router = require("express").Router();
const orderCtrl = require("./order.controller");
const auth = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/request-validate.middleware");

const { USER_ROLES } = require("../../config/constants");
const orderRouter = require("express").Router();
const {
  OrderCreateDTO,
  OrderVerifyPaymentDTO,
} = require("./order.validator");


orderRouter.post(
  "/",
  // auth([USER_ROLES.USER]),
  bodyValidator(OrderCreateDTO),
  orderCtrl.createOrder
);

orderRouter.post(
  "/initiate-payment/:orderId",
  auth([USER_ROLES.USER]),
  orderCtrl.initiatePayment
);

orderRouter.post(
  "/verify-payment",
  auth([USER_ROLES.USER]),
  bodyValidator(OrderVerifyPaymentDTO),
  orderCtrl.verifyPayment
);

orderRouter.get(
  "/my-orders",
  auth([USER_ROLES.USER]),
  orderCtrl.getMyOrders
);

module.exports = orderRouter;