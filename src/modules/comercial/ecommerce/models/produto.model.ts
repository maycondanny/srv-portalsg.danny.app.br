import numberUtil from '@utils/number.util';
import { Ean } from './ean.model';
import Imagem from './imagem.model';
import { Divergencia } from './divergencia.model';

export enum EStatus {
  NAO_CADASTRADO = 1,
  APROVADO = 2,
  CADASTRADO = 3,
  NOVO = 4,
}

export interface Produto {
  id?: number;
  produto_id?: number;
  produto_arius?: number;
  nome: string;
  marca?: number;
  depto?: number;
  secao?: number;
  modo_uso: string;
  descricao: string;
  caracteristica: string;
  destaque?: boolean;
  lancamento?: boolean;
  ativo?: boolean;
  status?: number;
  fornecedor_id: number;
  eans: Ean[];
  imagens: Imagem[];
  created_at?: Date;
  divergencias?: Divergencia[];
}

function possuiDivergencias(produto: Produto): boolean {
  return produto.divergencias && numberUtil.isMaiorZero(produto.divergencias.length);
}

function possuiImagens(produto: Produto): boolean {
  return produto.imagens && numberUtil.isMaiorZero(produto.imagens.length);
}

function obterUrlPlataforma(valor: string) {
  if (!valor) return;
  return valor
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-');
}

export default {
  possuiDivergencias,
  possuiImagens,
  obterUrlPlataforma
};
