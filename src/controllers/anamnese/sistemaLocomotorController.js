const { sistemaLocomotor, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createSistemaLocomotor = async (req, res) => {
  try {
    const locomotor = await sistemaLocomotor.create(req.body);
    res.status(201).json(locomotor);
  } catch (err) {
    console.error("Erro ao criar a anamnese do sistema locomotor: ", err);
    res
      .status(500)
      .json({ message: "Erro ao criar a anamnese do sistema locomotor." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getSistemaLocomotor = async (req, res) => {
  try {
    const { petId } = req.params;
    const locomotor = await sistemaLocomotor.findAll({
      where: { petId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "createdAt", "petId", "parceiroId"],
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
    if (!locomotor || locomotor.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    // Formatar as datas no resultado
    const locomotorFormatados = locomotor.map((motor) => ({
      ...motor.toJSON(),
      createdAt: formatDate(motor.createdAt),
      updatedAt: formatDate(motor.updatedAt),
    }));

    res.status(200).json(locomotorFormatados);
  } catch (err) {
    console.error("Erro ao buscar registros do sistema locomotor: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar registros do sistema locomotor." });
  }
};

exports.getSistemaLocomotorP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const locomotor = await sistemaLocomotor.findAll({
      where: { petId, parceiroId: parceiroIdLogado },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "createdAt", "petId", "parceiroId"],
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
    if (!locomotor || locomotor.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    // Formatar as datas no resultado
    const locomotorFormatados = locomotor.map((motor) => ({
      ...motor.toJSON(),
      createdAt: formatDate(motor.createdAt),
      updatedAt: formatDate(motor.updatedAt),
    }));

    res.status(200).json(locomotorFormatados);
  } catch (err) {
    console.error("Erro ao buscar registros do sistema locomotor: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar registros do sistema locomotor." });
  }
};

exports.getSistemaLocomotorId = async (req, res) => {
  try {
    const { id } = req.params;

    const locomotor = await sistemaLocomotor.findByPk(id, {
      attributes: [
        "petId",
        "parceiroId",
        "claudicacao",
        "dorTransporObstaculos",
        "paresia",
        "impoteciaFuncional",
        "inflamacao",
        "edema",
        "deformidade",
        "restricaoMovimento",
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

    if (!locomotor) {
      return res
        .status(404)
        .json({ message: "Exame do sistema locomotor não encontrado." });
    }

    res.status(200).json(locomotor);
  } catch (err) {
    console.error("Erro ao buscar o exame do sistema locomotor: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar o exame do sistema locomotor." });
  }
};

exports.updateSistemaLocomotor = async (req, res) => {
  try {
    const { id } = req.params;

    const locomotor = await sistemaLocomotor.findByPk(id);
    if (!locomotor) {
      return res
        .status(404)
        .json({ message: "Exame do sistema locomotor não encontrado!" });
    }

    await locomotor.update(req.body);
    res
      .status(200)
      .json({ message: "Sistema locomotor atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar o sistema locomotor: ", err);
    res.status(500).json({ message: "Erro ao atualizar o sistema locomotor." });
  }
};

exports.delSistemaLocomotor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o exame do sistema locomotor.",
      });
    }

    const deleteRows = await sistemaLocomotor.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res
        .status(200)
        .json({ message: "Sistema locomotor deletado com sucesso!" });
    }

    res.status(404).json({ message: "Sistema locomotor não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar o sistema locomotor: ", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
