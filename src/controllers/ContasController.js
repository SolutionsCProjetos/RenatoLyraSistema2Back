const { contasapagar, sequelize } = require("../models");
const { Sequelize } = require("sequelize");
const { format, differenceInDays, isValid, isBefore } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const { validationResult } = require("express-validator");

exports.createContas = async (req, res) => {
  try {
    const errors = validationResult(req); // Validação dos campos da requisição
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let {
      situacao,
      vencimento,
      historico,
      fornecedor,
      valorTotal,
      valorEmAberto,
      parcelas,
      dataPagamento,
      valorPago,
      juros,
      desconto,
      obs,
      recibo,
      empresa,
      categoria,
      cnpj,
    } = req.body;

    // Garantir que os valores sejam números
    valorTotal = parseFloat(valorTotal) || 0;
    valorPago = parseFloat(valorPago) || 0;
    juros = parseFloat(juros) || 0;
    desconto = parseFloat(desconto) || 0;

    // Remove caracteres especiais do CNPJ
    const cnpjSemPonto = cnpj ? cnpj.replace(/[.\-/]/g, "") : null;

    // Calcula valor em aberto considerando juros e desconto
    const valorTotalComJuros = valorTotal + juros - desconto;
    valorEmAberto = valorTotalComJuros - valorPago;

    // Define a situação com base nos valores calculados
    if (valorEmAberto <= 0) {
      situacao = "Paga"; // Se valor em aberto for zero, a conta está paga
      valorEmAberto = 0; // Garantir que o valor em aberto seja zero se pago
    } else if (valorPago > 0) {
      situacao = "Pago parcial"; // Se valor pago é maior que zero mas menor que o total
    } else {
      situacao = "Aberta"; // Conta em aberto
    }

    // Define campos opcionais como null se forem strings vazias
    dataPagamento = dataPagamento || null;
    obs = obs || null;

    // Calcula o valor de cada parcela
    const valorParcela = valorTotalComJuros / parcelas;
    const valorEmAbertoParcela = valorEmAberto / parcelas; // Dividir o valor em aberto entre as parcelas

    // Converte a data de vencimento inicial para um objeto Date
    let dataVencimento = new Date(vencimento);

    // Array para armazenar promessas de criação de parcelas
    const criarParcelas = [];

    for (let i = 0; i < parcelas; i++) {
      // Cria uma nova data de vencimento para cada parcela
      let dataVencimentoParcela = new Date(dataVencimento);
      if (i > 0) {
        dataVencimentoParcela.setMonth(dataVencimentoParcela.getMonth() + i);
      }

      // Formata a data para string no formato 'YYYY-MM-DD'
      const vencimentoFormatado = dataVencimentoParcela
        .toISOString()
        .split("T")[0];

      // Cria a promessa de inserção da parcela e adiciona ao array
      criarParcelas.push(
        contasapagar.create({
          situacao,
          fornecedor,
          vencimento: vencimentoFormatado,
          historico,
          valorTotal: valorParcela.toFixed(2), // Arredonda para duas casas decimais
          parcelas: i + 1, // Número da parcela (1, 2, 3, ...)
          dataPagamento,
          valorPago: valorPago ? valorPago.toFixed(2) : null,
          juros: juros.toFixed(2),
          desconto: desconto.toFixed(2),
          valorEmAberto: valorEmAbertoParcela.toFixed(2), // Valor em aberto por parcela
          obs,
          recibo,
          empresa: empresa,
          categoria: categoria,
          cnpj: cnpjSemPonto,
        })
      );
    }

    // Aguarda a inserção de todas as parcelas no banco de dados
    await Promise.all(criarParcelas);

    res.status(201).json({
      message: "Contas a pagar cadastradas com sucesso",
      criarParcelas,
    });
  } catch (err) {
    console.error("Erro ao criar registro de contas a pagar:", err); // Log do erro completo no console
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", details: err.message });
  }
};

exports.getAllContas = async (req, res) => {
  try {
    const contas = await contasapagar.findAll({
      order: [
        // Primeiro ordena por status, colocando 'F' no final
        [
          Sequelize.literal("CASE WHEN situacao = 'Paga' THEN 1 ELSE 0 END"),
          "ASC",
        ],
        // Depois ordena por data de vencimento, de forma crescente
        ["vencimento", "ASC"],
      ],
      attributes: [
        "id",
        "cnpj",
        "situacao",
        "fornecedor",
        "historico",
        "parcelas",
        "vencimento",
        "dataPagamento",
        "valorTotal",
        "valorPago",
        "empresa",
        "categoria",
        "createdAt",
      ],
    });

    const contasAPagarFormatadas = contas.map((pagar) => {
      const cnpjFormatado = pagar.cnpj
        ? pagar.cnpj.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            "$1.$2.$3/$4-$5"
          )
        : null;

      // Ajuste de fuso horário
      const vencimentoDate = new Date(pagar.vencimento);
      vencimentoDate.setHours(vencimentoDate.getHours() + 3);

      const dataPagamentoDate = pagar.dataPagamento
        ? new Date(pagar.dataPagamento)
        : null;
      if (dataPagamentoDate) {
        dataPagamentoDate.setHours(dataPagamentoDate.getHours() + 3);
      }

      const createdAtDate = new Date(pagar.createdAt);
      createdAtDate.setHours(createdAtDate.getHours() + 3);

      if (!isValid(vencimentoDate)) {
        return {
          ...pagar.get(),
          cnpj: cnpjFormatado,
          diasParaVencer: null, // Mantenha consistente com o tipo de dados esperado
          vencimento: "Data de vencimento inválida",
          createdAt: format(createdAtDate, "dd/MM/yyyy", { locale: ptBR }),
        };
      }

      const today = new Date();
      const diasParaVencer = differenceInDays(vencimentoDate, today);

      return {
        ...pagar.get(),
        cnpj: cnpjFormatado,
        diasParaVencer,
        vencimento: format(vencimentoDate, "dd/MM/yyyy", { locale: ptBR }),
        dataPagamento: dataPagamentoDate
          ? format(dataPagamentoDate, "dd/MM/yyyy", { locale: ptBR })
          : null,
        createdAt: format(createdAtDate, "dd/MM/yyyy", { locale: ptBR }),
      };
    });

    res.status(200).json(contasAPagarFormatadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar contas a pagar" });
  }
};

exports.getAllContasId = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id, 10); // Converte id para um número inteiro
    if (isNaN(id)) {
      return res.status(400).json({ error: "Id inválido!" });
    }

    // Busca a conta a pagar pelo ID no MySQL
    const contas = await contasapagar.findByPk(id, {
      attributes: [
        "cnpj",
        "situacao",
        "vencimento",
        "fornecedor",
        "historico",
        "dataPagamento",
        "valorTotal",
        "parcelas",
        "juros",
        "desconto",
        "valorPago",
        "valorEmAberto",
        "empresa",
        "categoria",
        "recibo",
        "obs",
      ],
    });
    if (!contas) {
      res.status(404).json({ message: "Contas a pagar não encontrado!" });
    }

    res.status(200).json(contas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.uploadContas = async (req, res) => {
  try {
    let { id } = req.params;
    let {
      cnpj,
      situacao,
      vencimento,
      fornecedor,
      historico,
      dataPagamento,
      valorTotal,
      juros,
      desconto,
      valorPago,
      valorEmAberto,
      empresa,
      categoria,
      recibo,
      obs,
    } = req.body;

    const contaRegistro = await contasapagar.findByPk(id);
    if (!contaRegistro) {
      return res
        .status(404)
        .json({ message: `Registro com Id ${id} não encontrado` });
    }

    // Converte valores para números
    valorTotal = parseFloat(valorTotal) || 0;
    juros = parseFloat(juros) || 0;
    desconto = parseFloat(desconto) || 0;
    valorPago = parseFloat(valorPago) || 0;

    // Calcula valor em aberto considerando juros e desconto
    const valorComJuros = valorTotal + juros;
    const valorFinal = valorComJuros - desconto;
    valorEmAberto = valorFinal - valorPago;

    // Define o status com base nos valores calculados
    if (valorEmAberto <= 0) {
      situacao = "Paga";
      valorEmAberto = 0;
    } else if (valorPago > 0 && valorPago < valorFinal) {
      situacao = "Pago parcial";
    } else if (situacao !== "Paga" && new Date(vencimento) < new Date()) {
      situacao = "Atrasado"; // Define como atrasado se a data de vencimento já passou
    } else {
      situacao = situacao || "Aberta";
    }

    // Atualiza o registro no MySQL
    await contaRegistro.update({
      cnpj,
      situacao,
      vencimento,
      fornecedor,
      historico,
      dataPagamento,
      valorTotal,
      juros,
      desconto,
      valorPago,
      valorEmAberto,
      empresa,
      categoria,
      recibo,
      obs,
    });

    res.status(200).json("Sucesso ao atualizar o cadastro e enviar a imagem!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Não foi possível atualizar os dados no banco!");
  }
};

exports.delContas = async (req, res) => {
  try {
    // Verificação de regra do usuário
    if (req.loggedUser.rule !== 1) {
      return res
        .status(403)
        .json(
          "Permissão negada. Apenas administradores podem deletar o contas a pagar."
        );
    }

    let { id } = req.params;
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json("ID da Receita inválido ou não fornecido na requisição");
    }

    const deleteRows = await contasapagar.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json("Deletado com sucesso!");
    } else {
      res
        .status(404)
        .json(`O contas a pagar com id ${id} não encontrada para exclusão!`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao tentar a conexão com o banco!");
  }
};
