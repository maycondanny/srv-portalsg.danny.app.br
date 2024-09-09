import _ from 'lodash';
import { EMedidas } from './produto.model';

export enum ETamanho {
  EAN = 13,
  DUN = 14,
}

export enum EPrincipal {
  SIM = "T",
  NAO = "F"
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
    codigo_ean: ean.codigo_ean,
    quantidade: ean.codigo_ean.length <= ETamanho.EAN ? 1 : quantidadeEmbalagem,
    tipo: ean.codigo_ean.length <= ETamanho.EAN ? EMedidas.UNIDADE : EMedidas.CAIXA,
  };
};

const preencherZeroEsquerda = (codigo: string, tamanho: number) => {
  if (codigo.length < tamanho) {
    return codigo.padStart(tamanho, '0');
  }
  return codigo;
};

export default { obterTipoEan, preencherZeroEsquerda };
