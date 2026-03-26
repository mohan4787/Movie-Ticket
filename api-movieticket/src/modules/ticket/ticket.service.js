const Ticket = require("./ticket.model");
const Booking = require("../booking/booking.model");
const { generateQR, verifyQR, generatePDF } = require("../../utilities/ticket.");

class TicketService {
  async createTickets(bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "confirmed") throw new Error("Booking not confirmed");

    const existing = await Ticket.find({ bookingId });
    if (existing.length) return existing.map(this.publicTicketData);

    const tickets = [];

    for (const seat of booking.seats) {
      const { qrCode } = await generateQR(bookingId, seat);

      const ticket = await Ticket.create({
        bookingId,
        userId: booking.userId,
        seatNumber: seat,
        qrCode,
      });

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
      throw new Error("Invalid/expired QR");
    }

    const ticket = await Ticket.findOne({
      bookingId: decoded.bookingId,
      seatNumber: decoded.seat,
    });

    if (!ticket) throw new Error("Ticket not found");
    if (ticket.status !== "valid") throw new Error("Already used");

    ticket.status = "used";
    await ticket.save();

    return this.publicTicketData(ticket);
  }

  publicTicketData(ticket) {
    return {
      _id: ticket._id,
      bookingId: ticket.bookingId,
      userId: ticket.userId,
      seatNumber: ticket.seatNumber,
      qrCode: ticket.qrCode,
      pdfUrl: ticket.pdfUrl || null,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}

module.exports = new TicketService();