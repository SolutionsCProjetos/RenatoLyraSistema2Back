const { tipo } = require("../models");
const { validationResult } = require("express-validator");

exports.createTipos = async (req, res) => {
  try {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(422).json({ erros: erros.array() });
    }
    const { comercio } = req.body;

    await tipo.create({
      comercio,
    });

    res.status(200).json({ message: "Comercio cadastrado com sucesso!" });
  } catch (err) {
    // Trata erros de restrição de unicidade
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Comercio já cadastrado no banco de dados.",
      });
    }
    // Outros erros do Sequelize ou do servidor
    res.status(500).json({
      message: "Erro ao processar os dados.",
      error: err.message,
    });
  }
};

exports.getTipo = async (req, res) => {
  try {
    const tipoAll = await tipo.findAll({
      attributes: ["id", "comercio"],
    });

    const tipos = tipoAll.map((ecomece) => {
      return {
        id: ecomece.id,
        comercio: ecomece.comercio,
      };
    });

    res.status(200).json(tipos);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro ao processar os dados.", error: err.message });
  }
};

exports.getTipoId = async (req, res) => {
  try {
    let { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json("Id Invalido!");
    }
    const tipoId = await tipo.findByPk(id, {
      attributes: ["id", "comercio"],
    });
    if (tipoId) {
      return res.status(200).json(tipoId);
    }

    res.status(404).json({ message: "Comercio não encontrado!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro ao processar os dados.", error: err });
  }
};

exports.uptadeTipo = async (req, res) => {
  try {
    let { id } = req.params;
    let { comercio } = req.body;

    tipo
      .update({ comercio }, { where: { id: id } })
      .then(() => {
        res.status(200).json({ message: "sucesso ao atualizar o comercio!" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Não foi possivel atualizar os dados no banco!"});
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Não foi possivel se conectar com o banco, chame o suporte!"});
  }
};

exports.delTipo = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json("ID do comercio é inválido ou não foi fornecido na requisição");
    }

    const deleteRows = await tipo.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json("Deletado com sucesso!");
    } else {
      res
        .status(404)
        .json(`Comercio com id ${id} não encontrada para exclusão!`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(`Erro ao tentar a conexão com o banco!`);
  }
};
