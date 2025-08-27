const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  // Verifica se o token possui o prefixo "Bearer " e o extrai
  const bearer = authHeader.split(" ");
  if (bearer.length !== 2 || bearer[0] !== "Bearer") {
    return res.status(401).json({ message: "Formato de token inválido." });
  }

  
  const token = bearer[1];
  // Verifica e decodifica o token JWT
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("Erro ao verificar o token:", err);
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    // Armazena as informações do usuário decodificadas no objeto req
    req.loggedUser = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      empresa: decoded.empresa,
      rule: decoded.rule,
      setor: decoded.setorId,
    };
    next(); // Chama o próximo middleware ou rota
  });
};

module.exports = authMiddleware;
