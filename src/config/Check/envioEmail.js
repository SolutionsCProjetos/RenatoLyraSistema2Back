const { contasreceber, cliente } = require("../../models/");
const { differenceInDays } = require("date-fns");
const transportEmail = require("../email");
const cron = require("node-cron");

const enviarEmail = async (to, subject, text) => {
    try {
      await transportEmail.sendMail({ from: process.env.EMAIL, to, subject, text });
      console.log(`E-mail enviado para ${to}: ${subject}`);
    } catch (err) {
      console.error(`Erro ao enviar e-mail para ${to}:`, err.message);
    }
  };
  
  // Função para verificar contas a receber e enviar e-mails
  const verificarContasReceber = async () => {
    try {
      const hoje = new Date();
  
      // Busca todas as contas a receber e os clientes associados
      const contas = await contasreceber.findAll({
        include: [
          {
            model: cliente,
            as: "cliente",
            attributes: ["email", "razaoSocial"],
          },
        ],
        attributes: ["id", "status", "vencimento", "valorReceber"],
      });
  
      for (const conta of contas) {
        const { vencimento, status, valorReceber, cliente: { email, razaoSocial } } = conta;
        if (!vencimento || !email) continue;
        const diasRestantes = differenceInDays(vencimento, hoje);
  
        if (status === "atrasado") {
          // Mensagens para status atrasado
          if (diasRestantes <= -10 && diasRestantes > -15) {
            await enviarEmail(
              email,
              "Aviso: Bloqueio iminente do plano",
              `Prezado(a) ${razaoSocial}, sua conta está atrasada há 10 dias. Caso o pagamento não seja realizado até o 15º dia, o plano será bloqueado.`
            );
          } else if (diasRestantes <= 0 && status != "Fechado") {
            await enviarEmail(
              email,
              "Aviso de atraso",
              `Prezado(a) ${razaoSocial}, sua conta está atrasada. Solicitamos que regularize o pagamento de R$${valorReceber} o quanto antes.`
            );
          }
        } else {
          // Lembretes para contas dentro do prazo
          if (diasRestantes === 5 || diasRestantes === 3 && status != "Fechado") {
            await enviarEmail(
              email,
              "Lembrete de pagamento",
              `Prezado(a) ${razaoSocial}, sua conta de R$${valorReceber} vence em ${diasRestantes} dias. Por favor, não se esqueça de realizar o pagamento.`
            );
          } else if (diasRestantes === 0 && status != "Fechado") {
            await enviarEmail(
              email,
              "Dia de pagamento chegou",
              `Prezado(a) ${razaoSocial}, sua conta de R$${valorReceber} vence hoje. Por favor, efetue o pagamento para evitar atrasos.`
            );
          }
        }
      }
    } catch (err) {
      console.error("Erro ao verificar contas a receber:", err.message);
    }
  };
  
  // Agendar a verificação para rodar diariamente às 8:00 AM
  cron.schedule("0 8 * * *", verificarContasReceber);
  
  module.exports = { verificarContasReceber };