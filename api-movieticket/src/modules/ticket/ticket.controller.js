const ticketService = require("./ticket.service");

class TicketController {
  async verify(req, res, next) {
    try {
      const { qrToken } = req.body;

      const ticket = await ticketService.verifyTicket(qrToken);

      res.json({
        data: ticket,
        message: "Ticket verified successfully",
        status: "TICKET_VERIFIED",
      });
    } catch (err) {
      res.status(400).json({
        message: err.message || "Ticket verification failed",
        status: "TICKET_VERIFICATION_FAILED",
      });
    }
  }

  async getMyTickets(req, res, next) {
    try {
      const tickets = await ticketService.getUserTickets(req.userId);

      res.json({
        data: tickets,
        message: "Tickets fetched",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TicketController();