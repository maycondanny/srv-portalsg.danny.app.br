export enum ETamanho {
  EAN = 13,
}

export interface Ean {
  id?: number;
  ecommerce_id?: number;
  codigo: string;
}

function adicionarZeroEsquerda(codigo: string): string {
  if (!codigo) return;
  return codigo.padStart(ETamanho.EAN, '0');
}

export default {
  adicionarZeroEsquerda
}
