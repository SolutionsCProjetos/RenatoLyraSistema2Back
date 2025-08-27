const fs = require("fs");
const path = require("path");
const { sequelize } = require("./src/models/index"); // Ajuste o caminho conforme necessário
const archiver = require("archiver");
require("dotenv").config(); // Carrega variáveis de ambiente

// Função para formatar a data no formato dd-MM-yyyy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

async function exportData() {
  const date = new Date();
  const dateFolder = formatDate(date);

  // Caminho do diretório de backup e arquivos de backup
  const backupDir = path.join("C:", "Softcom", "Backup", "Backups", dateFolder);
  const jsonFilePath = path.join(backupDir, `backup_${dateFolder}.json`);
  const sqlFilePath = path.join(backupDir, `backup_${dateFolder}.sql`);
  const zipFilePath = path.join(
    "C:",
    "Softcom",
    "Backup",
    "Backups",
    `backup_${dateFolder}.zip`
  );

  // Cria o diretório de backup se não existir
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    // Exporte os dados das tabelas
    const tables = [
      "contasapagar",
      "contasreceber",
      "formapagamento",
      "melhoria",
      "operacoes",
      "sequelizemeta",
      "setores",
      "tokensenha",
      "usuarios",
    ]; // Adicione suas tabelas aqui
    const data = {};
    let sqlData = "";

    for (const table of tables) {
      const rows = await sequelize.query(`SELECT * FROM ${table}`, {
        type: sequelize.QueryTypes.SELECT,
      });
      data[table] = rows;

      // Geração de comandos INSERT para o backup SQL
      rows.forEach((row) => {
        const columns = Object.keys(row)
          .map((col) => `\`${col}\``)
          .join(", ");
        const values = Object.values(row)
          .map((val) =>
            typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
          )
          .join(", ");
        sqlData += `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
      });
    }

    // Escreva os dados em JSON
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    console.log(`Backup gerado com sucesso! Arquivo JSON: ${jsonFilePath}`);

    // Escreva os comandos SQL no arquivo
    fs.writeFileSync(sqlFilePath, sqlData);
    console.log(`Backup gerado com sucesso! Arquivo SQL: ${sqlFilePath}`);

    // Compactar os arquivos JSON e SQL em um ZIP
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Nível de compressão
    });

    output.on("close", () => {
      console.log(`Backup compactado com sucesso! Arquivo ZIP: ${zipFilePath}`);

      // Remove os arquivos JSON e SQL após a compactação
      fs.unlinkSync(jsonFilePath);
      fs.unlinkSync(sqlFilePath);
      console.log(`Arquivos removidos: ${jsonFilePath}, ${sqlFilePath}`);
    });

    archive.on("error", (err) => {
      console.error(`Erro ao compactar o arquivo: ${err.message}`);
    });

    archive.pipe(output);
    archive.file(jsonFilePath, { name: path.basename(jsonFilePath) });
    archive.file(sqlFilePath, { name: path.basename(sqlFilePath) });
    archive.finalize();
  } catch (err) {
    console.error(`Erro ao gerar o backup: ${err.message}`);
  }
}

exportData();
