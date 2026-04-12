const mongoose = require("mongoose");

const DailyStatsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: "2026-04-12"
  movies: [{
    movie: String, // Movie Title
    screens: [{
      screenName: String,
      shows: [{
        time: String,
        tickets: { type: Number, default: 0 },
        capacity: { type: Number, default: 250 },
        revenue: { type: Number, default: 0 },
        paymentModes: {
          upi: { type: Number, default: 0 },
          cash: { type: Number, default: 0 }
        }
      }]
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model("DailyStats", DailyStatsSchema);