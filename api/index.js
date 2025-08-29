// // api/index.js
// const app = require("../src/server");
// module.exports = app; // sem listen!


// api/index.js
const app = require("../src/server");

// Exporta como função (garante compatibilidade do @vercel/node)
module.exports = (req, res) => app(req, res);

// Opcional: evita o bodyParser da Vercel mexer no stream antes do Express
module.exports.config = {
  api: { bodyParser: false },
};
