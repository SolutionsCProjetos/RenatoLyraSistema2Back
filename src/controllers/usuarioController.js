const bcrypt = require("bcrypt");
const { usuarios, setores } = require("../models");

// Criar Operador
exports.createUser = async (req, res) => {
  const { nome, senha, email, empresa, rule, setorId } = req.body;

  // Validação básica dos campos no backend
  if (!nome || !senha || !email || !setorId) {
    return res
      .status(400)
      .json({ error: "Todos os campos são obrigatórios, incluindo o setor." });
  }

  // Obter o usuário autenticado a partir do middleware
  const loggedUser = req.loggedUser;

  if (!loggedUser) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  if (req.loggedUser.rule !== 1) {
    return res.status(403).json({
      message:
        "Permissão negada. Apenas administradores podem cadastrar um Operador.",
    });
  }

  try {
    // Verificar se o e-mail já está em uso
    const existingUser = await usuarios.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "E-mail já está em uso." });
    }

    // Verificar se o usuário autenticado é administrador e deseja criar um administrador
    if (loggedUser.rule !== 1) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para criar um administrador." });
    }

    // Se o usuário autenticado não for administrador, forçar o rule para 0
    const userRule = loggedUser.rule === 1 ? rule : 0;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const usuario = await usuarios.create({
      nome,
      senha: hashedPassword,
      email,
      empresa: empresa || null,
      rule: userRule,
      setorId, // Adicionando setorId aqui
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error("Erro ao criar o Operador:", error);
    res.status(500).json({ message: "Erro ao criar o Operador." });
  }
};

// Listar Todos os Operadors
exports.getUsers = async (req, res) => {
  try {
    const usuario = await usuarios.findAll({
      order: [["nome", "ASC"]],
      attributes: ["id", "nome", "email"],
      include: [
        {
          model: setores,
          as: "setor",
          attributes: ["setor"],
        },
      ],
    });
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao listar os Operadores." });
  }
};

// Obter Operador por ID
exports.getUserById = async (req, res) => {
  try {
    // Obter o usuário autenticado a partir do middleware
    const loggedUser = req.loggedUser;
    const { id } = req.params;

    // Buscar o usuário pelo ID
    const usuario = await usuarios.findByPk(id, {
      attributes: ["id", "nome", "email", "empresa", "rule"],
      include: [
        {
          model: setores,
          as: "setor",
          attributes: ["setor"],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Operador não encontrado." });
    }

    // Verificar se o usuário autenticado é administrador ou o próprio usuário
    if (loggedUser.rule !== 1 && loggedUser.id !== usuario.id) {
      return res.status(403).json({
        message: "Você não tem permissão para visualizar outro operador.",
      });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter o Operador." });
  }
};

// Atualizar Operador
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, senha, email, empresa, rule, setorId } = req.body; // Inclui setorId aqui para considerar a atualização
    const usuario = await usuarios.findByPk(id);

    const loggedUser = req.loggedUser;

    // Verificar se o usuário existe
    if (!usuario) {
      return res.status(404).json({ message: "Operador não encontrado." });
    }

    // Verificar se o usuário autenticado é administrador ou o próprio usuário
    if (loggedUser.rule !== 1 && loggedUser.id !== usuario.id) {
      return res.status(403).json({
        message: "Você não tem permissão para atualizar este operador.",
      });
    }

    // Apenas administradores podem alterar o setorId e rule
    if (loggedUser.rule === 1) {
      usuario.setorId = setorId || usuario.setorId;
      usuario.rule = rule || usuario.rule;
    }

    // Atualizar os outros campos
    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    usuario.empresa = empresa || usuario.empresa;

    await usuario.save();
    res.status(200).json({ message: "Operador atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar o Operador:", error);
    res.status(500).json({ message: "Erro ao atualizar o Operador." });
  }
};

// Deletar Operador
exports.deleteUser = async (req, res) => {
  try {
    if (req.loggedUser.rule !== 1) {
      return res.status(403).json({
        message:
          "Permissão negada. Apenas administradores podem deletar o Operador.",
      });
    }
    const { id } = req.params;
    const usuario = await usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Operador não encontrado." });
    }
    await usuario.destroy();
    res.status(200).json({ message: "Operador deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar o Operador:", error); // Logging do erro
    res.status(500).json({ message: "Erro ao deletar o Operador." });
  }
};

/* // Administrador pode alterar a senha e o rule
    if (loggedUser.rule === 1) {
      if (senha) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(senha, salt);
      }
      usuario.rule = rule || usuario.rule; // Administrador pode alterar o rule
    } else {
      // Usuário padrão só pode alterar a própria senha
      if (loggedUser.id === usuario.id) {
        if (senha) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(senha, salt);
        }
      } else {
        return res.status(403).json({
          message:
            "Você não tem permissão para alterar a senha de outro usuário.",
        });
      }
    } */
