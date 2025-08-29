// src/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// CORS no Express (sem cookies; só Bearer)
app.use(cors({
  origin: (origin, cb) => cb(null, true), // já ecoado na borda
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Authorization","Content-Type"],
  exposedHeaders: ["Authorization"],
  credentials: false,
  optionsSuccessStatus: 204,
}));
app.options("*", cors());

// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// health (COM prefixo)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// suas rotas (elas devem estar definidas com /api/... dentro de routes)
app.use("/", routes);

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// DB
sequelize.authenticate()
  .then(() => console.log("DB ok"))
  .catch(e => console.error("DB error:", e?.message));

module.exports = app; // sem app.listen na Vercel




















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







































