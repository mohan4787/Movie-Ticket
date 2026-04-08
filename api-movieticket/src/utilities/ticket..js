const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateQR = async (bookingId, seat, ticketId) => {
  try {
    const token = jwt.sign(
      { bookingId, seat, ticketId },
      process.env.QR_SECRET,
      { expiresIn: "6h" }
    );

    const qrCode = await QRCode.toDataURL(token);

    return { qrCode, token };
  } catch (err) {
    throw new Error("QR generation failed");
  }
};

exports.verifyQR = (token) => {
  try {
    return jwt.verify(token, process.env.QR_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired QR");
  }
};

exports.generatePDF = async (ticket, booking) => {
  try {
    const dir = path.join(__dirname, "../../tickets");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${ticket._id}.pdf`);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc
        .fontSize(22)
        .text("Movie Ticket", { align: "center" })
        .moveDown();

      doc.fontSize(12);
      doc.text(`Ticket ID: ${ticket._id}`);
      doc.text(`Booking ID: ${booking._id}`);
      doc.text(`User ID: ${booking.userId}`);
      doc.text(`Seat Number: ${ticket.seatNumber}`);

      if (booking.movieId?.title) {
        doc.text(`Movie: ${booking.movieId.title}`);
      }

      if (booking.showtimeId?.startTime) {
        doc.text(`Showtime: ${booking.showtimeId.startTime}`);
      }

      doc.moveDown();

      if (ticket.qrCode) {
        const base64Data = ticket.qrCode.replace(
          /^data:image\/png;base64,/,
          ""
        );
        const qrBuffer = Buffer.from(base64Data, "base64");

        doc.image(qrBuffer, {
          fit: [150, 150],
          align: "center",
        });
      }

      doc.moveDown();
      doc.text("Please show this QR at the entrance", {
        align: "center",
      });

      doc.end();

      stream.on("finish", () => {
        resolve(`/tickets/${ticket._id}.pdf`);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (err) {
    throw new Error("PDF generation failed");
  }
};