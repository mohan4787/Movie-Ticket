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
// let seats = [];
// const generateSeats = () => {
//   for (let i = 0; i < 9; i++) {
//     for (let j = 1; j < 3; j++) {
//       seats[i] = `A${i}${j}`;

//       seats[i+8]= `B${i}${j}`;

//        seats[i+16]= `C${i}${j}`;
//     }
//   }
// //   console.log(seats);
  
// };

// generateSeats();

module.exports = {
  randomStringGenerator,
  deleteFile,
};
