// // api/[...all].js  (opção alternativa)
// const app = require('../src/server');
// module.exports = (req, res) => {
//   req.url = req.url.replace(/^\/api/, '');
//   return app(req, res);
// };


// api/[...all].js
// Captura QUALQUER rota /api/** e injeta CORS antes de despachar pro Express

const app = require("../src/server");

// Lista de origins permitidos (adicione os que precisar)
const ALLOWLIST = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://renato-lyra-sistema2-front.vercel.app",
]);

function setCors(res, originHeader) {
  if (!originHeader) {
    // chamadas server-to-server
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (ALLOWLIST.has(originHeader)) {
    res.setHeader("Access-Control-Allow-Origin", originHeader);
    res.setHeader("Vary", "Origin");
  } else {
    // se quiser bloquear origens desconhecidas, troque por um return 403 aqui
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
}

module.exports = (req, res) => {
  // Injeta CORS SEMPRE (inclui 404/500)
  setCors(res, req.headers.origin);

  // Responde o preflight AQUI mesmo (antes do Express)
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // Remove o prefixo /api para casar com suas rotas do Express
  // Ex.: /api/usuario -> /usuario
  req.url = req.url.replace(/^\/api\b/, "");

  // Despacha pro Express
  return app(req, res);
};

// Evita o body parser da Vercel interferir no stream
module.exports.config = {
  api: { bodyParser: false },
};

