import fs from 'fs';
import xlsx from 'xlsx';

function lerDados(planilha: any) {
  try {
    const dados = xlsx.read(planilha, { type: 'buffer' });
    const nomeDaAba = dados.SheetNames[0];
    return xlsx.utils.sheet_to_json(dados.Sheets[nomeDaAba], {
      header: 3,
      range: 4,
      raw: false,
    });
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel ler os dados da planilha.');
  }
}

export default {
  lerDados,
};
