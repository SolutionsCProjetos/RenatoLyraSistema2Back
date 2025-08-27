const { racas } = require("../models");
const { validationResult } = require("express-validator");

exports.createRacas = async (req, res) => {
    try{
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(422).json({ erros: erros.array() });
        }
        const { raca } = req.body;

        await racas.create({
            raca,
        });

        res.status(200).json({ message: "Raça cadastrado com sucesso!"});
    } catch (err) {
      // Trata erros de restrição de unicidade
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Raça já cadastrado no banco de dados.",
        });
      }
      // Outros erros do Sequelize ou do servidor
      res.status(500).json({
        message: "Erro ao processar os dados.",
        error: err.message,
      });
    }
}

exports.getRacas = async (req, res) => {
    try {
        const racasAll = await racas.findAll({
          attributes: ["id", "raca"],
        });

        const raca = racasAll.map((racaList) => {
          return {
            id: racaList.id,
            raca: racaList.raca,
          };
        });
        
        res.status(200).json(raca);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao processar os dados.", error: err.message });
    }
}

exports.getRacaId = async (req, res) => {
    try {
        let { id } = req.params;
        if(isNaN(id)) {
            return res.status(400).json("Id Invalido!");
        }
        const racaId = await racas.findByPk(id, {
          attributes: ["id", "raca"],
        });
        if (racaId) {
          return res.status(200).json(racaId);
        } 

        res.status(404).json({ message: "Raça não encontrado!" });
    } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Erro ao processar os dados.", error: err });
    }
}

exports.uptadeRaca = async (req, res) => {
    try { 
        let { id } = req.params;
        let { raca } = req.body;

        racas.update(
            {
              raca: raca,
            },
            {
              where: { id: id },
            }
          )
          .then(() => {
            res.status(200).json("sucesso ao atualizar o raça!");
          })
          .catch((err) => {
            console.error(err);
            res
              .status(404)
              .json("Não foi possivel atualizar os dados no banco!");
          });
    } catch (err) {
        console.error(err);
        res.status(500).json("Não foi possivel se conectar com o banco, chame o suporte!");
    }
}

exports.delRaca = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id || isNaN(id)) {
          return res
            .status(400)
            .json(
              "ID do raça é inválido ou não foi fornecido na requisição"
            );
        }

        const deleteRows = await racas.destroy({
          where: { id: id },
        });

        if (deleteRows > 0) {
          res.status(200).json("Deletado com sucesso!");
        } else {
          res
            .status(404)
            .json(`Raça com id ${id} não encontrada para exclusão!`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(`Erro ao tentar a conexão com o banco!`);
    }
}