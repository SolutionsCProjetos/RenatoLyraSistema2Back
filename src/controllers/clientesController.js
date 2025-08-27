const { cliente, contasreceber } = require("../models");
const { Sequelize } = require("sequelize");
const { format, isValid } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const { validarCNPJ, validarCPF } = require("../config/validaCpfCnpj");

exports.createClientes = async (req, res) => {
  let {
    status,
    email,
    indicacao,
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
    situacao,
    obs,
    prioridade,
  } = req.body;

  try {
    // Verifica se o cliente já está cadastrado
    const existingUser = await cliente.findOne({ where: { cpf } });
    if (existingUser) {
      return res.status(409).json({ message: "O cliente já está cadastrado." });
    }

    // Se o CPF for inválido, retorna um erro
    if (cpf && !validarCPF(cpf)) {
      return res.status(400).json({ message: "CPF inválido. Por favor informe um CPF valido!" });
    }

    if (cnpj && !validarCNPJ(cnpj)) {
      return res.status(400).json({ message: "CNPJ inválido. Por favor informe um CNPJ valido!" });
    }

    // Tratamento de outros campos
    const cpfSemPonto = cpf ? cpf.replace(/[.-]/g, "") : null;
    const cnpjSemPonto = cnpj ? cnpj.replace(/[.-]/g, "") : null;
    const CepSemPont = cep.replace(/[-]/g, "");
    const TelefoneSemPont = telefone_2.replace(/[()-]/g, "");

    cnpj = cnpjSemPonto || null;
    cpf = cpfSemPonto || null;
    cep = CepSemPont || null;
    endereco = endereco || null;
    num = num || null;
    bairro = bairro || null;
    uf = uf || null;
    cidade = cidade || null;
    pontoReferencia = pontoReferencia || null;
    telefone_2 = TelefoneSemPont || null;
    situacao = situacao || null;
    obs = obs || null;

    // Criação do cliente
    const clientes = await cliente.create({
      status,
      email,
      indicacao,
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
      situacao,
      obs,
      prioridade,
    });

    res.status(201).json(clientes);
  } catch (err) {
    console.error("Erro ao criar o Cliente: ", err);
    res.status(500).json({ message: "Erro ao criar o Cliente." });
  }
};

exports.getClientes = async (req, res) => {
  try {
    const clientes = await cliente.findAll({
      order: [["razaoSocial", "ASC"]],
      attributes: [
        "id",
        "razaoSocial",
        "status",
        "prioridade",
        "contato",
        "cpf"
      ],
    });

    // Formatar as datas no formato pt-BR e ajustar o fuso horário para cada cliente individualmente
    const clientesFormatados = clientes.map((cliented) => {

      return {
        ...cliented.toJSON(), // Transforma o modelo Sequelize em objeto JS
      };
    });

    res.status(200).json(clientesFormatados);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao listar os Clientes." });
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

exports.getClienteId = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteId = await cliente.findByPk(id, {
      attributes: [
        "id",
        "status",
        "email",
        "contato",
        "cnpj",
        "cpf",
        "indicacao",
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
        "situacao",
        "obs",
        "prioridade",
      ],
    });

    // Se encontrar o cliente, formatar o CPF/CNPJ
    if (clienteId) {
      clienteId.cpfCnpj = formatCpfCnpj(clienteId.cpfCnpj);
    }

    res.status(200).json(clienteId);
  } catch (err) {
    console.log("Erro ao puxar clienteId: ", err);
    res.status(500).json({ message: "Erro ao buscar o cliente." });
  }
};

exports.uploadCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      email,
      contato,
      cnpj,
      cpf,
      razaoSocial,
      indicacao,
      fantasia,
      cep,
      endereco,
      num,
      bairro,
      uf,
      cidade,
      pontoReferencia,
      telefone_2,
      situacao,
      obs,
      prioridade,
    } = req.body;

    // Verifica se o cliente existe
    const clienteExistente = await cliente.findByPk(id);

    if (!clienteExistente) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Atualiza os campos apenas se fornecidos
    clienteExistente.status = status || clienteExistente.status;
    clienteExistente.email = email || clienteExistente.email;
    clienteExistente.indicacao = indicacao || clienteExistente.indicacao;
    clienteExistente.contato = contato || clienteExistente.contato;
    clienteExistente.cpf = cpf || clienteExistente.cpf;
    clienteExistente.cnpj = cnpj || clienteExistente.cnpj;
    clienteExistente.razaoSocial = razaoSocial || clienteExistente.razaoSocial;
    clienteExistente.fantasia = fantasia || clienteExistente.fantasia;
    clienteExistente.cep = cep || clienteExistente.cep;
    clienteExistente.endereco = endereco || clienteExistente.endereco;
    clienteExistente.num = num || clienteExistente.num;
    clienteExistente.bairro = bairro || clienteExistente.bairro;
    clienteExistente.uf = uf || clienteExistente.uf;
    clienteExistente.cidade = cidade || clienteExistente.cidade;
    clienteExistente.pontoReferencia = pontoReferencia || clienteExistente.pontoReferencia;
    clienteExistente.telefone_2 = telefone_2 || clienteExistente.telefone_2;
    clienteExistente.situacao = situacao || clienteExistente.situacao;
    clienteExistente.obs = obs || clienteExistente.obs;
    (clienteExistente.prioridade = prioridade || clienteExistente.prioridade);

    // Salva as alterações no banco de dados
    await clienteExistente.save();
    res.status(200).json({ message: "Cliente atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar o Cliente:", err);
    res.status(500).json({ message: "Erro ao atualizar o Cliente." });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    // Verifica a permissão do usuário
    if (req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o cliente.",
      });
    }

    const { id } = req.params;

    // Busca o cliente pelo ID
    const clientes = await cliente.findByPk(id);
    if (!clientes) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Verifica se existem contas a receber associadas ao cliente
    const contasAssociadas = await contasreceber.count({
      where: { clienteId: id }, // Ajuste de acordo com o nome do campo FK
    });

    if (contasAssociadas > 0) {
      return res.status(400).json({
        message: "Não é possível deletar o cliente, pois ele possui contas a receber associadas.",
      });
    }

    // Deleta o cliente
    await clientes.destroy();
    res.status(200).json({ message: "Cliente deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao tentar deletar o cliente:", err);
    res.status(500).json({ message: "Erro ao tentar deletar o cliente." });
  }
};
