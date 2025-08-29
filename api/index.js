// // api/index.js
// const app = require("../src/server");
// module.exports = app; // sem listen!


// api/index.js
const app = require("../src/server");

module.exports = (req, res) => {
  return app(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
