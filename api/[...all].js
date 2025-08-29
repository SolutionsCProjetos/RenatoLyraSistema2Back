// // api/[...all].js  (opção alternativa)
// const app = require('../src/server');
// module.exports = (req, res) => {
//   req.url = req.url.replace(/^\/api/, '');
//   return app(req, res);
// };



// api/[...all].js
const app = require("../src/server");

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  // Ecoa os métodos/headers que o navegador solicitou no preflight
  const reqMethod = req.headers["access-control-request-method"];
  const reqHeaders = req.headers["access-control-request-headers"];

  res.setHeader(
    "Access-Control-Allow-Methods",
    reqMethod ? `${reqMethod},OPTIONS` : "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    reqHeaders || "Authorization, Content-Type"
  );

  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  // opcional: cache do preflight
  res.setHeader("Access-Control-Max-Age", "600");
}

module.exports = (req, res) => {
  setCors(req, res);

  // Responde o preflight aqui mesmo
  if (req.method === "OPTIONS") {
    res.statusCode = 200;       // 200 evita algum proxy que poda headers no 204
    res.setHeader("Content-Length", "0");
    return res.end();
  }

  // NÃO mexe no path (mantemos /api/...)
  return app(req, res);
};

module.exports.config = { api: { bodyParser: false } };




