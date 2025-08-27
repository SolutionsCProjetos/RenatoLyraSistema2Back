const { categorias } = require("../models");
const { validationResult } = require("express-validator");

exports.createCategorias = async (req, res) => {
  try {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(422).json({ erros: erros.array() });
    }
    const { categoria } = req.body;

    await categorias.create({
      categoria,
    });

    res.status(200).json({ message: "Categoria cadastrado com sucesso!" });
  } catch (err) {
    // Trata erros de restrição de unicidade
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Categoria já cadastrada no banco de dados.",
      });
    }
    // Outros erros do Sequelize ou do servidor
    res.status(500).json({
      message: "Erro ao processar os dados.",
      error: err.message,
    });
  }
};

exports.getCategoria = async (req, res) => {
  try {
    const categoriaAll = await categorias.findAll({
      attributes: ["id", "categoria"],
    });

    const categori = categoriaAll.map((categori) => {
      return {
        id: categori.id,
        categoria: categori.categoria,
      };
    });

    res.status(200).json(categori);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro ao processar os dados.", error: err.message });
  }
};

exports.getCategoriaId = async (req, res) => {
  try {
    let { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json("Id Invalido!");
    }
    const categoriasId = await categorias.findByPk(id, {
      attributes: ["id", "categoria"],
    });
    if (categoriasId) {
      return res.status(200).json(categoriasId);
    }

    res.status(404).json({ message: "Categoria não encontrado!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro ao processar os dados.", error: err });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    let { id } = req.params;
    let { categoria } = req.body;

    // Valida o ID
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido!" });
    }

    // Valida o campo 'categoria'
    if (!categoria) {
      return res
        .status(400)
        .json({ message: "O campo 'categoria' é obrigatório." });
    }

    // Realiza a atualização
    const [updatedRows] = await categorias.update(
      {
        categoria: categoria,
      },
      {
        where: { id: id },
      }
    );

    // Verifica se a atualização foi bem-sucedida
    if (updatedRows > 0) {
      res.status(200).json("Sucesso ao atualizar a categoria!");
    } else {
      res.status(404).json("Categoria não encontrada para atualização!");
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json("Não foi possível se conectar com o banco, chame o suporte!");
  }
};


exports.delCategoria = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json("ID do categoria é inválido ou não foi fornecido na requisição");
    }

    const deleteRows = await categorias.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json("Deletado com sucesso!");
    } else {
      res.status(404).json(`Categoria com id ${id} não encontrada para exclusão!`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(`Erro ao tentar a conexão com o banco!`);
  }
};
