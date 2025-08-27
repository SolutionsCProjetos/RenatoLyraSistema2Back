const { setores } = require("../models");
const { validationResult } = require("express-validator");

exports.createSetores = async (req, res) => {
    try{
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(422).json({ erros: erros.array() });
        }
        const { setor } = req.body;

        await setores.create({
          setor,
        });

        res.status(200).json({ message: "Setor cadastrado com sucesso!"});
    } catch (err) {
      // Trata erros de restrição de unicidade
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "setor já cadastrado no banco de dados.",
        });
      }
      // Outros erros do Sequelize ou do servidor
      res.status(500).json({
        message: "Erro ao processar os dados.",
        error: err.message,
      });
    }
}

exports.getSetores = async (req, res) => {
    try {
        const setoresAll = await setores.findAll({
          attributes: ["id", "setor"],
        });

        const setor = setoresAll.map((sector) => {
          return {
            id: sector.id,
            setor: sector.setor,
          };
        });
        
        res.status(200).json(setor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao processar os dados.", error: err.message });
    }
}

exports.getSetoresId = async (req, res) => {
    try {
        let { id } = req.params;
        if(isNaN(id)) {
            return res.status(400).json("Id Invalido!");
        }
        const setoresId = await setores.findByPk(id, {
          attributes: ["id", "setor"],
        });
        if (setoresId) {
          return res.status(200).json(setoresId);
        } 

        res.status(404).json({ message: "Setor não encontrado!" });
    } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Erro ao processar os dados.", error: err });
    }
}

exports.uptadeSetor = async (req, res) => {
    try { 
        let { id } = req.params;
        let { setor } = req.body;

        setores.update(
            {
              setor: setor,
            },
            {
              where: { id: id },
            }
          )
          .then(() => {
            res.status(200).json("sucesso ao atualizar o setor!");
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

exports.delSetor = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id || isNaN(id)) {
          return res
            .status(400)
            .json(
              "ID do setor é inválido ou não foi fornecido na requisição"
            );
        }

        const deleteRows = await setores.destroy({
          where: { id: id },
        });

        if (deleteRows > 0) {
          res.status(200).json("Deletado com sucesso!");
        } else {
          res
            .status(404)
            .json(`Setor com id ${id} não encontrada para exclusão!`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(`Erro ao tentar a conexão com o banco!`);
    }
}