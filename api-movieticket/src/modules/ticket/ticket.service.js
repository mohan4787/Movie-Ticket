const Ticket = require("./ticket.model");
const { generateQR, verifyQR, generatePDF } = require("../../utilities/ticket.");

class TicketService {
  async createTickets(booking) {
    if (!booking) throw new Error("Booking required");

    if (booking.bookingStatus !== "confirmed") {
      throw new Error("Booking not confirmed");
    }

    const existing = await Ticket.find({ bookingId: booking._id });
    if (existing.length) {
      return existing.map((t) => this.publicTicketData(t));
    }

    const tickets = [];

    for (const seat of booking.seats) {
      const seatNumber = seat.seatNumber;

      const ticket = await Ticket.create({
        bookingId: booking._id,
        userId: booking.userId,
        seatNumber,
        qrCode: "temp",
      });

      const { qrCode } = await generateQR(
        booking._id,
        seatNumber,
        ticket._id
      );

      ticket.qrCode = qrCode;
      const pdfUrl = await generatePDF(ticket, booking);
      ticket.pdfUrl = pdfUrl;

      await ticket.save();

      tickets.push(this.publicTicketData(ticket));
    }

    return tickets;
  }

  async verifyTicket(qrToken) {
    let decoded;

    try {
      decoded = verifyQR(qrToken);
    } catch {
      throw new Error("Invalid or expired QR");
    }

    const ticket = await Ticket.findById(decoded.ticketId);

    if (!ticket) throw new Error("Ticket not found");

    if (
      ticket.bookingId.toString() !== decoded.bookingId ||
      ticket.seatNumber !== decoded.seat
    ) {
      throw new Error("QR data mismatch");
    }

    if (ticket.status !== "valid") {
      throw new Error("Ticket already used");
    }

    ticket.status = "used";
    await ticket.save();

    return this.publicTicketData(ticket);
  }

  async getUserTickets(userId) {
    const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });

    return tickets.map((t) => this.publicTicketData(t));
  }

  publicTicketData(ticket) {
    return {
      _id: ticket._id,
      bookingId: ticket.bookingId,
      userId: ticket.userId,
      seatNumber: ticket.seatNumber,
      qrCode: ticket.qrCode,
      pdfUrl: ticket.pdfUrl,
      status: ticket.status,
      createdAt: ticket.createdAt,
    };
  }
}

module.exports = new TicketService();