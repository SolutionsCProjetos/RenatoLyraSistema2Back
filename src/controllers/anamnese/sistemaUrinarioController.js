const { sistemaUrinario, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createSistemaUrinario = async (req, res) => {
  try {
    const urinario = await sistemaUrinario.create(req.body);
    res.status(201).json(urinario);
  } catch (err) {
    console.error("Erro ao criar a amnese do exame do sistema Urinario: ", err);
    res.status(500).json({
      message: "Erro ao criar a amnese do exame do sistema Urinario.",
    });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

exports.getSistemaUrinario = async (req, res) => {
  try {
    const { petId } = req.params;
    const Urinario = await sistemaUrinario.findAll({
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
    if (!Urinario || Urinario.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const UrinarioFormatados = Urinario.map((urinario) => ({
      ...urinario.toJSON(),
      createdAt: formatDate(urinario.createdAt),
      updatedAt: formatDate(urinario.updatedAt),
    }));

    res.status(200).json(UrinarioFormatados);
  } catch (err) {
    console.error("Erro ao buscar registros do sistema Urinario: ", err);
    res.status(500).json({
      message: "Erro ao buscar registros do sistema Urinario.",
    });
  }
};

exports.getSistemaUrinarioP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const Urinario = await sistemaUrinario.findAll({
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
    if (!Urinario || Urinario.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const UrinarioFormatados = Urinario.map((urinario) => ({
      ...urinario.toJSON(),
      createdAt: formatDate(urinario.createdAt),
      updatedAt: formatDate(urinario.updatedAt),
    }));

    res.status(200).json(UrinarioFormatados);
  } catch (err) {
    console.error("Erro ao buscar registros do sistema Urinario: ", err);
    res.status(500).json({
      message: "Erro ao buscar registros do sistema Urinario.",
    });
  }
};

exports.getSistemaUrinarioId = async (req, res) => {
  try {
    const { id } = req.params;

    const UrinarioId = await sistemaUrinario.findByPk(id, {
      attributes: [
        "petId",
        "parceiroId",
        "disfuncaoHidrica",
        "coloracao",
        "volume",
        "frequencia",
        "odor",
        "hematuria",
        "disuria",
        "cristaluria",
        "bacteriuria",
        "piuria",
        "estranguria",
        "secrecao",
        "castrado",
        "partosNormais",
        "anticoncepcional",
        "cioRegular",
        "outrasAlteracoes",
        "observacoesGerais",
        "ultimoCio",
        "crias",
      ],
      include: [
        {
          model: pets,
          as: "pet", // Use correct alias here
          attributes: ["nomePet"],
        },
        {
          model: parceiros,
          as: "parceiro", // Use correct alias here
          attributes: ["razaoSocial"],
        },
      ],
    });

    if (!UrinarioId) {
      return res
        .status(404)
        .json({ message: "Exame do sistema Urinario não encontrado." });
    }

    res.status(200).json(UrinarioId);
  } catch (err) {
    console.error("Erro ao buscar o exame do sistema Urinario: ", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar o exame do sistema Urinario." });
  }
};

exports.updateSistemaUrinario = async (req, res) => {
  try {
    const { id } = req.params;

    const Urinario = await sistemaUrinario.findByPk(id);
    if (!Urinario) {
      return res
        .status(404)
        .json({ message: `Exame do sistema Urinario não encontrado!` });
    }

    await Urinario.update(req.body);
    res.status(200).json("Sucesso ao atualizar o exame do sistema Urinario!");
  } catch (err) {
    console.log("Erro ao atualizar o exame do sistema Urinario: ", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar o exame do sistema Urinario." });
  }
};

exports.delSistemaUrinario = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.loggedUser.rule !== 1) {
      return res
        .status(403)
        .json(
          "Permissão negada. Apenas administradores podem deletar o exame do sistema Urinario."
        );
    }

    const deleteRows = await sistemaUrinario.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      return res.status(200).json("Deletado com sucesso!");
    }

    res.status(404).json("O exame do sistema Urinario não encontrado");
  } catch (err) {
    console.error("Erro ao deletar o exame do sistema Urinario: ", err);
    res.status(500).json("Erro ao tentar conexão com o banco!");
  }
};
