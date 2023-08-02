import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import cluster from "cluster";
import os from "os";
import morgan from "morgan";
// eslint-disable-next-line import/no-extraneous-dependencies
import swaggerUi from "swagger-ui-express";
import DBConnect from "./config/dbConnection.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import swaggerSpec from "./swaggerUI/swaggerSpec.js";

config();

const app = express();
const port = process.env.PORT || 8008;

const setupWorkerProcesses = () => {
  const numCores = os.cpus().length;
  console.log(`Master cluster setting up ${numCores} workers`);

  for (let i = 0; i < numCores; i += 1) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is listening`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log("Starting a new worker");
    cluster.fork();
  });
};

const setUpExpress = () => {
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
  }

  app.set("view engine", "ejs");
  app.use(express.static("public"));

  app.use("/", authRouter);
  app.use("/", productRouter);

  DBConnect();

  app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
  });

  app.on("error", (appErr, appCtx) => {
    console.error("app error", appErr.stack);
    console.error("on url", appCtx.req.url);
    console.error("with headers", appCtx.req.headers);
  });
};

const setupServer = (isClusterRequired) => {
  if (isClusterRequired && cluster.isPrimary) {
    setupWorkerProcesses();
  } else {
    setUpExpress();
  }
};

setupServer(true);

export default app;
