import express from "express";
import morgan from "morgan";
import os from "os";
import { createClient } from "redis";

const app = express();

// Set up Redis client
const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

// Custom stream for Morgan to write logs to Redis
const redisLogStream = {
  write: (log: any) => {
    // Here, you can customize the log format before storing it in Redis
    // For example, you can parse the log string and convert it to JSON format
    try {
      const logData = JSON.parse(log);
      redisClient.lPush("logs", JSON.stringify(logData));
    } catch (err) {
      console.error("Error parsing log:", err);
    }
  },
};

// Use Morgan with custom log stream
app.use(morgan("combined", { stream: redisLogStream }));

app.get("/", (req, res) => {
  res.send(`Hello from Hostname: ${os.hostname()} \n`);
});

app.get("/static", (req, res) => {
  // send a static file
  res.sendFile(__dirname + "/static/index.html");
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
