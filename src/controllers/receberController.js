const { contasreceber, cliente } = require("../models/");
const { Sequelize } = require("sequelize");
const { validationResult } = require("express-validator");
const { format, isValid, isBefore, parseISO, addMonths} = require("date-fns");
const { ptBR } = require("date-fns/locale");

exports.createReceber = async (req, res) => {
  const t = await contasreceber.sequelize.transaction(); // Transação
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let {
      status,
      vencimento,
      clienteId, // Ajustado para usar o campo correto
      valorReceber,
      parcelas,
      formaPagamento,
      dataReceber,
      valorPago,
      juros,
      multa,
      descontos,
      custos,
      obs,
      recibo,
      empresa,
      categoria,
      cpfCnpj,
    } = req.body;

    // Validações iniciais
    if (!isValid(parseISO(vencimento))) {
      return res.status(400).json({ error: "Data de vencimento inválida." });
    }

    // Converte e valida os dados numéricos
    valorReceber = parseFloat(valorReceber) || 0;
    valorPago = parseFloat(valorPago) || 0;
    juros = parseFloat(juros) || 0;
    multa = parseFloat(multa) || 0;
    descontos = parseFloat(descontos) || 0;
    custos = parseFloat(custos) || 0;

    // Remove caracteres especiais do cpfCnpj
    const cpfCnpjSemPonto = cpfCnpj ? cpfCnpj.replace(/[.\-/]/g, "") : null;

    // Calcula o valor total considerando o desconto
    const valorTotalComDesc = valorReceber - descontos;
    let valorEmAberto = valorTotalComDesc - valorPago;

    // Define o status com base nos valores calculados
    if (valorEmAberto <= 0) {
      status = "Fechado";
      valorEmAberto = 0;
    } else if (valorPago > 0) {
      status = "Parcial";
    } else {
      status = "Aberto";
    }

    // Calcula o valor de cada parcela
    const valorParcela = parseFloat((valorTotalComDesc / parcelas).toFixed(2));
    const ultimaParcela = valorTotalComDesc - valorParcela * (parcelas - 1); // Garante precisão

    // Cria as parcelas dentro de uma transação
    for (let i = 0; i < parcelas; i++) {
      const dataVencimentoParcela = addMonths(new Date(vencimento), i);

      await contasreceber.create(
        {
          status,
          clienteId, // Nome correto do campo
          vencimento: dataVencimentoParcela,
          valorReceber: i === parcelas - 1 ? ultimaParcela : valorParcela, // Ajusta a última parcela
          parcelas: i + 1,
          formaPagamento,
          dataReceber: dataReceber || null,
          valorPago: i === 0 ? valorPago : null, // Registra pagamento na primeira parcela
          juros,
          multa,
          descontos,
          custos,
          valorEmAberto: i === parcelas - 1 ? valorEmAberto : null, // Define na última parcela
          obs: obs || null,
          recibo,
          empresa,
          categoria,
          cpfCnpj: cpfCnpjSemPonto,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ message: "Contas a receber cadastradas com sucesso" });
  } catch (err) {
    await t.rollback();
    console.error("Erro ao criar registro de receber:", err);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: err.message,
    });
  }
};

// Função auxiliar para formatar CPF/CNPJ
const formatCpfCnpj = (value) => {
  if (!value) return null;
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (value.length === 14) {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return value;
};

const calculateStatus = (valorPago, valorEmAberto, vencimento) => {
  const currentDate = new Date();
  if (valorEmAberto <= 0) {
    return "Fechado";
  } else if (valorPago > 0 && valorEmAberto > 0) {
    return "Parcial";
  } else if (vencimento && isBefore(new Date(vencimento), currentDate)) {
    return "Atrasado";
  } else {
    return "Aberto";
  }
};

// Função auxiliar para formatar datas
const formatDate = (date) => {
  if (!date || !isValid(new Date(date))) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return format(adjustedDate, "dd/MM/yyyy", { locale: ptBR });
};

// Função genérica para buscar contas
const fetchReceber = async (filter = {}) => {
  return await contasreceber.findAll({
    where: filter,
    order: [
      [Sequelize.literal("CASE WHEN contasreceber.status = 'Fechado' THEN 1 ELSE 0 END"), "ASC"],
      ["vencimento", "ASC"],
    ],
    attributes: [
      "status",
      "id",
      "vencimento",
      "valorReceber",
      "clienteId", // Alterado para refletir a chave estrangeira
      "parcelas",
      "empresa",
      "categoria",
      "cpfCnpj",
      "dataReceber",
      "createdAt",
    ],
    include: [
      {
        model: cliente,
        as: "cliente",
        attributes: ["razaoSocial", "id"], // Adiciona o nome do cliente
      },
    ],
  });
};

exports.getReceber = async (req, res) => {
  try {
    const contas = await fetchReceber();
    
    const contasFormatadas = contas.map((receber) => ({
      status: receber.status,
      id: receber.id,
      cliente: receber.cliente.razaoSocial,
      vencimento: formatDate(receber.vencimento),
      valorReceber: receber.valorReceber,
      parcelas: receber.parcelas,
      empresa: receber.empresa,
      categoria: receber.categoria || null,
      cpfCnpj: formatCpfCnpj(receber.cpfCnpj),
      clienteNome: receber.cliente ? receber.cliente.razaoSocial : null,
      dataReceber: formatDate(receber.dataReceber),
      createdAt: formatDate(receber.createdAt),
    }));

    res.status(200).json(contasFormatadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar contas", details: err.message });
  }
};

// Listar contas a receber de um cliente específico
exports.getReceberCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Valida se o ID do cliente é um número válido
    if (isNaN(clienteId)) {
      return res.status(400).json({ error: "ID do cliente inválido." });
    }

    // Busca as contas a receber associadas ao cliente
    const contas = await contasreceber.findAll({
      where: { clienteId }, // Filtro pelo clienteId
      include: [
        {
          model: cliente,
          as: "cliente", 
          attributes: ["razaoSocial", "id"], // Inclui campos desejados do cliente
        },
      ],
    });

    // Formata o resultado
    const contasFormatadas = contas.map((receber) => ({
      status: receber.status,
      id: receber.id,
      cliente: receber.cliente.razaoSocial,
      vencimento: formatDate(receber.vencimento),
      valorReceber: receber.valorReceber,
      parcelas: receber.parcelas,
      empresa: receber.empresa,
      categoria: receber.categoria || null,
      cpfCnpj: formatCpfCnpj(receber.cliente ? receber.cliente.cpfCnpj : null),
      clienteNome: receber.cliente ? receber.cliente.razaoSocial : null,
      dataReceber: formatDate(receber.dataReceber),
      createdAt: formatDate(receber.createdAt),
    }));

    res.status(200).json(contasFormatadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar contas do cliente", details: err.message });
  }
};

exports.getReceberId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido!" });
    }

    const receber = await contasreceber.findByPk(id, {
      attributes: [
        "id",
        "status",
        "clienteId",
        "vencimento",
        "cpfCnpj",
        "valorReceber",
        "parcelas",
        "formaPagamento",
        "dataReceber",
        "valorPago",
        "juros",
        "multa",
        "descontos",
        "custos",
        "valorEmAberto",
        "recibo",
        "obs",
        "empresa",
        "categoria",
      ],
      include: [
        {
          model: cliente,
          as: "cliente",
          attributes: ["razaoSocial", "id", "email"], // Inclui o nome do cliente no retorno
        },
      ],
    });

    if (!receber) {
      return res.status(404).json({ message: "Registro não encontrado!" });
    }

    res.status(200).json(receber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar registro!", details: err.message });
  }
};

exports.updateReceber = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      cliente,
      cpfCnpj,
      vencimento,
      valorReceber,
      formaPagamento,
      dataReceber,
      valorPago,
      juros,
      multa,
      descontos,
      custos,
      obs,
      recibo,
      empresa,
      categoria,
    } = req.body;

    const receberRegistro = await contasreceber.findByPk(id);
    if (!receberRegistro) {
      return res.status(404).json({ message: `Registro com ID ${id} não encontrado!` });
    }

    // Validações e formatações dos dados
    const cpfCnpjSemPonto = cpfCnpj ? cpfCnpj.replace(/[.\-/]/g, "") : null;
    const valorReceberNum = parseFloat(valorReceber) || 0;
    const valorPagoNum = parseFloat(valorPago) || 0;
    const jurosNum = parseFloat(juros) || 0;
    const multaNum = parseFloat(multa) || 0;
    const descontosNum = parseFloat(descontos) || 0;

    const valorEmAberto = parseFloat(
      (valorReceberNum - valorPagoNum + jurosNum + multaNum - descontosNum).toFixed(2)
    );

    const novoStatus = calculateStatus(valorPagoNum, valorEmAberto, vencimento);

    // Atualiza o registro
    await receberRegistro.update({
      status: novoStatus,
      cliente,
      vencimento,
      cpfCnpj: cpfCnpjSemPonto,
      formaPagamento,
      dataReceber,
      valorPago: valorPagoNum,
      juros: jurosNum,
      multa: multaNum,
      descontos: descontosNum,
      custos,
      valorEmAberto,
      obs,
      recibo,
      empresa,
      categoria,
      valorReceber: valorReceberNum,
    });

    res.status(200).json({ message: "Registro atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar registro!", details: err.message });
  }
};

exports.delReceber = async (req, res) => {
  try {
    // Verificação de regra do usuário
    if (req.loggedUser.rule !== 1) {
      return res
        .status(403)
        .json(
          "Permissão negada. Apenas administradores podem deletar o conta a receber."
        );
    }

    let { id } = req.params;
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json("ID do contas a receber inválido ou não fornecido na requisição");
    }

    const deleteRows = await contasreceber.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json("Deletado com sucesso!");
    } else {
      res
        .status(404)
        .json(`O conta a receber com id ${id} não encontrada para exclusão!`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao tentar a conexão com o banco!");
  }
};
