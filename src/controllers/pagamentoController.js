const { formapagamento } = require("../models");
const { validationResult } = require("express-validator");

exports.createPagamento = async (req, res) => {
  try {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { tipo } = req.body;

    // Cria um novo registro de forma de pagamento
    await formapagamento.create({
      tipo,
    });

    // Retorna sucesso
    res.status(201).json({ message: "pagamento criado com sucesso!" });
  } catch (err) {
    // Trata erros de restrição de unicidade
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Forma de pagamento já cadastrada no banco de dados.",
      });
    }
    // Outros erros do Sequelize ou do servidor
    res.status(500).json({
      message: "Erro ao processar os dados.",
      error: err.message,
    });
  }
};

exports.getPagamento = async (req, res) => {
  try {
    const pagamentos = await formapagamento.findAll({
      attributes: ["id", "tipo"], // Certifique-se que o atributo é "formaPagamento"
    });

    const formasPagamento = pagamentos.map((pagamento) => {
      return {
        id: pagamento.id,
        formasPagamento: pagamento.tipo,
      };
    });

    res.status(200).json(formasPagamento);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro ao processar os dados.", error: err.message });
  }
};

exports.getPagamentoId = async (req, res) => {
  try {
    let { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json("Id Invalido!");
    } else {
      const pagamento = await formapagamento.findByPk(id, {
        attributes: ["tipo"],
      });
      if (pagamento) {
        res.status(200).json(pagamento);
      } else {
        res.status(404).json({ message: "pagamento não encontrado!" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

exports.updatePagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;

    // Valida o ID
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido!" });
    }
    console.log("ID recebido:", id);

    // Verifica se o registro existe antes de atualizar
    console.log("Corpo recebido:", req.body);
    const pagamentoExistente = await formapagamento.findOne({
      where: { id: id },
    });
    if (!pagamentoExistente) {
      return res.status(404).json({ message: "Pagamento não encontrado!" });
    }

    // Realiza a atualização
    formapagamento.update(
      {
        tipo: tipo,
      },
      {
        where: { id: id },
      }
    ).then(() => {
      res.status(200).json({ message: "Pagamento atualizado com sucesso!" });
    }).catch((err) => {
      res.status(404).json({ message: "Falha ao atualizar o pagamento!" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Erro ao se conectar com o banco, chame o suporte.",
      error: err.message,
    });
  }
};

exports.delPagamento = async (req, res) => {
  try {
    let { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json(
          "ID da Forma pagamento inválido ou não foi fornecido na requisição"
        );
    }

    const deleteRows = await formapagamento.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json("Deletado com sucesso!");
    } else {
      res
        .status(404)
        .json(`Forma pagamento com id ${id} não encontrada para exclusão!`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(`Erro ao tentar a conexão com o banco!`);
  }
};
