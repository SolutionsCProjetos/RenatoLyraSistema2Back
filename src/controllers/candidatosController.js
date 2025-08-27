const { candidatos, historicoEmpresa } = require("../models");
const { Sequelize } = require("sequelize");
const { validationResult } = require("express-validator");

exports.createEmpregos = async (req, res) => {
  const t = await candidatos.sequelize.transaction();

  try {
    // Validação dos dados recebidos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      nome,
      rg,
      cpf,
      cnh,
      categoria,
      tituloEleitor,
      zonaEleitoral,
      cidadeEleitoral,
      secao,
      dependentes,
      areaAtuacao,
      areaAtuacao2,
      areaAtuacao3,
      areaAtuacao4,
      areaAtuacao5,
      estCivil,
      email,
      dataNascimento,
      contato,
      telefone2,
      cep,
      endereco,
      numero,
      bairro,
      uf,
      cidade,
      pontoReferencia,
      status,
      departamento,
      expProfissional,
      obs,
      documentos,
      historico,
    } = req.body;

    // Criando um novo empregado
    const novoEmprego = await candidatos.create(
      {
        nome,
        rg,
        cpf,
        cnh,
        categoria,
        tituloEleitor,
        zonaEleitoral,
        cidadeEleitoral,
        secao,
        dependentes,
        areaAtuacao,
        areaAtuacao2,
        areaAtuacao3,
        areaAtuacao4,
        areaAtuacao5,
        estCivil,
        email: email || null,
        dataNascimento,
        contato,
        telefone2,
        cep: cep || null,
        endereco,
        numero,
        bairro,
        uf,
        cidade,
        pontoReferencia,
        status,
        departamento,
        expProfissional,
        obs,
        documentos,
      },
      { transaction: t }
    );

    // Se houver histórico de empresa, adicionamos
    if (historico && Array.isArray(historico)) {
      for (const item of historico) {
        await historicoEmpresa.create(
          {
            empregoId: novoEmprego.id,
            empresas: item.empresas,
            funcao: item.funcao,
            data: item.data || null,
            dataDemissao: item.dataDemissao || null,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    return res.status(201).json({ message: "Candidato criado com sucesso" });
  } catch (err) {
    await t.rollback();
    console.error("Erro ao criar registro do Candidato:", err);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: err.message,
    });
  }
};

exports.getEmpregos = async (req, res) => {
  try {
    const candidato = await candidatos.findAll({
      order: [["nome", "ASC"]],
      attributes: [
        "id",
        "nome",
        "cpf",
        "categoria",
        "status",
        "cep",
        "cidade",
        "contato",
        "areaAtuacao",
        "areaAtuacao2",
        "areaAtuacao3",
        "areaAtuacao4",
        "areaAtuacao5",
      ],
    });

    const EmpregosFormtados = candidato.map((empregados) => {
      return {
        ...empregados.toJSON(),
      };
    });

    res.status(200).json(EmpregosFormtados);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro ao buscar os candidatos", details: err.message });
  }
};

exports.getEmpregoId = async (req, res) => {
  try {
    const { id } = req.params;
    const emprego = await candidatos.findByPk(id, {
      attributes: [
        "id",
        "nome",
        "rg",
        "cpf",
        "cnh",
        "categoria",
        "tituloEleitor",
        "zonaEleitoral",
        "cidadeEleitoral",
        "secao",
        "dependentes",
        "areaAtuacao",
        "areaAtuacao2",
        "areaAtuacao3",
        "areaAtuacao4",
        "areaAtuacao5",
        "estCivil",
        "email",
        "dataNascimento",
        "contato",
        "telefone2",
        "cep",
        "endereco",
        "numero",
        "bairro",
        "uf",
        "cidade",
        "pontoReferencia",
        "status",
        "departamento",
        "expProfissional",
        "documentos",
        "obs",
      ],
      include: [
        {
          model: historicoEmpresa,
          as: "historico",
          attributes: ["id", "empresas", "funcao", "data", "dataDemissao"],
        },
      ],
    });

    if (!emprego) {
      return res.status(404).json({ message: "Empregado não encontrado." });
    }

    res.status(200).json(emprego);
  } catch (err) {
    console.log("Erro ao puxar o candidato pelo id: ", err);
    res.status(500).json({ message: "Erro ao buscar o candidato." });
  }
};

exports.updateEmpregos = async (req, res) => {
  const t = await candidatos.sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; // Obtendo o ID do candidato
    const {
      nome,
      rg,
      cpf,
      cnh,
      categoria,
      tituloEleitor,
      zonaEleitoral,
      cidadeEleitoral,
      secao,
      dependentes,
      areaAtuacao,
      areaAtuacao2,
      areaAtuacao3,
      areaAtuacao4,
      areaAtuacao5,
      estCivil,
      email,
      dataNascimento,
      contato,
      telefone2,
      cep,
      endereco,
      numero,
      bairro,
      uf,
      cidade,
      pontoReferencia,
      status,
      departamento,
      obs,
      expProfissional,
      documentos,
      historico,
      historicoRemover, // Novo: lista de IDs de histórico para remover
    } = req.body;

    // Buscando o candidato pelo ID
    const candidato = await candidatos.findByPk(id, { transaction: t });
    if (!candidato) {
      return res.status(404).json({ message: "Candidato não encontrado." });
    }

    // Atualizando os dados do candidato
    await candidato.update(
      {
        nome,
        rg,
        cpf,
        cnh,
        categoria,
        tituloEleitor,
        zonaEleitoral,
        cidadeEleitoral,
        secao,
        dependentes,
        areaAtuacao,
        areaAtuacao2,
        areaAtuacao3,
        areaAtuacao4,
        areaAtuacao5,
        estCivil,
        email: email || null,
        dataNascimento,
        contato,
        telefone2,
        cep: cep || null,
        endereco,
        numero,
        bairro,
        uf,
        cidade,
        pontoReferencia,
        status,
        departamento,
        expProfissional,
        obs,
        documentos,
      },
      { transaction: t }
    );

    // Removendo empresas do histórico, se necessário
    if (
      historicoRemover &&
      Array.isArray(historicoRemover) &&
      historicoRemover.length > 0
    ) {
      await historicoEmpresa.destroy({
        where: { id: historicoRemover, empregoId: id }, // Garante que só remove do candidato correto
        transaction: t,
      });
    }

    // Adicionando novos históricos de empresas (SEM modificar os existentes)
    if (historico && Array.isArray(historico)) {
      for (const item of historico) {
        // Verifica se a empresa removida não está sendo adicionada novamente
        if (historicoRemover && historicoRemover.includes(item.id)) {
          continue; // Pula a adição dessa empresa
        }

        await historicoEmpresa.create(
          {
            empregoId: id,
            empresas: item.empresas,
            funcao: item.funcao,
            data: item.data,
            dataDemissao: item.dataDemissao || null, // Permite null se não for informado
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    return res.status(200).json({
      message: "Candidato atualizado com sucesso. Histórico atualizado.",
    });
  } catch (err) {
    await t.rollback();
    console.error("Erro ao atualizar registro do Candidato:", err);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: err.message,
    });
  }
};

exports.delCandidato = async (req, res) => {
  try {
    // Verificação de regra do usuário
    if (req.loggedUser.rule !== 1) {
      return res
        .status(403)
        .json({
          error:"Permissão negada. Apenas administradores podem deletar o candidato."
        });
    } 

    let { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "ID do candidato inválido ou não fornecido na requisição",
      });
    }

    const deleteRows = await candidatos.destroy({
      where: { id: id },
    });

    if (deleteRows > 0) {
      res.status(200).json({ message: "Deletado com sucesso!" });
    } else {
      res.status(404).json({
        error: `O candidato com id ${id} não encontrada para exclusão!`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao tentar a conexão com o banco!" });
  }
};
