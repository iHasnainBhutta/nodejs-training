import { connect } from "mongoose";

const DBConnect = () => {

  const client = connect("mongodb+srv://hasnain-bhutta:39sVAZSb7K48NtXw@cluster1.nrjgdbr.mongodb.net/")
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
