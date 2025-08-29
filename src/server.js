// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// ---- CORS ----
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // ecoa o origin se existir, senão libera geral
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");

  // responde preflight sem passar pro restante
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});
// ----------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/", routes);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

sequelize
  .authenticate()
  .then(() => console.log("DB ok"))
  .catch((e) => console.error("DB error:", e?.message));

module.exports = app;


































// // src/server.js
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// dotenv.config();

// const { sequelize } = require("./models");
// const routes = require("./routes");

// const app = express();

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.options("*", cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/", routes);

// // ping
// app.get("/api/health", (req, res) => res.json({ ok: true }));

// // tenta conectar no DB (sem await)
// sequelize.authenticate()
//   .then(() => console.log("DB ok"))
//   .catch(e => console.error("DB error:", e?.message));

// // 👇 EXPORTA SEM DAR LISTEN (sempre)
// module.exports = app;



































