const { vacinas } = require("../models");
const { validationResult } = require("express-validator");

exports.createVacinas = async (req, res) => {
    try{
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(422).json({ erros: erros.array() });
        }
        const { nomeVacina } = req.body;

        await vacinas.create({
          nomeVacina,
        });

        res.status(200).json({ message: "Vacina cadastrado com sucesso!"});
    } catch (err) {
      // Trata erros de restrição de unicidade
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Vacina já cadastrado no banco de dados.",
        });
      }
      // Outros erros do Sequelize ou do servidor
      res.status(500).json({
        message: "Erro ao processar os dados.",
        error: err.message,
      });
    }
}

exports.getVacinas = async (req, res) => {
    try {
        const vacinasAll = await vacinas.findAll({
          attributes: ["id", "nomeVacina"],
        });

        const vacina = vacinasAll.map((vacinaList) => {
          return {
            id: vacinaList.id,
            nomeVacina: vacinaList.nomeVacina,
          };
        });
        
        res.status(200).json(vacina);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao processar os dados.", error: err.message });
    }
}

exports.getVacinasId = async (req, res) => {
    try {
        let { id } = req.params;
        if(isNaN(id)) {
            return res.status(400).json("Id Invalido!");
        }
        const vacinaId = await vacinas.findByPk(id, {
          attributes: ["id", "nomeVacina"],
        });
        if (vacinaId) {
          return res.status(200).json(vacinaId);
        } 

        res.status(404).json({ message: "Vacina não encontrada!" });
    } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Erro ao processar os dados.", error: err });
    }
}

exports.uptadeVacinas = async (req, res) => {
    try { 
        let { id } = req.params;
        let { nomeVacina } = req.body;

        vacinas.update(
            {
              nomeVacina: nomeVacina,
            },
            {
              where: { id: id },
            }
          )
          .then(() => {
            res.status(200).json("sucesso ao atualizar a Vacina!");
          })
          .catch((err) => {
            console.error(err);
            res
              .status(500)
              .json("Não foi possivel atualizar os dados no banco!");
          });
    } catch (err) {
        console.error(err);
        res.status(500).json("Não foi possivel se conectar com o banco, chame o suporte!");
    }
}

exports.delVacinas = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id || isNaN(id)) {
          return res
            .status(400)
            .json(
              "ID da Vacina é inválido ou não foi fornecido na requisição"
            );
        }

        const deleteRows = await vacinas.destroy({
          where: { id: id },
        });

        if (deleteRows > 0) {
          res.status(200).json("Deletado com sucesso!");
        } else {
          res
            .status(404)
            .json(`Vacina com id ${id} não encontrada para exclusão!`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(`Erro ao tentar a conexão com o banco!`);
    }
}