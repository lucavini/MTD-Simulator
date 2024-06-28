/* eslint-disable no-console */
import { exec } from 'child_process';
import * as path from 'path';

const vmID = 2;
const scriptPath = path.resolve(__dirname, './createVM.sh');

exec(`sh ${scriptPath} ${vmID}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o script: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Erro no script: ${stderr}`);
    return;
  }

  // Exibe a saída do script
  console.log(`Saída do script: ${stdout}`);
});
