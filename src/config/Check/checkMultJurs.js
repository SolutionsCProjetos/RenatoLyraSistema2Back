const cron = require("node-cron");
const { contasreceber } = require("../../models");
const { isBefore, differenceInDays, differenceInMonths } = require("date-fns");

const JurosEmultas = async () => {
  try {
    const receber = await contasreceber.findAll({
      where: { status: "Atrasado" },
    });

    const currentDate = new Date();

    for (const conta of receber) {
      if (!conta.valorReceber || !conta.vencimento) {
        console.log(`Dados incompletos para a conta ${conta.id}`);
        continue; // Pula a iteração se dados essenciais estiverem faltando
      }

      const diasAtraso = differenceInDays(currentDate, conta.vencimento);
      const mesesAtraso = differenceInMonths(currentDate, conta.vencimento);

      if (diasAtraso > 0) {
        // Cálculo da multa e juros com arredondamento
        const multa = (conta.valorReceber * 0.02 * mesesAtraso).toFixed(2);
        const juros = (conta.valorReceber * 0.01 * diasAtraso).toFixed(2);

        // Exibir valores no console para depuração
        console.log(`Conta ID: ${conta.id}`);
        console.log(`Dias de atraso: ${diasAtraso}`);
        console.log(`Meses de atraso: ${mesesAtraso}`);
        console.log(`Multa calculada: ${multa}`);
        console.log(`Juros calculado: ${juros}`);

        // Atualiza o valor total
        conta.valorEmAberto =
          parseFloat(conta.valorReceber) +
          parseFloat(multa) +
          parseFloat(juros);
        conta.multa = parseFloat(multa);
        conta.juros = parseFloat(juros);

        await conta.save();
        console.log(`Conta ID: ${conta.id} atualizada com sucesso.`);
      } else {
        console.log(`Conta ID: ${conta.id} sem dias de atraso.`);
      }
    }

    console.log("Cálculo de juros e multas concluído.");
  } catch (err) {
    console.error("Erro ao calcular juros e multas:", err);
  }
};

// Agendamento das tarefas
cron.schedule("2 0 * * 1-6", () => {
  console.log("Executando tarefa diária de verificação dos contas a receber.");
  JurosEmultas();
});
