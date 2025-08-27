const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const routes = require("./routes");
const OperacoesAtrasadas = require("./config/Check/checkOp");
//const { getQRCode, client } = require("./config/whatsCode");


const contasAtrasadas = require("./config/Check/checkCon"); 
const receberAtrasadas = require("./config/Check/checkRec"); 
const MultaJuros = require("./config/Check/checkMultJurs")
//const { verificarContasReceber } = require("./config/Check/envioEmail")

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", // Permite todas as origens
    credentials: true, // Permite envio de cookies e credenciais
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware para lidar com requisições OPTIONS (preflight)
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas da aplicação
app.use("/", routes);

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Iniciar o servidor e conectar ao banco de dados
app.listen(PORT, "0.0.0.0", async () => {
  try {
    // Sincroniza com o banco de dados
    await sequelize.authenticate();
   // verificarContasReceber();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
});
