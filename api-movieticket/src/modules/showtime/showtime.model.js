const mongoose = require("mongoose");
const { Status } = require("../../config/constants");

const ShowTimeSchema = new mongoose.Schema(
  {
    movie: {
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
    language: {
      type: String,
      default: "English",
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

const ShowTimeModel = mongoose.model("ShowTime", ShowTimeSchema);

module.exports = ShowTimeModel;