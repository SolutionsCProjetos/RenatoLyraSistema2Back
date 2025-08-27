const {
  sequelize,
  pets,
  cliente,
  historicoPesos,
  petVacinas,
  historicoConsulta,
  parceiros,
} = require("../models/");
const { validationResult } = require("express-validator");
const { isValid, format, parseISO } = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createPet = async (req, res) => {
  const transaction = await sequelize.transaction(); // Inicia uma transação
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Desestruturação dos dados do corpo da requisição
    let {
      nomePet,
      clienteId,
      raca,
      dataNascimento,
      especie,
      pelagem,
      corPelo,
      sexo,
      numeroChip,
      porte,
      situacao,
      pesoAtual,
      obs,
      vacinaId, // ID da vacina relacionada
      vacinasAplicadas, // Array de vacinas aplicadas
      dataUltimaVacinacao, // Última data de vacinação
      historicoMedico, // Histórico médico em JSON
      alergias, // Lista de alergias
    } = req.body;

    // Validação da data de nascimento
    if (dataNascimento && !isValid(parseISO(dataNascimento))) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    // Tratamento dos campos numéricos
    pesoAtual = isNaN(parseFloat(pesoAtual)) ? 0 : parseFloat(pesoAtual);
    numeroChip = isNaN(parseInt(numeroChip)) ? null : parseInt(numeroChip);

    // Criação do pet no banco de dados
    const pet = await pets.create(
      {
        nomePet,
        clienteId,
        raca,
        dataNascimento: dataNascimento || null,
        especie,
        pelagem,
        corPelo,
        sexo,
        numeroChip,
        porte,
        situacao,
        pesoAtual,
        obs,
      },
      { transaction }
    );

    // Cria a primeira entrada no histórico de consultas com a data atual
    const dataAtual = new Date(); // Obtém a data atual
    await historicoConsulta.create(
      {
        petId: pet.id, // Relaciona ao pet recém-criado
        consulta: dataAtual, // Usa a data atual
      },
      { transaction }
    );

    // Verifica se os dados de `petVacinas` foram fornecidos
    if (
      vacinaId ||
      vacinasAplicadas ||
      dataUltimaVacinacao ||
      historicoMedico ||
      alergias
    ) {
      await petVacinas.create(
        {
          petId: pet.id, // Usa o ID do pet recém-criado
          vacinaId,
          vacinasAplicadas: vacinasAplicadas || [],
          dataUltimaVacinacao: dataUltimaVacinacao || null,
          historicoMedico: historicoMedico || [],
          alergias: alergias || null,
        },
        { transaction }
      );
    }

    // Confirma a transação
    await transaction.commit();

    // Retorna sucesso ao frontend
    res.status(201).json({ message: "Pet criado com sucesso.", pet });
  } catch (erro) {
    await transaction.rollback(); // Reverte a transação em caso de erro

    if (erro.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({
          message: "Este número de chip já foi cadastrado.",
          details: erro.message,
        });
    }

    console.error("Erro ao tentar cadastrar o pet:", erro);
    res
      .status(500)
      .json({ message: "Erro interno do servidor.", details: erro.message });
  }
};

const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

const fetchPets = async (filter = {}) => {
  return await pets.findAll({
    where: filter,
    order: [["nomePet", "ASC"]],
    attributes: ["id", "nomePet", "raca", "sexo", "dataNascimento"],
    include: [
      {
        model: cliente,
        as: "cliente",
        attributes: ["razaoSocial", "id"], // Adiciona o nome do cliente
      },
    ],
  });
};
exports.getPet = async (req, res) => {
  try {
    const { clienteId } = req.params;
    if (!isNaN(parseInt(clienteId))) {
      return res.status(400).json({ error: "ID do cliente inválido." });
    }
    const listaP = await fetchPets();

    const listaPetsC = listaP.map((lista) => ({
      id: lista.id,
      nomePet: lista.nomePet,
      raca: lista.raca,
      sexo: lista.sexo,
      dataNascimento: formatDate(lista.dataNascimento),
      cliente: lista.cliente ? lista.cliente.razaoSocial : null,
    }));

    res.status(200).json(listaPetsC);
  } catch (err) {
    console.error("Erro ao tentar buscar o pet:", err);
    res
      .status(500)
      .json({ message: "Erro interno do servidor.", details: err.message });
  }
};

exports.getPetCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const listaPets = await pets.findAll({
      where: { clienteId },
      include: [
        {
          model: cliente,
          as: "cliente",
          attributes: ["razaoSocial", "id"],
        },
      ],
    });

    if (!listaPets.length) {
      return res
        .status(404)
        .json({ message: "Nenhum pet encontrado para este cliente." });
    }

    const PetsFormatados = listaPets.map((pet) => ({
      nomePet: pet.nomePet,
      id: pet.id,
      dono: pet.cliente.razaoSocial,
      sexo: pet.sexo,
      dataNascimento: format(new Date(pet.dataNascimento), "dd/MM/yyyy", {
        locale: ptBR,
      }),
    }));

    res.status(200).json(PetsFormatados);
  } catch (err) {
    console.error("Erro ao tentar buscar os pets do cliente:", err);
    res
      .status(500)
      .json({ message: "Erro interno do servidor.", details: err.message });
  }
};

exports.getPetId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validação do ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const listaPet = await pets.findByPk(id, {
      attributes: [
        "id",
        "nomePet",
        "clienteId",
        "raca",
        "dataNascimento",
        "especie",
        "pelagem",
        "corPelo",
        "sexo",
        "numeroChip",
        "porte",
        "situacao",
        "pesoAtual",
        "obs",
      ],
      include: [
        {
          model: cliente,
          as: "cliente",
          attributes: ["razaoSocial"],
        },
        {
          model: historicoPesos,
          as: "historicoPesos",
          attributes: ["id", "peso", "dataRegistro"],
          order: [["dataRegistro", "DESC"]], // Ordenação dentro do include
        },
        {
          model: petVacinas,
          as: "vacinasRelacionadas",
          attributes: [
            "historicoMedico",
            "vacinasAplicadas",
            "dataUltimaVacinacao",
            "alergias",
          ],
        },
      ],
    });

    if (!listaPet) {
      return res.status(404).json({ message: "Pet não encontrado." });
    }

    res.status(200).json({
      success: true,
      message: "Pet encontrado com sucesso.",
      data: listaPet,
    });
  } catch (err) {
    console.error("Erro ao tentar buscar o pet:", err);
    res
      .status(500)
      .json({ message: "Erro interno do servidor.", details: err.message });
  }
};

exports.updatePet = async (req, res) => {
  const transaction = await sequelize.transaction(); // Inicia a transação
  try {
    const { id } = req.params;
    const {
      nomePet,
      clienteId,
      raca,
      dataNascimento,
      especie,
      pelagem,
      corPelo,
      sexo,
      numeroChip,
      porte,
      situacao,
      pesoAtual,
      obs,
      vacinaId,
      vacinasAplicadas,
      dataUltimaVacinacao,
      historicoMedico,
      alergias,
    } = req.body;

    // Verifica se o pet existe
    const petExist = await pets.findByPk(id, { transaction });
    if (!petExist) {
      await transaction.rollback();
      return res.status(404).json({ error: "Pet não encontrado." });
    }

    // Validação do peso
    const novoPeso = pesoAtual ? parseFloat(pesoAtual) : null;
    if (pesoAtual && isNaN(novoPeso)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Peso inválido. Informe um número válido." });
    }

    // Validação da data de nascimento
    let novaDataNascimento = petExist.dataNascimento;
    if (dataNascimento) {
      const dataFormatada = parseISO(dataNascimento);
      if (!isValid(dataFormatada) || dataFormatada > new Date()) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Data de nascimento inválida ou no futuro." });
      }
      novaDataNascimento = dataFormatada;
    }

    // Verificar existência do cliente, se alterado
    if (clienteId && !(await cliente.findByPk(clienteId, { transaction }))) {
      await transaction.rollback();
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // Atualiza os campos dinamicamente
    const updatedFields = {};
    
    const pesoOriginal = petExist.pesoAtual;
    // Adicionar ao histórico de pesos apenas se o peso foi alterado
    if (pesoAtual !== undefined && novoPeso !== pesoOriginal) {
      await historicoPesos.create(
        {
          petId: id,
          peso: novoPeso,
          dataRegistro: new Date(),
        },
        { transaction }
      );
    }
    if (nomePet !== undefined) updatedFields.nomePet = nomePet;
    if (clienteId !== undefined) updatedFields.clienteId = clienteId;
    if (raca !== undefined) updatedFields.raca = raca;
    if (dataNascimento) updatedFields.dataNascimento = novaDataNascimento;
    if (especie !== undefined) updatedFields.especie = especie;
    if (pelagem !== undefined) updatedFields.pelagem = pelagem;
    if (corPelo !== undefined) updatedFields.corPelo = corPelo;
    if (sexo !== undefined) updatedFields.sexo = sexo;
    if (numeroChip !== undefined) updatedFields.numeroChip = numeroChip;
    if (porte !== undefined) updatedFields.porte = porte;
    if (situacao !== undefined) updatedFields.situacao = situacao;
    if (pesoAtual !== undefined) updatedFields.pesoAtual = novoPeso;
    if (obs !== undefined) updatedFields.obs = obs;

    // Atualizar o pet
    await petExist.update(updatedFields, { transaction });

    // Obter o último registro no histórico de consultas
    const ultimoHistorico = await historicoConsulta.findOne({
      where: { petId: id },
      order: [["consulta", "DESC"]], // Ordenar pela data de consulta, mais recente primeiro
      transaction,
    });

    // Verificar se campos relevantes foram alterados
    const camposRelevantesAlterados =
      (pesoAtual !== undefined && novoPeso !== petExist.pesoAtual) || // Peso alterado
      (obs !== undefined && obs !== petExist.obs) || // Observação alterada
      (dataUltimaVacinacao !== undefined &&
        dataUltimaVacinacao !== petExist.dataUltimaVacinacao) || // Última vacinação alterada
      (vacinasAplicadas !== undefined &&
        JSON.stringify(vacinasAplicadas) !==
          JSON.stringify(petExist.vacinasAplicadas)); // Vacinas aplicadas alteradas

    // Criar histórico de consultas somente se campos relevantes forem alterados
    // e a data for diferente da última registrada
    if (
      camposRelevantesAlterados &&
      (!ultimoHistorico ||
        new Date().toISOString() !== ultimoHistorico.consulta.toISOString())
    ) {
      await historicoConsulta.create(
        {
          petId: id,
          consulta: new Date(),
        },
        { transaction }
      );
    }

    // Atualizar ou criar registro em petVacinas
    const vacinaRecord = await petVacinas.findOne({
      where: { petId: id, vacinaId },
      transaction,
    });

    if (vacinaRecord) {
      // Atualiza o registro existente
      await vacinaRecord.update(
        {
          vacinasAplicadas: vacinasAplicadas || vacinaRecord.vacinasAplicadas,
          dataUltimaVacinacao:
            dataUltimaVacinacao || vacinaRecord.dataUltimaVacinacao,
          historicoMedico: historicoMedico || vacinaRecord.historicoMedico,
          alergias: alergias || vacinaRecord.alergias,
        },
        { transaction }
      );
    } else if (vacinaId) {
      // Cria um novo registro se não existir
      await petVacinas.create(
        {
          petId: id,
          vacinaId: vacinaId,
          vacinasAplicadas: vacinasAplicadas || [],
          dataUltimaVacinacao: dataUltimaVacinacao || null,
          historicoMedico: historicoMedico || [],
          alergias: alergias || null,
        },
        { transaction }
      );
    }

    // Confirma a transação
    await transaction.commit();
    res
      .status(200)
      .json({ message: "Pet atualizado com sucesso.", pet: petExist });
  } catch (erro) {
    await transaction.rollback();
    console.error("Erro ao tentar atualizar o pet:", erro);
    res.status(500).json({
      error: "Erro interno do servidor.",
      details: erro.message,
    });
  }
};

exports.deletePet = async (req, res) => {
  try {
    if (!req.loggedUser || req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o cliente.",
      });
    }
    const { id } = req.params;

    const pet = await pets.findByPk(id);
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado." });
    }
    await pet.destroy();
    res.status(200).json({ message: "Pet deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao tentar deletar o pet:", err);
    res
      .status(500)
      .json({ message: "Erro interno do servidor.", details: err.message });
  }
};
