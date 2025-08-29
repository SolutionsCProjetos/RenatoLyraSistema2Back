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
 * CORS — sem cookies (apenas Bearer)
 * Se você realmente não usa cookies HttpOnly, este é o caminho mais estável.
 * - NÃO usar credentials: true
 * - Liberar apenas os origins conhecidos
 * - Garantir preflight (OPTIONS) com os mesmos corsOptions
 */
const allowlist = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://renato-lyra-sistema2-front.vercel.app",
];

const corsOptions = {
  origin(origin, cb) {
    // Permite chamadas server-to-server (sem Origin) e tools internas
    if (!origin) return cb(null, true);
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: false, // importante quando NÃO utiliza cookies
};

// Aplica CORS para todas as rotas e garante preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Suas rotas
app.use("/", routes);

// 404 padrão (opcional)
app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

// Conexão com o DB (sem await)
sequelize
  .authenticate()
  .then(() => console.log("DB ok"))
  .catch((e) => console.error("DB error:", e?.message));

// Exporta o app (Vercel usa isso como handler). Não dar listen aqui.
module.exports = app;


