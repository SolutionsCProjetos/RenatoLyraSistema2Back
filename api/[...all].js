// api/[...all].js  (opção alternativa)
const app = require('../src/server');
module.exports = (req, res) => {
  req.url = req.url.replace(/^\/api/, '');
  return app(req, res);
};
