const ticketService = require("./ticket.service");

class TicketController {
  async generate(req, res, next) {
    try {
      const { bookingId } = req.body;
      const tickets = await ticketService.createTickets(bookingId);
      res.json({
        data: tickets,
        message: "Tickets generated successfully",
        status: "TICKETS_GENERATED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }
  async verify(req, res, next) {
    try {
      const { qrToken } = req.body;
      const ticket = await ticketService.verifyTicket(qrToken);

      res.json({
        data: ticket,
        message: "Ticket verified successfully",
        status: "TICKET_VERIFIED",
        options: null,
      });
    } catch (exception) {
      res.status(400).json({
        data: null,
        message: exception.message || "Ticket verification failed",
        status: "TICKET_VERIFICATION_FAILED",
        options: null,
      });
    }
  }
}
const ticketCtrl = new TicketController();
module.exports = ticketCtrl
