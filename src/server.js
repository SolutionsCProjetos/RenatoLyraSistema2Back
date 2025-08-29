const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// Configuração simplificada do CORS
app.use(cors({
  origin: true, // Permite qualquer origem (ou defina origens específicas)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  exposedHeaders: ["Authorization"],
  credentials: false,
  optionsSuccessStatus: 200
}));

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health checks
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Rotas
app.use("/", routes);
app.use("/api", routes);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

// DB
sequelize.authenticate()
  .then(() => console.log("DB ok"))
  .catch(e => console.error("DB error:", e?.message));

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









































