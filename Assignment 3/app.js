import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import bodyparser from "body-parser";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import { DBConnect } from "./config/dbConnection.js";

const { json: _json } = bodyparser;

config();
const app = express();
app.use(_json());
app.use(morgan("dev"));

app.use(json());
app.use(urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", authRouter);
app.use("/", productRouter);

DBConnect();

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
