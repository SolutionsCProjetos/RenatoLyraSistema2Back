const { solicitantes } = require("../models");
const { ptBR } = require("date-fns");
const { Op } = require("sequelize");
const { validarCPF } = require("../config/validaCpfCnpj")

exports.createSolicitante = async (req, res) => {
  let {
    solicitante,
    nomeCompleto,
    cpf,
    titulo,
    telefoneContato,
    email,
    cep,
    endereco,
    bairro,
    num,
    zona,
    pontoReferencia,
    secaoEleitoral,
  } = req.body;

  try {
    // Se o CPF for inválido, retorna um erro
    if (cpf && !validarCPF(cpf)) {
      return res
        .status(400)
        .json({ message: "CPF inválido. Por favor informe um CPF valido!" });
    }

    // Tratamento de outros campos
    const cpfSemPonto = cpf ? cpf.replace(/[.-]/g, "") : null;
    const TelefoneSemPont = telefoneContato.replace(/[()-]/g, "");

    cpf = cpfSemPonto || null;
    telefoneContato = TelefoneSemPont || null;

    const existingUser = await solicitantes.findOne({ where: { cpf } });
    if (existingUser) {
      return res.status(409).json({ message: "O solicitante já está cadastrado." });
    }


    const Solicitante = await solicitantes.create({
      solicitante,
      nomeCompleto,
      cpf,
      titulo,
      telefoneContato,
      email,
      cep,
      endereco,
      bairro,
      num,
      zona,
      pontoReferencia,
      secaoEleitoral,
    });

    res.status(201).json(Solicitante);
  } catch (err) {
    console.error("Erro ao criar a Solicitante: ", err);
    res.status(500).json({ message: "Erro ao criar a Solicitante." });
  }
};

exports.getSolicitantes = async (req, res) => {
  try {
    const Solicitante = await solicitantes.findAll({
      order: [["nomeCompleto", "ASC"]],
      attributes: [
        "id",
        "solicitante",
        "nomeCompleto",
        "cpf",
        "titulo",
        "telefoneContato",
        "email",
        "secaoEleitoral",
        "createdAt",
      ],
    });

    // Formatar as datas no formato pt-BR e ajustar o fuso horário para cada Solicitante individualmente
    const SolicitantesFormatadas = Solicitante.map((Solicitanted) => {

      return {
        ...Solicitanted.toJSON(), // Transforma o modelo Sequelize em objeto JS
        dataSolicitacao: Solicitanted.dataSolicitacao?.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        dataTermino: Solicitanted.dataTermino?.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });

    res.status(200).json(SolicitantesFormatadas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao listar as Solicitantes." });
  }
};

function formatCpfCnpj(value) {
  // Verifica se o valor é nulo ou indefinido
  if (!value) {
    return null; // Retorna null ou um valor adequado, caso não haja CPF/CNPJ
  }

  // Remove qualquer coisa que não seja número
  value = value.replace(/\D/g, "");

  // Verifica se é CPF ou CNPJ
  if (value.length === 11) {
    // Formata CPF: 123.456.789-00
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (value.length === 14) {
    // Formata CNPJ: 12.345.678/0001-00
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  // Caso não seja nem CPF nem CNPJ, retorna o valor original
  return value;
}

exports.getSolicitanteId = async (req, res) => {
  try {
    const { id } = req.params;

    const SolicitanteId = await solicitantes.findByPk(id, {
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
    });

    // Se encontrar o Solicitante, formatar o CPF/CNPJ
    if (SolicitanteId) {
      SolicitanteId.cpfCnpj = formatCpfCnpj(SolicitanteId.cpfCnpj);
    }

    res.status(200).json(SolicitanteId);
  } catch (err) {
    console.log("Erro ao puxar a Solicitante: ", err);
    res.status(500).json({ message: "Erro ao buscar a Solicitante." });
  }
};

exports.uploadSolicitante = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      solicitante,
      nomeCompleto,
      cpf,
      titulo,
      telefoneContato,
      email,
      cep,
      endereco,
      bairro,
      num,
      zona,
      pontoReferencia,
      secaoEleitoral,
    } = req.body;

    // Verifica se o Solicitante existe
    const solicitanteExistente = await solicitantes.findByPk(id);

    if (!solicitanteExistente) {
      return res.status(404).json({ message: "Solicitante não encontrada." });
    }

    // Atualiza os campos apenas se fornecidos
    solicitanteExistente.solicitante= solicitante || solicitanteExistente.solicitante,
    solicitanteExistente.nomeCompleto= nomeCompleto || solicitanteExistente.nomeCompleto,
    solicitanteExistente.cpf= cpf || solicitanteExistente.cpf,
    solicitanteExistente.titulo= titulo || solicitanteExistente.titulo,
    solicitanteExistente.telefoneContato= telefoneContato || solicitanteExistente.telefoneContato,
    solicitanteExistente.email= email || solicitanteExistente.email,
    solicitanteExistente.cep= cep || solicitanteExistente.cep,
    solicitanteExistente.endereco= endereco || solicitanteExistente.endereco,
    solicitanteExistente.bairro= bairro || solicitanteExistente.bairro,
    solicitanteExistente.num= num || solicitanteExistente.num,
    solicitanteExistente.zona= zona || solicitanteExistente.zona,
    solicitanteExistente.pontoReferencia= pontoReferencia || solicitanteExistente.pontoReferencia,
    solicitanteExistente.secaoEleitoral= secaoEleitoral || solicitanteExistente.secaoEleitoral,
   // Salva as alterações no banco de dados
      await solicitanteExistente.save();
    res.status(200).json({ message: "Solicitante atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar a Solicitante:", err);
    res.status(500).json({ message: "Erro ao atualizar a Solicitante." });
  }
};

exports.deleteSolicitante = async (req, res) => {
  try {
    // Verifica a permissão do usuário
    if (req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar a Solicitante.",
      });
    }

    const { id } = req.params;

    // Busca o Solicitante pelo ID
    const Solicitante = await solicitantes.findByPk(id);
    if (!Solicitante) {
      return res.status(404).json({ message: "Solicitante não encontrada." });
    }

    const deleteRows = await solicitantes.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json({ message: "Deletado com sucesso!" });
    } else {
      res.status(404).json({
        error: `O solicitante com id ${id} não encontrada para exclusão!`,
      });
    }

    } catch (err) {
    console.error("Erro ao tentar deletar o Solicitante:", err);
    res.status(500).json({ message: "Erro ao tentar deletar o Solicitante." });
  }
};