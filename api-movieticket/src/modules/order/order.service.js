const Order = require("./order.model");
const BookingService = require("../booking/booking.service");
const ticketService = require("../ticket/ticket.service");
const { default: axios } = require("axios");

class OrderService {
  async createOrder(payload) {
    const { bookingId, userId, paymentMethod } = payload;
    const getDetail = await BookingService.getBookingById(bookingId);
    
    const order = await Order.create({
      ...payload,
      totalAmount: getDetail.totalAmount,
      seats: getDetail.seats,
      paymentStatus: "pending",
    });
    return order;
  }

  async initiatePayment(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const response = await axios.post(
      PaymentConfig.khalti.url + "epayment/initiate/",
      {
        return_url: `${AppConfig.frontendUrl}/payment-success`,
        website_url: AppConfig.frontendUrl,
        amount: order.totalAmount * 100,
        purchase_order_id: order._id.toString(),
        purchase_order_name: "Movie Ticket Booking",
      },
      {
        headers: {
          Authorization: `Key ${PaymentConfig.khalti.secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = response.data;

    if (!data.pidx) throw new Error("Payment initiation failed");

    order.pidx = data.pidx;
    order.paymentMethod = "khalti";
    await order.save();

    return {
      pidx: data.pidx,
      payment_url: `https://test-pay.khalti.com/?pidx=${data.pidx}`,
    };
  }
  async verifyPayment({ pidx }) {
    const order = await Order.findOne({ pidx });
    if (!order) throw new Error("Order not found");

    if (order.paymentStatus === "paid") return order;

    const { data: khaltiData } = await axios.post(
      `${PaymentConfig.khalti.url}epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${PaymentConfig.khalti.secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!khaltiData || khaltiData.status !== "Completed") {
      order.paymentStatus = "failed";
      await order.save();
      throw new Error(
        `Payment not completed: ${khaltiData.status || "Unknown"}`,
      );
    }
    if (khaltiData.total_amount !== order.totalAmount * 100) {
      order.paymentStatus = "failed";
      await order.save();
      throw new Error("Payment amount mismatch");
    }
    order.paymentStatus = "paid";
    order.transactionId = khaltiData.transaction_id;
    await order.save();
    const booking = await BookingService.confirmBooking(
      order.bookingId,
      order.userId,
    );

    const tickets = await ticketService.createTickets(booking);

    return {
      orderId: order._id,
      bookingId: booking._id,
      tickets,
      paymentStatus: order.paymentStatus,
    };
  }

  async getOrdersByUser(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new OrderService();