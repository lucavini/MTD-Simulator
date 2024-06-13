/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const fs = require('fs');
const path = require('path');

// Caminho do arquivo
const filePath = path.join(__dirname, 'data', 'text.txt');

// Função para garantir que o diretório exista
function ensureDirectoryExistence(filepath: String) {
  const dirname = path.dirname(filepath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Função para escrever no arquivo
function writeLine(number: Number) {
  const line = `teste ${number}\n`;
  fs.appendFile(filePath, line, (err: Error) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log(`Line ${number} written successfully!`);
  });
}

// Função para obter o último número do arquivo
function getLastNumber(callback: (lastNumber: number) => void) {
  fs.readFile(filePath, 'utf8', (err: any, data: string) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Arquivo não existe, começamos com 1
        callback(0);
      } else {
        console.error('Error reading the file:', err);
        callback(0);
      }
      return;
    }

    const lines = data.split('\n').filter((line) => line.trim() !== '');
    const lastLine = lines.pop();
    // eslint-disable-next-line radix
    const lastNumber = lastLine ? parseInt(lastLine.split(' ')[1]) : 0;
    callback(lastNumber);
  });
}

// Garante que o diretório existe
ensureDirectoryExistence(filePath);

// Inicia a contagem após obter o último número
const callback = (lastNumber: number) => {
  let counter = lastNumber + 1;

  // Escreve a cada segundo
  setInterval(() => {
    writeLine(counter);
    counter++;
  }, 1000);
};

getLastNumber(callback);
