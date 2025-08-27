const { manejo, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createManejo = async (req, res) => {
  try {
    const manejos = await manejo.create(req.body);
    res.status(201).json(manejos);
  } catch (err) {
    console.error("Erro ao criar o manejo: ", err);
    res.status(500).json({ message: "Erro ao criar o manejo." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getManejo = async (req, res) => {
  try {
    const { petId } = req.params;
    const manejos = await manejo.findAll({
      where: { petId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "createdAt", "updatedAt", "petId"],
      include: [
        {
          model: pets,
          as: "pet",
          attributes: ["nomePet", "numeroChip"],
        },
        {
          model: parceiros,
          as: "parceiro",
          attributes: ["razaoSocial", "fantasia", "cnpj", "cpf"],
        },
      ],
    });

    // Caso não existam registros, retorne uma mensagem apropriada
    if (!manejos || manejos.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const manejosFormatados = manejos.map((mane) => ({
      ...mane.toJSON(), //  para acessar os dados corretamente
      createdAt: formatDate(mane.createdAt), // Formata `createdAt`
      updatedAt: formatDate(mane.updatedAt), // Formata `updatedAt`
    }));

    res.status(200).json(manejosFormatados);
  } catch (err) {
    console.error("Erro ao buscar manejos: ", err);
    res.status(500).json({ message: "Erro ao buscar manejos." });
  }
};

exports.getManejoP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const manejos = await manejo.findAll({
      where: { petId, parceiroId: parceiroIdLogado },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "createdAt", "updatedAt", "petId"],
      include: [
        {
          model: pets,
          as: "pet",
          attributes: ["nomePet", "numeroChip"],
        },
        {
          model: parceiros,
          as: "parceiro",
          attributes: ["razaoSocial", "fantasia", "cnpj", "cpf"],
        },
      ],
    });

    // Caso não existam registros, retorne uma mensagem apropriada
    if (!manejos || manejos.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const manejosFormatados = manejos.map((mane) => ({
      ...mane.toJSON(), //  para acessar os dados corretamente
      createdAt: formatDate(mane.createdAt), // Formata `createdAt`
      updatedAt: formatDate(mane.updatedAt), // Formata `updatedAt`
    }));

    res.status(200).json(manejosFormatados);
  } catch (err) {
    console.error("Erro ao buscar manejos: ", err);
    res.status(500).json({ message: "Erro ao buscar manejos." });
  }
};

exports.getManejoId = async (req, res) => {
  try {
    const { id } = req.params;

    const manejoId = await manejo.findByPk(id, {
      attributes: [
        "petId",
        "parceiroId",
        "alimentacao",
        "tipoAlimentacao",
        "horariosAlimentacao",
        "acessoAguaFresca",
        "ambiente",
        "atividadeFisica",
        "contatoComOutrosAnimais",
      ],
      include: [
        {
          model: pets,
          as: "pet",
          attributes: ["nomePet"],
        },
        {
          model: parceiros,
          as: "parceiro",
          attributes: ["razaoSocial"],
        },
      ],
    });

    if (!manejoId) {
      return res.status(404).json({ message: "Manejo não encontrado." });
    }

    res.status(200).json(manejoId);
  } catch (err) {
    console.error("Erro ao buscar o manejo: ", err);
    res.status(500).json({ message: "Erro ao buscar o manejo." });
  }
};

exports.updateManejo = async (req, res) => {
  try {
    const { id } = req.params;

    const manejos = await manejo.findByPk(id);
    if (!manejos) {
      return res.status(404).json({ message: "Manejo não encontrado!" });
    }

    await manejos.update(req.body);
    res.status(200).json({ message: "Manejo atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar o manejo: ", err);
    res.status(500).json({ message: "Erro ao atualizar o manejo." });
  }
};

exports.delManejo = async (req, res) => {
  try {
    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o manejo.",
      });
    }

    const { id } = req.params;
    const deleteRows = await manejo.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res.status(200).json({ message: "Manejo deletado com sucesso!" });
    }

    res.status(404).json({ message: "Manejo não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar o manejo: ", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
