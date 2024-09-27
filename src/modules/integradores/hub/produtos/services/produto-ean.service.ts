import hubUtil from '@utils/hub.util';
import numberUtil from '@utils/number.util';

async function obterPorCodigos(codigos: string[]): Promise<any[]> {
  if (numberUtil.isMenorOuIgualZero(codigos.length)) throw new Error('Códigos EANs não informados');
  const URL = '/product_codes/barcode';
  const resultado = await hubUtil.post(URL, { barcodes: codigos });
  return resultado;
}

export default {
  obterPorCodigos,
};
