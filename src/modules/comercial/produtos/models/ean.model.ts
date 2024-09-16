import _ from 'lodash';

export enum ETamanho {
  EAN = 13,
  DUN = 14,
}

export enum EMedidas {
  CAIXA = 'CX',
  UNIDADE = 'UN',
}

export enum EPrincipal {
  SIM = 'T',
  NAO = 'F',
}

export interface Ean {
  id?: number;
  codigo: string;
  quantidade?: number;
  produto_id?: number;
  tipo?: string;
  principal?: string;
  created_at?: Date;
  updated_at?: Date;
}

function obterTipoEan(ean: any, quantidadeEmbalagem: number) {
  return {
    id: ean.id,
    codigo: ean.codigo,
    quantidade: ean.codigo.length <= ETamanho.EAN ? 1 : quantidadeEmbalagem,
    tipo: ean.codigo.length <= ETamanho.EAN ? EMedidas.UNIDADE : EMedidas.CAIXA,
  };
}

function obterCodigoComZeroEsquerda(ean: Ean, tamanho: ETamanho): string {
  if (tamanho === ETamanho.EAN) {
    return ean.codigo.padStart(ETamanho.EAN, '0');
  }
  return ean.codigo.padStart(ETamanho.DUN, '0');
}

function isDun(ean: Ean): boolean {
  return ean.tipo === EMedidas.CAIXA;
}

function isEan(ean: Ean): boolean {
  return ean.tipo === EMedidas.UNIDADE;
}

export default { obterTipoEan, obterCodigoComZeroEsquerda, isEan, isDun };
