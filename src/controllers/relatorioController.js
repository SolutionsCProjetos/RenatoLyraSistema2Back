const {
  cliente,
  contasreceber,
  contasapagar,
  candidatos,
  historicoEmpresa,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const moment = require("moment");

exports.gerarRelatorioClientes = async (req, res) => {
  try {
    const { cpf, razaoSocial } = req.query;

    const whereClause = {};

    // Filtro por cpf (opcional)
    if (cpf) {
      whereClause.cpf = {
        [Op.eq]: cpf,
      };
    }

    // Filtro por razaoSocial (opcional)
    if (razaoSocial) {
      whereClause.razaoSocial = {
        [Op.like]: `%${razaoSocial}%`,
      };
    }

    // Executa a consulta ao banco de dados com os filtros aplicados
    const clientes = await cliente.findAll({
      where: whereClause,
      order: [
        // Depois ordena por data de vencimento, de forma crescente
        ["razaoSocial", "ASC"],
      ],
      attributes: ["status", "contato", "cpf", "razaoSocial"],
    });

    // Formatar as datas no formato pt-BR e ajustar o fuso horário para cada cliente individualmente
    const clientesFormatados = clientes.map((cliented) => {
      return {
        ...cliented.toJSON(),
      };
    });

    // Verifica se encontrou clientes e retorna
    if (clientes.length === 0) {
      return res.status(404).json({ message: "Nenhum cliente encontrado." });
    }

    // Retorna a lista de clientes encontrados
    res.status(200).json(clientesFormatados);
  } catch (err) {
    console.error("Erro ao puxar clientes: ", err);
    res.status(500).json({ message: "Erro ao buscar os clientes." });
  }
};

/* exports.gerarRelatorioReceber = async (req, res) => {
  try {
    const { startDate, endDate, clientName, statusContas, categoriaS } =
      req.query;

    // Preparar as condições de busca
    const whereCondition = {
      ...(startDate &&
        endDate && {
          vencimento: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        }),
      ...(clientName && {
        cliente: {
          [Op.like]: `%${clientName}%`,
        },
      }),
      ...(statusContas && {
        status: {
          [Op.like]: `%${statusContas}%`,
        },
      }),
      ...(categoriaS && {
        categoria: {
          [Op.like]: `%${categoriaS}%`,
        },
      }),
    };

    const receber = await contasreceber.findAll({
      where: whereCondition, // Aplicar as condições de busca
      order: [
        // Primeiro ordena por status, colocando 'F' no final
        [
          Sequelize.literal("CASE WHEN status = 'Fechado' THEN 1 ELSE 0 END"),
          "DESC",
        ],
        // Depois ordena por data de vencimento, de forma crescente
        ["vencimento", "ASC"],
      ],
      attributes: [
        "id",
        "status",
        "vencimento",
        "valorReceber",
        "parcelas",
        "formaPagamento",
        "dataReceber",
        "valorPago",
        "custos",
        "valorEmAberto",
        "cliente",
        "categoria",
      ],
    });

    if (receber.length > 0) {
      const formatDate = (date) => {
        if (date) {
          return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
        }
        return "";
      };

      const receberFormatada = receber.map((item) => {
        const vencimentoDate = new Date(item.vencimento);
        vencimentoDate.setHours(vencimentoDate.getHours() + 3); // Ajuste de fuso horário

        const entregaDate = new Date(item.dataReceber);
        entregaDate.setHours(entregaDate.getHours() + 3); // Ajuste de fuso horário

        return {
          ...item.get(),
          vencimento: formatDate(vencimentoDate),
          dataReceber: formatDate(entregaDate),
        };
      });

      res.status(200).json(receberFormatada);
    } else {
      res.status(404).json({ message: "Nenhum cadastro encontrado!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}; */
/* exports.gerarRelatorioContas = async (req, res) => {
  try {
    const { startDate, endDate, fornecedorName, statusContas, categoriaS } =
      req.query;

    // Validar datas (caso fornecidas)
    if (
      (startDate && isNaN(new Date(startDate))) ||
      (endDate && isNaN(new Date(endDate)))
    ) {
      return res.status(400).json({ message: "Datas inválidas fornecidas." });
    }

    // Preparar as condições de busca
    const whereCondition = {
      ...(startDate &&
        endDate && {
          vencimento: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        }),
      ...(fornecedorName && {
        fornecedor: {
          [Op.like]: `%${fornecedorName}%`,
        },
      }),
      ...(statusContas && {
        situacao: {
          [Op.like]: `%${statusContas}%`,
        },
      }),
      ...(categoriaS && {
        categoria: {
          [Op.like]: `%${categoriaS}%`,
        },
      }),
    };

    // Buscar as contas a pagar
    const pagar = await contasapagar.findAll({
      where: whereCondition,
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
        "situacao",
        "fornecedor",
        "parcelas",
        "vencimento",
        "dataPagamento",
        "valorTotal",
        "valorPago",
        "empresa",
        "categoria",
      ],
    });

    if (!pagar || pagar.length === 0) {
      return res.status(404).json({ message: "Nenhum cadastro encontrado!" });
    }

    const formatDate = (date) =>
      date ? format(new Date(date), "dd/MM/yyyy", { locale: ptBR }) : "";

    const pagarFormatada = pagar.map((item) => {
      const vencimentoDate = new Date(item.vencimento);
      vencimentoDate.setHours(vencimentoDate.getHours() + 3);

      const entregaDate = new Date(item.dataPagamento); // Corrigido o campo

      return {
        ...item.get(),
        vencimento: formatDate(vencimentoDate),
        dataPagamento: formatDate(entregaDate), // Corrigido o campo
      };
    });

    res.status(200).json(pagarFormatada);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erro interno do servidor.",
      error: err.message,
    });
  }
}; */

exports.gerarRelatorioEmpregabilidade = async (req, res) => {
  try {
    const { areaAtuacao, status } = req.query;
    const whereClause = {};

    if (areaAtuacao && typeof areaAtuacao === "string") {
      whereClause.areaAtuacao = { [Op.like]: `%${areaAtuacao}%` };
    }

    if (status && typeof status === "string") {
      whereClause.status = { [Op.like]: `%${status}%` };
    }

    const empregabilidade = await candidatos.findAll({
      where: whereClause,
      order: [["nome", "ASC"]],
      attributes: ["nome", "contato", "areaAtuacao", "departamento", "status"],
    });

    if (!empregabilidade.length) {
      return res.status(404).json({ message: "Nenhum candidato encontrado." });
    }

    res.status(200).json(empregabilidade);
  } catch (err) {
    console.error("Erro ao buscar candidatos:", err);
    res.status(500).json({ message: "Erro ao buscar os candidatos!" });
  }
};

