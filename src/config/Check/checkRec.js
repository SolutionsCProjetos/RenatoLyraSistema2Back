const cron = require("node-cron");
const { contasreceber } = require("../../models");
const { isBefore, differenceInDays, differenceInMonths } = require("date-fns");

const verificarReceberAtrasados = async () => {
  try {
    const receber = await contasreceber.findAll({
      where: {
        status: ["Aberto", "Parcial"],
      },
    });

    const currentDate = new Date();

    for (const conta of receber) {
      if (conta.vencimento && isBefore(conta.vencimento, currentDate)) {
        conta.status = "Atrasado";
        await conta.save();
      }
    }

    console.log("Verificação diária dos contas a receber concluída.");
  } catch (error) {
    console.error("Erro ao verificar contas a receber atrasadas:", error);
  }
};

// Agendamento das tarefas
cron.schedule("0 0 * * 1-6", () => {
  console.log("Executando tarefa diária de verificação dos contas a receber.");
  verificarReceberAtrasados();
});
