const {tokensenha, usuarios} = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");


exports.createToken = async (req, res) => {
  try {
    const { email } = req.body;

    const usuarioEmail = await usuarios.findOne({ where: { email } });

    if (!usuarioEmail) {
      return res.status(404).json({ message: "E-mail não encontrado." });
    }

    const token = uuidv4();

    const newToken = await tokensenha.create({
      token,
      userId: usuarioEmail.id,
      used: 0,
    });

    res.status(201).json(newToken);
  } catch (err) {
    console.log("Erro ao gerar token: ", err);
    res.status(400).json({ message: "Erro ao gerar o token." });
  }
};

// Validação do Token e Atualização da Senha
exports.updatePassword = async (req, res) => {
  try {
    const { token, novaSenha } = req.body; // O token e a nova senha vêm do corpo da requisição

    // Verificar se o token existe e está válido
    const resultado = await tokensenha.findOne({
      where: { token },
      include: [{ model: usuarios, as: "usuario" }],
    });

    if (!resultado) {
      return res.status(404).json({ message: "Token não encontrado." });
    }

    if (resultado.used) {
      return res.status(400).json({ message: "Token já foi utilizado." });
    }

    if (!novaSenha) {
      return res.status(400).json({ message: "A nova senha é obrigatória." });
    }

    const usuario = resultado.usuario;
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    usuario.senha = hashedPassword;
    await usuario.save(); // Salvar o usuário atualizado

    // Marcar o token como utilizado
    resultado.used = true;
    await resultado.save();

    res.status(200).json({ message: "Senha atualizada com sucesso." });
  } catch (err) {
    console.log("Erro ao atualizar a senha: ", err);
    res.status(500).json({ message: "Erro ao atualizar a senha." });
  }
};
