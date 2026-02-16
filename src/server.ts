import express from "express";
import logger from "./logger.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_, res) => {
  logger.info("Received a request to the root endpoint");
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});