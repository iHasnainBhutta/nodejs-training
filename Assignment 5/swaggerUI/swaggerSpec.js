// eslint-disable-next-line import/no-extraneous-dependencies
import swaggerJSDoc from "swagger-jsdoc";
import swaggerDocument from "./swaggerDoc.js";

const options = {
  definition: swaggerDocument,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
