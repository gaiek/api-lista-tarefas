import express from "express";
import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/routes";
import logger from "./logger";

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API de Lista de Tarefas",
      version: "1.0.0",
      description: "API para gerenciar uma lista de tarefas",
    },
  },
  apis: ["./src/routes/routes.ts"],
};

app.use(express.json());

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});