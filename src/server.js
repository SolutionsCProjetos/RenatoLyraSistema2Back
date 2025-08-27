// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

// ⚠️ Não rode cron/loops/interval aqui (Vercel é serverless)!
const isServerless = !!process.env.VERCEL;
// const OperacoesAtrasadas = require("./config/Check/checkOp");
// const contasAtrasadas = require("./config/Check/checkCon"); 
// const receberAtrasadas = require("./config/Check/checkRec"); 
// const MultaJuros = require("./config/Check/checkMultJurs")

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

// Rotas
app.use("/", routes);

// Rota ping
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Tenta autenticar sem travar cold start
sequelize.authenticate()
  .then(() => console.log("DB ok"))
  .catch(err => console.error("DB error:", err?.message));

module.exports = app;
