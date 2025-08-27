const cron = require("node-cron");
const OperacoesAtrasadas = require("./checkOp");
const ReceberAtrasadas = require("./checkRec");
const PagarAtrasadas = require("./checkCon");

// Função para verificar operações atrasadas
const verificarOperacoesAtrasadas = async () => {
  console.log("Executando verificação de operações atrasadas...");
  await OperacoesAtrasadas();
};

// Função para verificar contas a receber atrasadas
const verificarReceberAtrasadas = async () => {
  console.log("Executando verificação de contas a receber atrasadas...");
  await ReceberAtrasadas();
};

// Função para verificar contas a pagar atrasadas
const verificarPagarAtrasadas = async () => {
  console.log("Executando verificação de contas a pagar atrasadas...");
  await PagarAtrasadas();
};

// Agendando as verificações
cron.schedule("16 0 * * 1-5", verificarOperacoesAtrasadas);
cron.schedule("16 0 * * 1-5", verificarReceberAtrasadas);
cron.schedule("16 0 * * 1-5", verificarPagarAtrasadas);

console.log("Tarefas agendadas para verificação diária.");
