const fs = require("fs");
const randomStringGenerator = (length = 100) => {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const len = chars.length;
  let random = "";

  for (let i = 0; i < length; i++) {
    const posn = Math.ceil(Math.random() * len);
    random += chars[posn];
  }
  return random;
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const generateSeat = (screen) =>  {
  let seats = [];

  if (screen === "SCREEN1") {
    const rows = ["A", "B", "C"];
    const cols = 40;
    rows.forEach((row) => {
      for (let i = 1; i <= cols; i++) {
        seats.push({
          seatNumber: `${row}${i.toString().padStart(2, "0")}`,
          isBooked: false,
        });
      }
    });

  } else if (screen === "SCREEN2") {
    const rows = ["A", "B", "C"];
    const cols = 40;
    rows.forEach((row) => {
      for (let i = 1; i <= cols; i++) {
        seats.push({
          seatNumber: `${row}${i.toString().padStart(2, "0")}`,
          isBooked: false,
        });
      }
    });

  } else if (screen === "SCREEN3") {
    const rows = ["A", "B", "C"];
    const cols = 40;
    rows.forEach((row) => {
      for (let i = 1; i <= cols; i++) {
        seats.push({
          seatNumber: `${row}${i.toString().padStart(2, "0")}`,
          isBooked: false,
        });
      }
    });
  }

  return seats;
}


module.exports = {
  randomStringGenerator,
  deleteFile,
  generateSeat
};
