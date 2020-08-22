import express from "express";
import fs from "fs";
import { promisify } from "util";
import winston from "winston";
import userRouter from "./routes/user.js";
import trainerRouter from "./routes/trainer.js";
import cors from "cors";

const app = express();
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.fileName = "YouFit.json";

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use("/images", express.static("public"));
app.use("/user", userRouter);
app.use("/trainer", trainerRouter);

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "YouFit.log" }),
  ],
  format: combine(label({ label: "YouFit" }), timestamp(), myFormat),
});

app.listen(3333, async () => {
  try {
    const fileExists = await exists(global.fileName);
    if (!fileExists) {
      const initialJson = {
        nextId: 1,
        nextTrainerId: 1,
        user: [],
        trainer: [],
      };
      await writeFile(global.fileName, JSON.stringify(initialJson));
    }
  } catch (err) {
    logger.error(err);
  }
  logger.info("API started!");
});
