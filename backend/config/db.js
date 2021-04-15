const mongoose = require("mongoose");

const connString = process.env.DATABASE_CONNECTION;

const connectDB = async () => {
  try {
    await mongoose.connect(connString, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("MongoDB connection SUCCESS ");
  } catch (error) {
    console.log("MongoDB connection FAILED ");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
