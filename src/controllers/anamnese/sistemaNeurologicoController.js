const { sistemaNeurologico, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createSistemaNeurologico = async (req, res) => {
  try {
    const neuros = await sistemaNeurologico.create(req.body);
    res.status(201).json(neuros);
  } catch (err) {
    console.error("Erro ao criar a anamnese do sistema neurológico: ", err);
    res
      .status(500)
      .json({ message: "Erro ao criar a anamnese do sistema neurológico." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getSistemaNeurologico = async (req, res) => {
  try {
    const { petId } = req.params;
    const neurosSist = await sistemaNeurologico.findAll({
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
    if (!neurosSist || neurosSist.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const neuroFormatados = neurosSist.map((neuro) => ({
      ...neuro.toJSON(),
      createdAt: formatDate(neuro.createdAt),
      updatedAt: formatDate(neuro.updatedAt),
    }));

    res.status(200).json(neuroFormatados);
  } catch (err) {
    console.error("Erro ao buscar registros do sistema neurológico: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar registros do sistema neurológico." });
  }
};
exports.getSistemaNeurologicoP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const neurosSist = await sistemaNeurologico.findAll({
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
    if (!neurosSist || neurosSist.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const neuroFormatados = neurosSist.map((neuro) => ({
      ...neuro.toJSON(),
      createdAt: formatDate(neuro.createdAt),
      updatedAt: formatDate(neuro.updatedAt),
    }));

    res.status(200).json(neuroFormatados);
  } catch (err) {
    console.error("Erro ao buscar registros do sistema neurológico: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar registros do sistema neurológico." });
  }
};

exports.getSistemaNeurologicoId = async (req, res) => {
  try {
    const { id } = req.params;

    const neuroId = await sistemaNeurologico.findByPk(id, {
      attributes: [
        "petId",
        "parceiroId",
        "convulsoes",
        "alteracaoComportamental",
        "andarEmCirculo",
        "headTilt",
        "nistagmo",
        "paralisia",
        "tremores",
        "ataxia",
        "reflexosAlterados",
        "descricaoGeral",
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

    if (!neuroId) {
      return res
        .status(404)
        .json({ message: "Exame do sistema neurológico não encontrado." });
    }

    res.status(200).json(neuroId);
  } catch (err) {
    console.error("Erro ao buscar o exame do sistema neurológico: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar o exame do sistema neurológico." });
  }
};

exports.updateSistemaNeurologico = async (req, res) => {
  try {
    const { id } = req.params;

    const neuros = await sistemaNeurologico.findByPk(id);
    if (!neuros) {
      return res
        .status(404)
        .json({ message: "Exame do sistema neurológico não encontrado!" });
    }

    await neuros.update(req.body);
    res
      .status(200)
      .json({ message: "Sistema neurológico atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar o sistema neurológico: ", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar o sistema neurológico." });
  }
};

exports.delSistemaNeurologico = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o exame do sistema neurológico.",
      });
    }

    const deleteRows = await sistemaNeurologico.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res
        .status(200)
        .json({ message: "Sistema neurológico deletado com sucesso!" });
    }

    res.status(404).json({ message: "Sistema neurológico não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar o sistema neurológico: ", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
