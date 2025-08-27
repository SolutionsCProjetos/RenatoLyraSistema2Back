const { demandas, solicitantes } = require("../models");
const { ptBR } = require("date-fns");
const { Op } = require("sequelize");

exports.createDemanda = async (req, res) => {
  let {
    protocolo,
    solicitant,
    setor,
    prioridade,
    status,
    dataSolicitacao,
    dataTermino,
    solicitanteId,
    observacoes,
    reincidencia,
    meioSolicitacao,
    anexarDocumentos,
    envioCobranca1,
    envioCobranca2,
    envioParaResponsavel,
  } = req.body;

  try {
    // Gerar o protocolo automaticamente
    const anoAtual = new Date().getFullYear();
    const demandasDoAno = await demandas.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(`${anoAtual}-01-01`),
          [Op.lt]: new Date(`${anoAtual + 1}-01-01`),
        },
      },
    });

    const sequencial = (demandasDoAno + 1).toString().padStart(4, "0");
    const protocolo = `P${anoAtual}${sequencial}`;


    observacoes = observacoes || null;
    dataTermino = dataTermino || null;

    const demanda = await demandas.create({
      protocolo,
      solicitant,
      setor,
      prioridade,
      status,
      dataSolicitacao,
      dataTermino,
      solicitanteId,
      observacoes,
      reincidencia,
      meioSolicitacao,
      anexarDocumentos,
      envioCobranca1,
      envioCobranca2,
      envioParaResponsavel,
    });

    res.status(201).json(demanda);
  } catch (err) {
    console.error("Erro ao criar a Demanda: ", err);
    res.status(500).json({ message: "Erro ao criar a Demanda." });
  }
};

exports.getDemandas = async (req, res) => {
  try {
    const demanda = await demandas.findAll({
      order: [["dataSolicitacao", "DESC"]],
      attributes: [
        "id",
        "endereco",
        "protocolo",
        "status",
        "prioridade",
        "dataSolicitacao",
        "dataTermino",
        "bairro",
      ],
      include: [
        {
          model: solicitantes,
          as: "solicitante",
          attributes: ["cpf", "telefoneContato", "nomeCompleto"],
        },
      ],
    });

    // Formatar as datas no formato pt-BR e ajustar o fuso horário para cada demanda individualmente
    const demandasFormatadas = demanda.map((demandad) => {
      const dataSolicitacao = new Date(demandad.dataSolicitacao);
      dataSolicitacao.setHours(dataSolicitacao.getHours() + 3);

      const dataTermino = demandad.dataTermino
        ? new Date(demandad.dataTermino)
        : null;
      if (dataTermino) {
        dataTermino.setHours(dataTermino.getHours() + 3);
      }

      return {
        ...demandad.toJSON(),
        dataSolicitacao: dataSolicitacao.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        dataTermino: dataTermino
          ? dataTermino.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : null,
      };
    });
    

    res.status(200).json(demandasFormatadas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao listar as demandas." });
  }
};

exports.getDemandaId = async (req, res) => {
  try {
    const { id } = req.params;

    const demandaId = await demandas.findByPk(id, {
      attributes: [
        "protocolo",
        "setor",
        "prioridade",
        "solicitant",
        "status",
        "dataSolicitacao",
        "dataTermino",
        "cep",
        "endereco",
        "bairro",
        "num",
        "zona",
        "pontoReferencia",
        "solicitanteId",
        "observacoes",
        "reincidencia",
        "meioSolicitacao",
        "anexarDocumentos",
        "envioCobranca1",
        "envioCobranca2",
        "envioParaResponsavel",
      ],
      include: [
        {
          model: solicitantes,
          as: "solicitante",
          attributes: [
            "solicitante",
            "nomeCompleto",
            "cpf",
            "titulo",
            "telefoneContato",
            "email",
            "cep",
            "endereco",
            "bairro",
            "num",
            "zona",
            "pontoReferencia",
            "secaoEleitoral",
          ],
        },
      ],
    });

    res.status(200).json(demandaId);
  } catch (err) {
    console.log("Erro ao puxar a demanda: ", err);
    res.status(500).json({ message: "Erro ao buscar a demanda." });
  }
};

exports.uploadDemanda = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      protocolo,
      setor,
      prioridade,
      solicitant,
      status,
      dataSolicitacao,
      dataTermino,
      cep,
      endereco,
      bairro,
      num,
      zona,
      pontoReferencia,
      solicitanteId,
      observacoes,
      reincidencia,
      meioSolicitacao,
      anexarDocumentos,
      envioCobranca1,
      envioCobranca2,
      envioParaResponsavel,
    } = req.body;

    // Verifica se o demanda existe
    const demandaExistente = await demandas.findByPk(id);

    if (!demandaExistente) {
      return res.status(404).json({ message: "Demanda não encontrada." });
    }

    // Atualiza os campos apenas se fornecidos
    demandaExistente.protocolo= protocolo || demandaExistente.protocolo,
    demandaExistente.setor= setor || demandaExistente.setor,
    demandaExistente.prioridade= prioridade || demandaExistente.prioridade,
    demandaExistente.solicitant= solicitant || demandaExistente.solicitant,
    demandaExistente.status= status || demandaExistente.status,
    demandaExistente.dataSolicitacao= dataSolicitacao || demandaExistente.dataSolicitacao,
    demandaExistente.dataTermino= dataTermino || demandaExistente.dataTermino,
    demandaExistente.cep= cep || demandaExistente.cep,
    demandaExistente.endereco= endereco || demandaExistente.endereco,
    demandaExistente.bairro= bairro || demandaExistente.bairro,
    demandaExistente.num= num || demandaExistente.num,
    demandaExistente.zona= zona || demandaExistente.zona,
    demandaExistente.pontoReferencia= pontoReferencia || demandaExistente.pontoReferencia,
    demandaExistente.solicitanteId= solicitanteId || demandaExistente.solicitanteId,
    demandaExistente.observacoes= observacoes || demandaExistente.observacoes,
    demandaExistente.reincidencia= reincidencia || demandaExistente.reincidencia,
    demandaExistente.meioSolicitacao= meioSolicitacao || demandaExistente.meioSolicitacao,
    demandaExistente.anexarDocumentos= anexarDocumentos || demandaExistente.anexarDocumentos,
    demandaExistente.envioCobranca1= envioCobranca1 || demandaExistente.envioCobranca1,
    demandaExistente.envioCobranca2= envioCobranca2 || demandaExistente.envioCobranca2,
    demandaExistente.envioParaResponsavel= envioParaResponsavel || demandaExistente.envioParaResponsavel,
      // Salva as alterações no banco de dados
      await demandaExistente.save();
    res.status(200).json({ message: "Demanda atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar a demanda:", err);
    res.status(500).json({ message: "Erro ao atualizar a demanda." });
  }
};

exports.deleteDemanda = async (req, res) => {
  try {
    if (req.loggedUser.rule < 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar uma Demanda.",
      });
    }
    const { id } = req.params;
    const demanda = await demandas.findByPk(id);
    if (!demanda) {
      return res.status(404).json({ message: "Demanda não encontrada." });
    }

    await demanda.destroy();

    res.status(200).json({ message: "Demanda deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar a demanda:", error); // Logging do erro
    res.status(500).json({ message: "Erro ao deletar a demanda." });
  }
};