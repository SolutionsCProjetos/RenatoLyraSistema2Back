const cron = require("node-cron");
const { contasapagar } = require("../../models");
const { isBefore } = require("date-fns");

const verificarContasAtrasadas = async () => {
    try {
        const pagar = await contasapagar.findAll({
          where: {
            situacao: ["Aberta", "Pago parcial"],
          },
        });

        const currentDate = new Date();

        for (const contaspg of pagar) {
            if (contaspg.vencimento && isBefore(contaspg.vencimento, currentDate)) {
                contaspg.situacao = "Atrasado";
                await contaspg.save();
            }
        };

        console.log("Verificação diária dos contas a pagar concluída.");
    } catch (error) {
        console.error("Erro ao verificar contas a pagar atrasadas:", error);
    };
};

cron.schedule("59 10 * * 1-5", () => {
  console.log("Executando tarefa diária de verificação dos contas a pagar.");
  verificarContasAtrasadas();
});