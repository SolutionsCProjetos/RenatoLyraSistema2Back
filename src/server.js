// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// ---- CORS via pacote oficial (sem cookies; só Bearer) ----
const allowlist = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://renato-lyra-sistema2-front.vercel.app",
]);

const corsOptionsDelegate = (req, cb) => {
  const origin = req.header("Origin");
  // Server-to-server
  if (!origin) {
    return cb(null, {
      origin: "*",
      methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      allowedHeaders: "Authorization, Content-Type",
      exposedHeaders: "Authorization",
      optionsSuccessStatus: 204,
    });
  }
  // Browser
  if (allowlist.has(origin)) {
    return cb(null, {
      origin,
      credentials: false, // não usamos cookies
      methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      allowedHeaders: "Authorization, Content-Type",
      exposedHeaders: "Authorization",
      optionsSuccessStatus: 204,
    });
  }
  return cb(null, { origin: false });
};

app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate));
// -----------------------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

/**
 * Suas rotas.
 * Como o handler da Vercel remove "/api", mantenha suas rotas
 * como estavam (ex.: router.get("/usuario", ...)).
 * Se você já tiver alguma rota com "/api/..." dentro do routes,
 * tudo bem — fica acessível por /api/api/... (evite isso).
 */
app.use("/", routes);

// 404 padrão
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// DB (sem await)
sequelize
  .authenticate()
  .then(() => console.log("DB ok"))
  .catch((e) => console.error("DB error:", e?.message));

module.exports = app; // NÃO dar app.listen na Vercel


































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





































