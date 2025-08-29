// // api/index.js
// const app = require("../src/server");
// module.exports = app; // sem listen!


// api/index.js
const app = require("../src/server");

module.exports = (req, res) => {
  return app(req, res);
};

// NÃO precisa de config se não usar bodyParser
