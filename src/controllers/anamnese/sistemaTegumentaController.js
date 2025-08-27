const { sistemaTegumentar, parceiros, pets } = require("../../models");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");

// Função utilitária para validação e manipulação de dados
const formatData = (data) => {
  const fields = [
    "prurido",
    "alopecia",
    "descamacao",
    "meneiosCefalicos",
    "secrecaoOtologica",
    "puliciose",
    "infestacaoCarrapatos",
    "hiperqueratose",
    "pustulas",
    "eritema",
    "edema",
    "nodulosOuMassas",
    "corTexturaPelo",
    "descricaoGeral",
  ];
  return fields.reduce((formatted, field) => {
    formatted[field] = data[field] || null;
    return formatted;
  }, {});
};

// Criação de registro
exports.createSistemaTegumentar = async (req, res) => {
  try {
    const { petId, parceiroId, ...rest } = req.body;
    const formattedData = formatData(rest);

    const tegumentar = await sistemaTegumentar.create({
      petId,
      parceiroId,
      ...formattedData,
    });

    res.status(201).json(tegumentar);
  } catch (err) {
    console.error("Erro ao criar o sistema tegumentar:", err);
    res.status(500).json({ message: "Erro ao criar o sistema tegumentar." });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

// Listar registros
exports.getSistemaTegumentar = async (req, res) => {
  try {
    const { petId } = req.params;
    const tegumentarList = await sistemaTegumentar.findAll({
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
    if (!tegumentarList || tegumentarList.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const tegumentaFormatados = tegumentarList.map((tegumenta) => ({
      ...tegumenta.toJSON(),
      createdAt: formatDate(tegumenta.createdAt),
      updatedAt: formatDate(tegumenta.updatedAt),
    }));

    res.status(200).json(tegumentaFormatados);
  } catch (err) {
    console.error("Erro ao listar sistema tegumentar:", err);
    res.status(500).json({ message: "Erro ao listar sistema tegumentar." });
  }
};
// Listar registros
exports.getSistemaTegumentarP = async (req, res) => {
  try {
    const { petId } = req.params;
    const parceiroIdLogado = req.loggedUser.id;
    const tegumentarList = await sistemaTegumentar.findAll({
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
    if (!tegumentarList || tegumentarList.length === 0) {
      return res.status(404).json({
        message: "Nenhuma informação encontrada para o pet fornecido.",
      });
    }

    const tegumentaFormatados = tegumentarList.map((tegumenta) => ({
      ...tegumenta.toJSON(),
      createdAt: formatDate(tegumenta.createdAt),
      updatedAt: formatDate(tegumenta.updatedAt),
    }));

    res.status(200).json(tegumentaFormatados);
  } catch (err) {
    console.error("Erro ao listar sistema tegumentar:", err);
    res.status(500).json({ message: "Erro ao listar sistema tegumentar." });
  }
};

// Buscar por ID
exports.getSistemaTegumentarId = async (req, res) => {
  try {
    const { id } = req.params;

    const tegumentar = await sistemaTegumentar.findByPk(id, {
      attributes: [
        "prurido",
        "alopecia",
        "descamacao",
        "meneiosCefalicos",
        "secrecaoOtologica",
        "puliciose",
        "corTexturaPelo",
        "edema",
        "nodulosOuMassas",
        "descricaoGeral",
        "infestacaoCarrapatos",
        "hiperqueratose",
        "eritema",
        "pustulas",
      ],
      include: [
        { model: pets, as: "pet", attributes: ["nomePet"] },
        { model: parceiros, as: "parceiro", attributes: ["razaoSocial"] },
      ],
    });

    if (!tegumentar) {
      return res
        .status(404)
        .json({ message: "Exame do sistema tegumentar não encontrado." });
    }

    res.status(200).json(tegumentar);
  } catch (err) {
    console.error("Erro ao buscar sistema tegumentar por ID:", err);
    res.status(500).json({ message: "Erro ao buscar sistema tegumentar." });
  }
};

// Atualizar registro
exports.updateSistemaTegumentar = async (req, res) => {
  try {
    const { id } = req.params;
    const { petId, parceiroId, ...rest } = req.body;

    const tegumentar = await sistemaTegumentar.findByPk(id);
    if (!tegumentar) {
      return res
        .status(404)
        .json({ message: "Exame do sistema tegumentar não encontrado!" });
    }

    const formattedData = formatData(rest);
    await tegumentar.update({ petId, parceiroId, ...formattedData });

    res.status(200).json({ message: "Atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar sistema tegumentar:", err);
    res.status(500).json({ message: "Erro ao atualizar sistema tegumentar." });
  }
};

// Deletar registro
exports.delSistemaTegumentar = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRows = await sistemaTegumentar.destroy({ where: { id } });

    if (deleteRows > 0) {
      return res.status(200).json({ message: "Deletado com sucesso!" });
    }

    res.status(404).json({ message: "Exame não encontrado." });
  } catch (err) {
    console.error("Erro ao deletar sistema tegumentar:", err);
    res.status(500).json({ message: "Erro ao tentar conexão com o banco!" });
  }
};
