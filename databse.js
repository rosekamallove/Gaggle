const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", true);

class Databse {
  constructor() {
    this.connect();
  }

  connect = () => {
    mongoose
      .connect(
        "mongodb+srv://admin:dbuserpassword@cluster0.semts.mongodb.net/gaggleDB?retryWrites=true&w=majority?authSource=admin"
      )
      .then(() => {
        console.log("databseConnected");
      })
      .catch((err) => {
        console.log("error conecting databse");
        console.log(err);
      });
  };
}

module.exports = new Databse();
