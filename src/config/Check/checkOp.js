const cron = require("node-cron");
const { operacoes } = require("../../models");
const { isBefore } = require("date-fns");

// Função para verificar e atualizar o status das operações
const verificarOperacoesAtrasadas = async () => {
  try {
    const oper = await operacoes.findAll({
      where: {
        status: ["Aberto", "Andamento"], // Verifica apenas operações que ainda não foram finalizadas
      },
    });

    const currentDate = new Date();

    for (const operacao of oper) {
      if (!operacao.closingDate && isBefore(operacao.endDate, currentDate)) {
        operacao.status = "Atrasado";
        await operacao.save();
      }
    }

    console.log("Verificação diária de operações concluída.");
  } catch (error) {
    console.error("Erro ao verificar operações atrasadas:", error);
  }
};

// Agendar a tarefa para rodar diariamente às 00:00
cron.schedule("0 0 * * 1-6", () => {
  console.log("Executando tarefa diária de verificação de operações.");
  verificarOperacoesAtrasadas();
});
