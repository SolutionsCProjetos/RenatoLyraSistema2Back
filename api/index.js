// // api/index.js
// const app = require("../src/server");
// module.exports = app; // sem listen!


// api/index.js
const app = require("../src/server");

module.exports = async (req, res) => {
  // CORS MANUAL - resolve tudo aqui
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  // Responde imediatamente para OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Log para debug
  console.log(`${req.method} ${req.url} - Origin: ${origin}`);

  return app(req, res);
};
