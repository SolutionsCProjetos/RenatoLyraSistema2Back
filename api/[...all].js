// // api/[...all].js  (opção alternativa)
// const app = require('../src/server');
// module.exports = (req, res) => {
//   req.url = req.url.replace(/^\/api/, '');
//   return app(req, res);
// };

// api/[...all].js — injeta CORS + encaminha pro Express
const app = require("../src/server");

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

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // Remove APENAS o primeiro "/api" do começo do path.
  if (req.url.startsWith("/api/")) {
    req.url = req.url.slice(4); // "/api".length === 4
  } else if (req.url === "/api") {
    req.url = "/";
  }

  return app(req, res);
};
module.exports.config = { api: { bodyParser: false } };



