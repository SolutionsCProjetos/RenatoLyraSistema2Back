// // api/[...all].js  (opção alternativa)
// const app = require('../src/server');
// module.exports = (req, res) => {
//   req.url = req.url.replace(/^\/api/, '');
//   return app(req, res);
// };




// api/[...all].js
const app = require("../src/server");

// CORS na borda (antes do Express)
function setCors(res, origin) {
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
}

module.exports = (req, res) => {
  setCors(res, req.headers.origin);

  // responde o preflight aqui mesmo
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // ⚠️ NÃO remova o /api – deixe o path como veio
  return app(req, res);
};

module.exports.config = { api: { bodyParser: false } };


