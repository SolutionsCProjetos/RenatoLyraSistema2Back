// // api/[...all].js  (opção alternativa)
// const app = require('../src/server');
// module.exports = (req, res) => {
//   req.url = req.url.replace(/^\/api/, '');
//   return app(req, res);
// };


const app = require("../src/server");

module.exports = async (req, res) => {
  // Remove completamente a lógica de CORS personalizada
  // Deixa o Express lidar com CORS através do middleware cors()
  return app(req, res);
};

module.exports.config = { 
  api: { 
    bodyParser: false,
    externalResolver: true 
  } 
};





