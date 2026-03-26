const { default: mongoose } = require("mongoose");

const TicketSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  pdfUrl: String,
  status: {
    type: String,
    enum: ["valid", "used"],
    default: "valid",
  },
},{
    timestamps: true
});
const TicketModel = mongoose.model("Ticket", TicketSchema);
module.exports = TicketModel;

