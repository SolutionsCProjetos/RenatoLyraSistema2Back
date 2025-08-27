const { operacoes, usuarios, cliente } = require("../models");
const { isBefore, parseISO } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const { Op } = require("sequelize");

exports.createOperation = async (req, res) => {
  let {
    atividade,
    userId,
    //clienteId,
    endTime,
    obs,
    valorOperacao,
    status,
    motivo,
    startDate,
    endDate,
    closingDate,
  } = req.body;

  try {
    const currentDate = new Date();
    // Formatação de startTime usando a data atual
    const now = new Date();
    const [startHour, startMinute] = now.toTimeString().split(":");
    const startTimeDate = new Date(currentDate);
    startTimeDate.setHours(startHour, startMinute, 0, 0);

    // Se endTime for fornecido, formate-o usando a data atual
    let endTimeDate = null;
    if (endTime) {
      const [endHour, endMinute] = endTime.split(":");
      endTimeDate = new Date(currentDate);
      endTimeDate.setHours(endHour, endMinute, 0, 0);
    }

    // Define campos opcionais como null se forem strings vazias
    obs = obs || null;
    startDate = startDate || null;
    closingDate = closingDate || null;
    motivo = motivo || null;
    //clienteId = clienteId || null;

    const operacao = await operacoes.create({
      atividade,
      userId,
      //clienteId,
      startTime: startTimeDate,
      endTime: endTimeDate,
      startDate: startDate,
      endDate: endDate,
      closingDate: closingDate,
      status,
      motivo: motivo,
      valorOperacao,
      obs,
    });

    res.status(201).json(operacao);
  } catch (error) {
    console.error("Erro ao iniciar a operação:", error);
    res.status(500).json({ message: "Erro ao iniciar a operação." });
  }
};

exports.getAllOperations = async (req, res) => {
  try {
    const operacoe = await operacoes.findAll({
      attributes: [
        "id",
        "atividade",
        "startTime",
        "endTime",
        "startDate",
        "status",
        "motivo",
        "createdAt",
      ],
      include: [
        { model: usuarios, as: "usuario", attributes: ["nome", "id"] },
       /*  {
          model: cliente,
          as: "cliente",
          attributes: ["razaoSocial", "id"],
        }, */
      ],
    });

    const formattedOperations = operacoe.map((operacao) => {
      const startDate = new Date(operacao.startDate);
      startDate.setHours(startDate.getHours() + 3); // Ajuste para o fuso horário

      const endDate = operacao.endDate ? new Date(operacao.endDate) : null;
      if (endDate) {
        endDate.setHours(endDate.getHours() + 3); // Ajuste para o fuso horário
      }

      return {
        ...operacao.toJSON(),
        startTime: operacao.startTime?.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: operacao.endTime?.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: operacao.createdAt?.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        startDate: startDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        endDate: endDate
          ? endDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : null,
      };
    });

    res.status(200).json(formattedOperations);
  } catch (error) {
    console.error("Erro ao obter as operações:", error);
    res.status(500).json({ message: "Erro ao obter as operações." });
  }
};

exports.getOperationById = async (req, res) => {
  const { id } = req.params;
  try {
    const operacao = await operacoes.findByPk(id, {
      attributes: [
        "id",
        "atividade",
        "startTime",
        "endTime",
        "endDate",
        "startDate",
        "closingDate",
        "obs",
        "status",
        "motivo",
        "valorOperacao",
      ],
      include: [
        {
          model: usuarios,
          as: "usuario",
          attributes: ["nome", "id"],
        },
       /*  {
          model: cliente,
          as: "cliente",
          attributes: ["razaoSocial", "id"],
        }, */
      ],
    });

    if (!operacao) {
      return res.status(404).json({ message: "Operação não encontrada." });
    }

    const startDate = new Date(operacao.startDate);
    startDate.setHours(startDate.getHours() + 3); // Ajuste para o fuso horário

    const endDate = operacao.endDate ? new Date(operacao.endDate) : null;
    if (endDate) {
      endDate.setHours(endDate.getHours() + 3); // Ajuste para o fuso horário
    }

    const closingDate = operacao.closingDate
      ? new Date(operacao.closingDate)
      : null;
    if (closingDate) {
      closingDate.setHours(closingDate.getHours() + 3); // Ajuste para o fuso horário
    }

    const formattedOperation = {
      ...operacao.toJSON(),
      startTime: operacao.startTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: operacao.endTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      startDate: startDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      endDate: endDate
        ? endDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : null,
      closingDate: closingDate
        ? closingDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : null,
    };

    res.status(200).json(formattedOperation);
  } catch (error) {
    console.error("Erro ao obter a operação:", error);
    res.status(500).json({ message: "Erro ao obter a operação." });
  }
};

exports.updateOperation = async (req, res) => {
  const { id } = req.params;
  let {
    atividade,
    startTime,
    endTime,
    userId,
    //clienteId,
    obs,
    valorOperacao,
    status,
    motivo,
    startDate,
    endDate,
    closingDate,
  } = req.body;

  // Verifica se o userId está presente
  if (!userId) {
    return res.status(400).json({ message: "O campo userId é obrigatório." });
  }

  try {
    const operacao = await operacoes.findByPk(id);
    if (!operacao) {
      return res.status(404).json({ message: "Operação não encontrada." });
    }

    // Validação e conversão de startTime
    if (startTime) {
      const currentDate = new Date().toISOString().split("T")[0];
      const parsedStartTime = new Date(`${currentDate}T${startTime}:00`);
      if (isNaN(parsedStartTime.getTime())) {
        return res.status(400).json({ message: "Tempo de início inválido." });
      }
      operacao.startTime = parsedStartTime;
    }

    // Validação e conversão de endTime
    if (endTime) {
      const currentDate = new Date().toISOString().split("T")[0];
      const parsedEndTime = new Date(`${currentDate}T${endTime}:00`);
      if (isNaN(parsedEndTime.getTime())) {
        return res.status(400).json({ message: "Tempo de término inválido." });
      }
      operacao.endTime = parsedEndTime;
    }

    // Validação e conversão de startDate
    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res
          .status(400)
          .json({ message: "Data de início (startDate) inválida." });
      }
      operacao.startDate = parsedStartDate;
    }

    // Validação e conversão de endDate
    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return res
          .status(400)
          .json({ message: "Data de para fim da Ocorrencia inválida." });
      }
      operacao.endDate = parsedEndDate;
    }

    if (closingDate) {
      const parsedclosingDate = new Date(closingDate);
      if (isNaN(parsedclosingDate.getTime())) {
        return res.status(400).json({ message: "Data de término inválida." });
      }
      operacao.closingDate = parsedclosingDate;
    }

    // Atualização dos outros campos
    operacao.atividade = atividade;
    operacao.obs = obs || null;
    operacao.valorOperacao = valorOperacao;
    operacao.motivo = motivo || null;

    // Se a operação não foi finalizada (sem endTime) e a data atual é maior que startDate, status = 'Atrasado'
    const currentDate = new Date();
    if (
      !operacao.closingDate &&
      isBefore(parseISO(operacao.endDate.toISOString()), currentDate)
    ) {
      operacao.status = "Atrasado";
    } else {
      operacao.status = status;
    }

    operacao.userId = userId;
    //operacao.clienteId = clienteId;

    await operacao.save();

    res
      .status(200)
      .json({ message: "Operação atualizada com sucesso.", operacao });
  } catch (error) {
    console.error("Erro ao atualizar a operação:", error);
    res.status(500).json({ message: "Erro ao atualizar a operação." });
  }
};

exports.deleteOperation = async (req, res) => {
  try {
    if (req.loggedUser.rule < 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar uma operação.",
      });
    }
    const { id } = req.params;
    const operacao = await operacoes.findByPk(id);
    if (!operacao) {
      return res.status(404).json({ message: "Operação não encontrada." });
    }

    await operacao.destroy();

    res.status(200).json({ message: "Operação deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar a operação:", error); // Logging do erro
    res.status(500).json({ message: "Erro ao deletar a operação." });
  }
};

exports.getOperationByUser = async (req, res) => {
  try {
    const operacoe = await operacoes.findAll({
      attributes: [
        "id",
        "atividade",
        "startTime",
        "endDate",
        "endTime",
        "obs",
        "valorOperacao",
        "status",
        "motivo",
        "startDate",
      ],
      include: [
        {
          model: usuarios,
          as: "usuario",
          attributes: ["nome", "id"],
        },
        //{ model: cliente, as: "cliente", attributes: ["razaoSocial", "id"] },
      ],
      where: {
        status: ["Aberto", "Andamento", "Atrasado"], // Filtra os status desejados
      },
    });

    const formattedOperations = operacoe.map((operacao) => ({
      ...operacao.toJSON(),
      startTime: operacao.startTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: operacao.endTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    if (!formattedOperations || formattedOperations.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma operação encontrada para este usuário." });
    }

    res.status(200).json(formattedOperations);
  } catch (error) {
    console.error("Erro ao obter as operações:", error); // Logging do erro
    res.status(500).json({ message: "Erro ao obter as operações." });
  }
};

exports.getOperationByUserId = async (req, res) => {
  try {
    let { id } = req.params;

    // Verifica se o ID é um número válido
    if (isNaN(id)) {
      return res.status(400).json("Id inválido!");
    }

    // Busca as operações do usuário pelo ID
    const operacoe = await operacoes.findAll({
      where: { userId: id }, // Filtra pelo ID do usuário
      attributes: [
        "id",
        "atividade",
        "startTime",
        "endTime",
        "obs",
        "valorOperacao",
        "status",
        "motivo",
        "startDate",
      ],
      include: [
        {
          model: usuarios,
          as: "usuario",
          attributes: ["nome", "id"],
        },
        /* {
          model: cliente,
          as: "cliente",
          attributes: ["razaoSocial", "id"],
        }, */
      ],
    });

    // Formata os horários
    const formattedOperations = operacoe.map((operacao) => ({
      ...operacao.toJSON(),
      startTime: operacao.startTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: operacao.endTime?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    // Verifica se encontrou operações
    if (!formattedOperations || formattedOperations.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma operação encontrada para este usuário." });
    }

    // Retorna as operações formatadas
    res.status(200).json(formattedOperations);
  } catch (error) {
    console.error("Erro ao obter as operações:", error); // Logging do erro
    res.status(500).json({ message: "Erro ao obter as operações." });
  }
};
