import fs from 'fs/promises';
import path from 'path';

async function obterConteudo(caminho: string, nomeArquivo: string) {
  try {
    const conteudo = await fs.readFile(path.join(caminho, nomeArquivo), 'utf-8');
    return conteudo;
  } catch (erro) {
    throw erro;
  }
}

export default {
  obterConteudo,
};
