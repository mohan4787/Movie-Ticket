const mongoose = require("mongoose");
const { Status } = require("../../config/constants");

const ShowTimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    screen: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    autoCreate: true,
    timestamps: true,
    autoIndex: true,
  }
);

const ShowTimeModel = mongoose.model("ShowTime", ShowTimeSchema);

module.exports = ShowTimeModel;