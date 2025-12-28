const mongoose = require("mongoose");
module.exports.connectdb = () => {
  return mongoose
    .connect(
      "mongodb+srv://reemebrahim:A6dg7ia4%40@cluster0.qszet85.mongodb.net/tiktok"
    )
    .then(() => {
      console.log("done connect to database");
    })
    .catch((error) => {
      console.log("error in connect", error);
    });
};
