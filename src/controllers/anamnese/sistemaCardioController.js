const { sistemaCardio, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createSistemaCardio = async (req, res) => {
  try {
    const cardio = await sistemaCardio.create(req.body);
    res.status(201).json(cardio);
  } catch (err) {
    console.error("Erro ao criar a amnese do sistema cardio: ", err);
    res
      .status(500)
      .json({ message: "Erro ao criar a amnese do sistema cardio." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getSistemaCardio = async (req, res) => {
  try {
    const { petId } = req.params;
    const cardio = await sistemaCardio.findAll({
      where: { petId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "createdAt", "updatedAt", "petId", "parceiroId"],
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
    if (!cardio || cardio.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    // Formatar as datas no resultado
    const cardioFormatados = cardio.map((card) => ({
      ...card.toJSON(),
      createdAt: formatDate(card.createdAt),
      updatedAt: formatDate(card.updatedAt),
    }));

    res.status(200).json(cardioFormatados);
  } catch (err) {
    console.error("Erro ao buscar os registros do sistema cardio: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar os registros do sistema cardio." });
  }
};

exports.getSistemaCardioP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const cardio = await sistemaCardio.findAll({
      where: { petId, parceiroId: parceiroIdLogado },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "createdAt", "updatedAt", "petId", "parceiroId"],
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
    if (!cardio || cardio.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    // Formatar as datas no resultado
    const cardioFormatados = cardio.map((card) => ({
      ...card.toJSON(),
      createdAt: formatDate(card.createdAt),
      updatedAt: formatDate(card.updatedAt),
    }));

    res.status(200).json(cardioFormatados);
  } catch (err) {
    console.error("Erro ao buscar os registros do sistema cardio: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar os registros do sistema cardio." });
  }
};

exports.getSistemaCardioId = async (req, res) => {
  try {
    const { id } = req.params;

    const cardioId = await sistemaCardio.findByPk(id, {
      attributes: [
        "petId",
        "parceiroId",
        "secrecao",
        "descricao",
        "sincope",
        "tosse",
        "espirro",
        "districao_resp",
        "cianose",
        "intolerancia_exer",
        "cansacoFacil",
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

    if (!cardioId) {
      return res
        .status(404)
        .json({ message: "Sistema cardio não encontrado." });
    }

    res.status(200).json(cardioId);
  } catch (err) {
    console.log("Erro ao buscar o registro do sistema cardio: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar o registro do sistema cardio." });
  }
};

exports.updateSistemaCardio = async (req, res) => {
  try {
    const { id } = req.params;

    const cardio = await sistemaCardio.findByPk(id);
    if (!cardio) {
      return res
        .status(404)
        .json({ message: "Sistema cardio não encontrado!" });
    }

    await cardio.update(req.body);
    res.status(200).json({ message: "Sistema cardio atualizado com sucesso!" });
  } catch (err) {
    console.log("Erro ao atualizar o sistema cardio: ", err);
    res.status(500).json({ message: "Erro ao atualizar o sistema cardio." });
  }
};

exports.delSistemaCardio = async (req, res) => {
  try {
    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o sistema cardio.",
      });
    }

    const { id } = req.params;
    const deleteRows = await sistemaCardio.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res
        .status(200)
        .json({ message: "Sistema cardio deletado com sucesso!" });
    }

    res.status(404).json({ message: "Sistema cardio não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar o sistema cardio: ", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
