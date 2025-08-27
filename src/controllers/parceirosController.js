const bcrypt = require("bcrypt");
const { parceiros, contasapagar, tipo } = require("../models");
const { validarCNPJ, validarCPF } = require("../config/validaCpfCnpj");

exports.createParceiros = async (req, res) => {
  let {
    status,
    email,
    senha,
    contato,
    cnpj,
    cpf,
    razaoSocial,
    fantasia,
    cep,
    endereco,
    num,
    bairro,
    uf,
    cidade,
    pontoReferencia,
    telefone_2,
    obsEnd,
    rule,
    obs,
    tipoId,
  } = req.body;

  try {
    // Verifica se o parceiro já existe
    const existingParceiro = await parceiros.findOne({ where: { cnpj } });
    if (existingParceiro) {
      return res.status(409).json({ message: "O parceiro já está cadastrado." });
    }

    // Validação de CPF e CNPJ
    if (cpf && !validarCPF(cpf)) {
      return res
        .status(400)
        .json({ message: "CPF inválido. Por favor, informe um CPF válido!" });
    }

    if (cnpj && !validarCNPJ(cnpj)) {
      return res
        .status(400)
        .json({ message: "CNPJ inválido. Por favor, informe um CNPJ válido!" });
    }

    // Limpeza de dados
    const cpfSemPonto = cpf ? cpf.replace(/[.-]/g, "") : null;
    const cnpjSemPonto = cnpj ? cnpj.replace(/[.-]/g, "") : null;
    const CepSemPont = cep ? cep.replace(/[-]/g, "") : null;
    const TelefoneSemPont = telefone_2
      ? telefone_2.replace(/[()-]/g, "")
      : null;

    cnpj = cnpjSemPonto || null;
    cpf = cpfSemPonto || null;
    telefone_2 = TelefoneSemPont || null;

    // Define a regra do usuário
    const userRule = 2;

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criação do parceiro
    const parceiro = await parceiros.create({
      status,
      email,
      senha: hashedPassword,
      contato,
      cnpj,
      cpf,
      razaoSocial,
      fantasia,
      cep: CepSemPont,
      endereco,
      num,
      bairro,
      uf,
      cidade,
      pontoReferencia,
      telefone_2,
      obsEnd,
      rule: userRule,
      obs,
      tipoId,
    });

    res.status(201).json(parceiro);
  } catch (err) {
    console.error("Erro ao criar o parceiro: ", err);
    res.status(500).json({ message: "Erro ao criar o parceiro." });
  }
};

exports.getParceiros = async (req, res) => {
  try {
    const parceiro = await parceiros.findAll({
      order: [["razaoSocial", "ASC"]],
      attributes: ["id", "razaoSocial", "fantasia", "status", "contato", "cnpj"],
      include: [
        {
          model: tipo,
          as: "tipos",
          attributes: ["comercio"],
        },
      ],
    });

    const parceirosFormatados = parceiro.map((parceiroId) => {
      return {
        ...parceiroId.toJSON(),
      };
    });

    res.status(200).json(parceirosFormatados);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao listar os parceiro." });
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

exports.getParceirosId = async (req, res) => {
  try {
    const { id } = req.params;

    const parceiroId = await parceiros.findByPk(id, {
      attributes: [
        "status",
        "email",
        "contato",
        "cnpj",
        "cpf",
        "razaoSocial",
        "fantasia",
        "cep",
        "endereco",
        "num",
        "bairro",
        "uf",
        "cidade",
        "pontoReferencia",
        "telefone_2",
        "obsEnd",
        "obs",
        "rule",
      ],
      include: [
        {
          model: tipo,
          as: "tipos",
          attributes: ["comercio"],
        },
      ],
    });

    if (parceiroId) {
      parceiroId.cpf = formatCpfCnpj(parceiroId.cpf);
      parceiroId.cnpj = formatCpfCnpj(parceiroId.cnpj);
    }

    res.status(200).json(parceiroId);
  } catch (err) {
    console.log("Erro ao puxar o cliente: ", err);
    res.status(500).json({ message: "Erro ao buscar o parceiro." });
  }
};

exports.updateParceiro = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      email,
      contato,
      cnpj,
      cpf,
      razaoSocial,
      fantasia,
      cep,
      endereco,
      num,
      bairro,
      uf,
      cidade,
      pontoReferencia,
      telefone_2,
      obsEnd,
      rule,
      obs,
      tipoId,
    } = req.body;

    // Verifica se o parceiro existe
    const parceiroExistente = await parceiros.findByPk(id);
    if (!parceiroExistente) {
      return res.status(404).json({ message: "Parceiro não encontrado!" });
    }

    // Apenas administradores podem alterar o setorId e rule
    if (req.loggedUser.rule === 1) {
      parceiroExistente.rule = rule || parceiroExistente.rule;
    }

    // Atualiza os dados
    parceiroExistente.status = status || parceiroExistente.status;
    parceiroExistente.email = email || parceiroExistente.email;
    parceiroExistente.contato = contato || parceiroExistente.contato;
    parceiroExistente.cpf = cpf || parceiroExistente.cpf;
    parceiroExistente.cnpj = cnpj || parceiroExistente.cnpj;
    parceiroExistente.razaoSocial =
      razaoSocial || parceiroExistente.razaoSocial;
    parceiroExistente.fantasia = fantasia || parceiroExistente.fantasia;
    parceiroExistente.cep = cep || parceiroExistente.cep;
    parceiroExistente.endereco = endereco || parceiroExistente.endereco;
    parceiroExistente.num = num || parceiroExistente.num;
    parceiroExistente.bairro = bairro || parceiroExistente.bairro;
    parceiroExistente.uf = uf || parceiroExistente.uf;
    parceiroExistente.cidade = cidade || parceiroExistente.cidade;
    parceiroExistente.pontoReferencia =
      pontoReferencia || parceiroExistente.pontoReferencia;
    parceiroExistente.telefone_2 = telefone_2 || parceiroExistente.telefone_2;
    parceiroExistente.obsEnd = obsEnd || parceiroExistente.obsEnd;
    parceiroExistente.obs = obs || parceiroExistente.obs;
    parceiroExistente.tipoId = tipoId || parceiroExistente.tipoId;

    await parceiroExistente.save();

    res.status(200).json({ message: "Parceiro atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar o Parceiro:", err);
    res.status(500).json({ message: "Erro ao atualizar o Parceiro." });
  }
};

exports.deleteParceiro = async (req, res) => {
  try {
    // Verifica a permissão do usuário
    if (req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o parceiro.",
      });
    }

    const { id } = req.params;

    // Busca o parceiro pelo ID
    const parceiro = await parceiros.findByPk(id);
    if (!parceiro) {
      return res.status(404).json({ message: "Parceiros não encontrado." });
    }

    // Deleta o parceiro
    await parceiros.destroy({ where: { id } });
    res.status(200).json({ message: "Parceiros deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao tentar deletar o parceiro:", err);
    res.status(500).json({ message: "Erro ao tentar deletar o parceiro." });
  }
};
