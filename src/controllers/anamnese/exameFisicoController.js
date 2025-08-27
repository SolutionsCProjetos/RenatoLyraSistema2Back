const { exameFisico, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createExameFisico = async (req, res) => {
  try {
    const exameFisicos = await exameFisico.create(req.body);
    res.status(201).json(exameFisicos);
  } catch (err) {
    console.error("Erro ao criar o exame físico: ", err);
    res.status(500).json({ message: "Erro ao criar o exame físico." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getExameFisico = async (req, res) => {
  try {
    const { petId } = req.params;
    const examesFisico = await exameFisico.findAll({
      where: { petId },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "createdAt",
        "updatedAt",
        "petId",
        "parceiroId",
        "frequenciaCardiaca",
        "frequenciaRespiratoria",
        "temperatura",
      ],
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

    // Caso não existam registros, retorne
    if (!examesFisico || examesFisico.length === 0) {
      return res
        .status(404)
        .json({
          message: "Nenhum exame físico encontrado para o petId fornecido.",
        });
    }

    // Formatar as datas no resultado
    const examesFisicoFormatados = examesFisico.map((exame) => ({
      ...exame.toJSON(),
      createdAt: formatDate(exame.createdAt),
      updatedAt: formatDate(exame.updatedAt),
    }));

    res.status(200).json(examesFisicoFormatados);
  } catch (err) {
    console.error("Erro ao buscar exames físicos: ", err);
    res.status(500).json({ message: "Erro ao buscar exames físicos." });
  }
};

exports.getExameFisicoP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const examesFisico = await exameFisico.findAll({
      where: { petId, parceiroId: parceiroIdLogado },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "createdAt",
        "updatedAt",
        "petId",
        "parceiroId",
        "frequenciaCardiaca",
        "frequenciaRespiratoria",
        "temperatura",
      ],
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

    // Caso não existam registros, retorne
    if (!examesFisico || examesFisico.length === 0) {
      return res
        .status(404)
        .json({
          message: "Nenhum exame físico encontrado para o petId fornecido.",
        });
    }

    // Formatar as datas no resultado
    const examesFisicoFormatados = examesFisico.map((exame) => ({
      ...exame.toJSON(),
      createdAt: formatDate(exame.createdAt),
      updatedAt: formatDate(exame.updatedAt),
    }));

    res.status(200).json(examesFisicoFormatados);
  } catch (err) {
    console.error("Erro ao buscar exames físicos: ", err);
    res.status(500).json({ message: "Erro ao buscar exames físicos." });
  }
};

exports.getExameFisicoId = async (req, res) => {
  try {
    const { id } = req.params;

    const exameId = await exameFisico.findByPk(id, {
      attributes: [
        "id",
        "petId",
        "parceiroId",
        "frequenciaCardiaca",
        "frequenciaRespiratoria",
        "temperatura",
        "tempoPreenchimentoCapilar",
        "mucosas",
        "desidratacao",
        "estadoCorporal",
        "linfonodos",
        "linfonodosObs",
        "observacoesRespiratorias",
        "pressaoArterial",
        "descricaoGeral",
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

    if (!exameId) {
      return res.status(404).json({ message: "Exame físico não encontrado." });
    }

    res.status(200).json(exameId);
  } catch (err) {
    console.error("Erro ao buscar exame físico: ", err);
    res.status(500).json({ message: "Erro ao buscar exame físico." });
  }
};

exports.updateExameFisico = async (req, res) => {
  try {
    const { id } = req.params;

    const examesFisicos = await exameFisico.findByPk(id);
    if (!examesFisicos) {
      return res.status(404).json({ message: "Exame físico não encontrado!" });
    }

    await examesFisicos.update(req.body);
    res.status(200).json({ message: "Exame físico atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar o exame físico: ", err);
    res.status(500).json({ message: "Erro ao atualizar o exame físico." });
  }
};

exports.delExameFisico = async (req, res) => {
  try {
    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o exame físico.",
      });
    }

    const { id } = req.params;
    const deleteRows = await exameFisico.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res.status(200).json({ message: "Deletado com sucesso!" });
    }

    res.status(404).json({ message: "Exame físico não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar o exame físico: ", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
