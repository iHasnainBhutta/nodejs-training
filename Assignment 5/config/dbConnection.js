import { connect } from "mongoose";

const DBConnect = () => {
  const client = connect(process.env.CONSTRING)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Database connection failed!");
      console.error(err);
      process.exit(1);
    });

  return client;
};

export default DBConnect;
