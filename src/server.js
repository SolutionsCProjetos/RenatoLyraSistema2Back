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
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

/**
 * Middleware CORS robusto (funciona muito bem na Vercel).
 * Não usa cookies, só Authorization: Bearer.
 */
const ALLOWLIST = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://renato-lyra-sistema2-front.vercel.app",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWLIST.has(origin)) {
    // ecoa o origin quando permitido
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    } else {
      // chamadas sem Origin (server-to-server)
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // se precisar expor o Authorization para ler no front (normalmente não precisa)
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
  }
  // responde preflight imediatamente
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  return next();
});

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Suas rotas (mantém como está)
app.use("/", routes);

// 404 (opcional)
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Conexão DB (sem await)
sequelize
  .authenticate()
  .then(() => console.log("DB ok"))
  .catch((e) => console.error("DB error:", e?.message));

// Exporta o app (sem listen)
module.exports = app;
