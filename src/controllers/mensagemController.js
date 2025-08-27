const { mensagens } = require('../models');
const { validationResult } = require('express-validation');
const { isValid, format, parseISO } = require('data-fns');

exports.createMensagem = async (req, res) => {
    try {
        const errors = validationResult(req); // Validando os dados da requisição
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let {
            titulo,
            dias_relativos,
            mensagem,
            antes_ou_depois,
            tipo
        } = req.body;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao salvar a mensagem' });
    }
}