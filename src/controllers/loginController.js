const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const { usuarios, parceiros } = require("../models");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  console.log(email, senha)

  try {
    // Tenta buscar o usuário no banco de dados
    let user = await usuarios.findOne({ where: { email } });

    // Se não encontrar na tabela `usuarios`, tenta na tabela `parceiros`
    if (!user) {
      user = await parceiros.findOne({ where: { email } });
      if (user && user.status !== "Ativo") {
        return res
          .status(403)
          .json({ message: "Parceiro desativado. Contate o administrador." });
      }
    }

    // Se ainda assim não encontrar, retorna erro
    if (!user) {
      return res.status(401).json({ message: "Email ou senha incorretos!" });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha incorretos!" });
    }
    // Gera o token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nome: user.nome || user.razaoSocial,
        rule: user.rule ?? 0,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro ao logar o usuário/parceiro:", error);
    res.status(500).json({ message: "Erro ao realizar login." });
  }
};
