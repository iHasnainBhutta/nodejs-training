require("dotenv").config();
const express = require("express");
const DBConnect = require("./config/dbConnection");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

const postRoutes = require("./routes/authRouter");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", postRoutes);

DBConnect();

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
