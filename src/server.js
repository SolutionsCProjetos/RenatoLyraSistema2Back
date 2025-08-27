// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

// ping
app.get("/api/health", (req, res) => res.json({ ok: true }));

// não “await” aqui para não travar cold start
sequelize.authenticate()
  .then(() => console.log("DB ok"))
  .catch(err => console.error("DB error:", err?.message));

module.exports = app;
