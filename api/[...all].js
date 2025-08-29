// // api/[...all].js  (opção alternativa)
// const app = require('../src/server');
// module.exports = (req, res) => {
//   req.url = req.url.replace(/^\/api/, '');
//   return app(req, res);
// };

// api/[...all].js
const app = require("../src/server");

module.exports = (req, res) => {
  // CORS já tratado aqui se quiser
  return app(req, res); // não mexe em req.url
};

module.exports.config = { api: { bodyParser: false } };


