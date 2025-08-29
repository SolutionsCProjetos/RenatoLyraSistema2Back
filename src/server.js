// src/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

/**
 * CORS (sem cookies; só Bearer). Usa o pacote oficial.
 * - responde OPTIONS 204 automaticamente
 * - permite Authorization no preflight
 */
const allowlist = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://renato-lyra-sistema2-front.vercel.app",
]);

const corsOptionsDelegate = (req, cb) => {
  const origin = req.header("Origin");
  let corsOptions;
  if (!origin) {
    // server-to-server
    corsOptions = { origin: "*", methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS", allowedHeaders: "Authorization, Content-Type" };
  } else if (allowlist.has(origin)) {
    corsOptions = {
      origin: origin,
      methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      allowedHeaders: "Authorization, Content-Type",
      exposedHeaders: "Authorization",
      credentials: false,
      optionsSuccessStatus: 204,
    };
  } else {
    // bloqueia origens não permitidas
    corsOptions = { origin: false };
  }
  cb(null, corsOptions);
};

// CORS para todas as rotas
app.use(cors(corsOptionsDelegate));
// CORS específico pro preflight (resolve antes de chegar nas rotas)
app.options("*", cors(corsOptionsDelegate));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Suas rotas (ex.: /api/usuario, etc.)
app.use("/", routes);

// 404 padrão
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// DB (sem await)
sequelize
  .authenticate()
  .then(() => console.log("DB ok"))
  .catch((e) => console.error("DB error:", e?.message));

module.exports = app; // NUNCA dar app.listen na Vercel



































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




































