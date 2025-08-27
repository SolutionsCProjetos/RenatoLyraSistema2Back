const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

let qrCodeData = null;

// Inicializar o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Evento para gerar o QR Code
client.on("qr", async (qr) => {
    console.log("Evento de QR Code recebido.");
    qrCodeData = await qrcode.toDataURL(qr);
});

// Evento para autenticação bem-sucedida
client.on("authenticated", () => {
    console.log("Cliente autenticado com sucesso!");
});

// Evento para falha na autenticação
client.on("auth_failure", (msg) => {
    console.error("Falha na autenticação:", msg);
});

// Evento para indicar que o cliente está pronto
client.on("ready", () => {
    console.log("Cliente conectado. QR Code não será exibido.");
    qrCodeData = null; // Resetar QR Code
});


// Evento para erros gerais
client.on("disconnected", (reason) => {
    console.log("Cliente desconectado. Motivo:", reason);
});

// Função para retornar o QR Code
const getQRCode = () => {
    return qrCodeData;
};

console.log("Inicializando cliente...");
client.initialize();

module.exports = {
    client,
    getQRCode,
};




/* 
// Endpoint para buscar o QR Code
app.get("/qrcode", (req, res) => {
  const qrCode = getQRCode();
  if (qrCode) {
      res.json({ qr: qrCode });
  } else {
      res.status(200).json({ message: "Cliente já conectado ou QR Code não disponível." });
  }
});
// Rota para verificar o estado da conexão
app.get("/status", (req, res) => {
  const isConnected = client.info ? "Conectado" : "Desconectado";
  console.log("Client status1:", client ? "Disponível" : "Indisponível");
  res.json({ status: isConnected });
});
app.post("/send-test", async (req, res) => {
  // Verificar se o cliente está inicializado e pronto
  if (!client || !client.info) {
    return res.status(500).json({ error: "Cliente do WhatsApp não está pronto. Tente novamente mais tarde." });
  }

  // Capturar os dados do frontend
  const { phone, message } = req.body; // Número de telefone e mensagem enviados no body da requisição

  // Validação básica
  if (!phone || !message) {
    return res.status(400).json({ error: "Número de telefone e mensagem são obrigatórios." });
  }

  try {
    // Formatar o número de telefone no formato aceito pelo WhatsApp
    const chatId = `${phone}@c.us`;

    // Enviar mensagem
    await client.sendMessage(chatId, message);

    console.log(`Mensagem enviada para ${phone}`);
    res.json({ success: true, message: `Mensagem enviada com sucesso para ${phone}` });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem", details: error.message });
  }
});

*/