const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateQR = async (bookingId, seat) => {
    const token = jwt.sign({ bookingId, seat }, process.env.QR_SECRET, { expiresIn: "6h" });
  const qrCode = await QRCode.toDataURL(token);
  return { qrCode, token };
}
exports.verifyQR = (token) => jwt.verify(token, process.env.QR_SECRET);

exports.generatePDF = async(ticket,booking) => {
     const dir = path.join(__dirname, "../../tickets");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, `${ticket._id}.pdf`);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
   doc.fontSize(20).text("Movie Ticket", { align: "center" });
  doc.moveDown();
  doc.text(`Booking ID: ${booking._id}`);
  doc.text(`Seat: ${ticket.seatNumber}`);
  doc.moveDown();
  doc.image(ticket.qrCode, { fit: [150, 150], align: "center" });

  doc.end();
  return `/tickets/${ticket._id}.pdf`;
}