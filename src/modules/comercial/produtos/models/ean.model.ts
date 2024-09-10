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

const obterTipoEan = (ean: any, quantidadeEmbalagem: number) => {
  return {
    id: ean.id,
    codigo: ean.codigo,
    quantidade: ean.codigo.length <= ETamanho.EAN ? 1 : quantidadeEmbalagem,
    tipo: ean.codigo.length <= ETamanho.EAN ? EMedidas.UNIDADE : EMedidas.CAIXA,
  };
};

const preencherZeroEsquerda = (codigo: string, tamanho: number) => {
  if (codigo.length < tamanho) {
    return codigo.padStart(tamanho, '0');
  }
  return codigo;
};

export default { obterTipoEan, preencherZeroEsquerda };
