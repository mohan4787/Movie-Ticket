const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateQR = async (bookingId, seat) => {
  const token = jwt.sign(
    { bookingId, seat },
    process.env.QR_SECRET,
    { expiresIn: "6h" }
  );

  const qrCode = await QRCode.toDataURL(token);

  return { qrCode, token };
};

exports.verifyQR = (token) => {
  return jwt.verify(token, process.env.QR_SECRET);
};

exports.generatePDF = async (ticket, booking) => {
  const dir = path.join(__dirname, "../../tickets");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${ticket._id}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text("Movie Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Booking ID: ${booking._id}`);
    doc.text(`Seat: ${ticket.seatNumber}`);
    doc.text(`User: ${booking.createdBy}`);
    doc.moveDown();

    const base64Data = ticket.qrCode.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(base64Data, "base64");

    doc.image(qrBuffer, {
      fit: [150, 150],
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
};