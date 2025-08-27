const { sistemaGastro, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createSistemaGastro = async (req, res) => {
  try {
    const gastro = await sistemaGastro.create(req.body);
    res.status(201).json(gastro);
  } catch (err) {
    console.error("Erro ao criar a anamnese do sistema gastro: ", err);
    res
      .status(500)
      .json({ message: "Erro ao criar a anamnese do sistema gastro." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getSistemaGastro = async (req, res) => {
  try {
    const { petId } = req.params;
    const gastro = await sistemaGastro.findAll({
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
    if (!gastro || gastro.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const gastroFormatados = gastro.map((gast) => ({
      ...gast.toJSON(),
      createdAt: formatDate(gast.createdAt),
      updatedAt: formatDate(gast.updatedAt),
    }));

    res.status(200).json(gastroFormatados);
  } catch (err) {
    console.error("Erro ao buscar os registros do sistema gastro: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar os registros do sistema gastro." });
  }
};

exports.getSistemaGastroP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id; // Obtém o parceiroId do parceiro logado
    if (!parceiroIdLogado) {
      return res.status(401).json({ message: "Parceiro não autenticado." });
    }

    const gastro = await sistemaGastro.findAll({
      where: {
        petId,
        parceiroId: parceiroIdLogado, // Filtra pelo parceiro logado
      },
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
    if (!gastro || gastro.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const gastroFormatados = gastro.map((gast) => ({
      ...gast.toJSON(),
      createdAt: formatDate(gast.createdAt),
      updatedAt: formatDate(gast.updatedAt),
    }));

    res.status(200).json(gastroFormatados);
  } catch (err) {
    console.error("Erro ao buscar os registros do sistema gastro: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar os registros do sistema gastro." });
  }
};


exports.getSistemaGastroId = async (req, res) => {
  try {
    const { id } = req.params;

    const gastro = await sistemaGastro.findByPk(id, {
      attributes: [
        "petId",
        "parceiroId",
        "apetite",
        "frequencia",
        "coloracao",
        "hematemese",
        "diarreia",
        "melena",
        "hematoquesia",
        "disquesia",
        "tenesmo",
        "aquesia",
      ],
      include: [
        {
          model: pets,
          as: "pet", // Substituir pelo alias correto configurado no modelo
          attributes: ["nomePet"],
        },
        {
          model: parceiros,
          as: "parceiro", // Substituir pelo alias correto configurado no modelo
          attributes: ["razaoSocial"],
        },
      ],
    });

    if (!gastro) {
      return res
        .status(404)
        .json({ message: "Exame do sistema gastro não encontrado." });
    }

    res.status(200).json(gastro);
  } catch (err) {
    console.error("Erro ao buscar o exame do sistema gastro: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar o exame do sistema gastro." });
  }
};

exports.updateSistemaGastro = async (req, res) => {
  try {
    const { id } = req.params;

    const gastro = await sistemaGastro.findByPk(id);
    if (!gastro) {
      return res
        .status(404)
        .json({ message: "Exame do sistema gastro não encontrado!" });
    }

    await gastro.update(req.body);
    res.status(200).json({ message: "Sistema gastro atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar o exame do sistema gastro: ", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar o exame do sistema gastro." });
  }
};

exports.delSistemaGastro = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o exame do sistema gastro.",
      });
    }

    const deleteRows = await sistemaGastro.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res
        .status(200)
        .json({ message: "Sistema gastro deletado com sucesso!" });
    }

    res.status(404).json({ message: "Sistema gastro não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar o exame do sistema gastro: ", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
