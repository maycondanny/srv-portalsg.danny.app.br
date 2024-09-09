import _ from 'lodash';
import eanModel, { Ean, EPrincipal, ETamanho } from './ean.model';
import { Imagem } from './imagem.model';
import { REGEX_APENAS_NUMEROS } from '@utils/regex.util';
import stringUtil from '@utils/string.util';

export const CODIGO_REFERENCIA_FORNECEDOR_CACHE = 'CPF_CIPF';

export const DEPTO_CLASSIFICAR = 80;
export const GRUPO_CLASSIFICAR = 1;
export const SUBGRUPO_CLASSIFICAR = 1;
export const SECAO_CLASSIFICAR = 1;

export enum EMedidas {
  CAIXA = 'CX',
  UNIDADE = 'UN',
}

const ORIGEM_IMPORTACAO_DIRETA = 'ESTRANGEIRA_IMPORTACAO_DIRETA';
const ORIGEM_MERCADO_INTERNO = 'ESTRANGEIRA_MERCADO_INTERNO';

export const TAMANHO_DESCRICAO_ABREVIADA = 30;
export const TAMANHO_DESCRICAO_CLASSIFICACAO = 128;

export const CODIGOS_PIS_COFINS = {
  I: 'ISENTO',
  N: 'NÃO INCIDE',
  S: 'SUSPENSO',
  M: 'MONOFÁSICO',
  F: 'SUBSTITUIDO',
  G: 'ALIQUOTA 0',
  T: 'TRIBUTADO',
};

export enum ERole {
  CADASTRO = 'cadastro',
  FISCAL = 'fiscal',
  ECOMMERCE = 'ecommerce',
}

export enum ECadastroStatus {
  NOVO = 1,
  APROVADO = 2,
  CADASTRADO = 3,
}

export enum EFiscalStatus {
  NOVO = 5,
  APROVADO = 6,
  CADASTRADO = 7,
}

export interface Produto {
  id?: number;
  codigo_produto_fornecedor?: string;
  descritivo: string;
  descritivo_pdv: string;
  descricao: string;
  caracteristica: string;
  modo_uso: string;
  marca?: number;
  depto?: number;
  secao?: number;
  grupo?: number;
  subgrupo?: number;
  classificacao_fiscal: string;
  origem: number;
  pesol: number;
  pesob: number;
  validade: number;
  comprimento: number;
  largura: number;
  altura: number;
  qtde_embalagem: number;
  comprimento_d?: number;
  largura_d?: number;
  altura_d?: number;
  ipi: number;
  pis_cofins: string;
  preco: number;
  desconto_p: number;
  st_compra: string;
  icms_compra: number;
  estado: number;
  fornecedor_id: number;
  status?: number;
  divergencias?: any[];
  eans: Ean[];
  imagens: Imagem[];
}

function possuiDivergencias(produto: Produto) {
  return produto?.divergencias?.length > 0;
}

function formatarTexto(produto: Produto): Produto {
  produto.descritivo = stringUtil.cortar(produto.descritivo, TAMANHO_DESCRICAO_CLASSIFICACAO);
  produto.descritivo_pdv = stringUtil.cortar(produto.descritivo_pdv, TAMANHO_DESCRICAO_ABREVIADA);
  produto.codigo_produto_fornecedor = produto.codigo_produto_fornecedor?.toLocaleUpperCase();
  produto.descritivo_pdv = produto.descritivo_pdv?.toLocaleUpperCase();
  produto.descritivo = produto.descritivo?.toLocaleUpperCase();
  return produto;
}

function tratarEansDuns(eans: Ean[], duns: Ean[], quantidadeCaixa: number) {
  eans = _.map(eans, (ean, index) => ({
    ...ean,
    principal: index === 0 ? EPrincipal.SIM : EPrincipal.NAO,
    codigo: eanModel.preencherZeroEsquerda(ean.codigo, ETamanho.EAN),
    quantidade: 1,
    tipo: EMedidas.UNIDADE,
  }));
  duns = _.map(duns, dun => ({
    ...dun,
    codigo: eanModel.preencherZeroEsquerda(dun.codigo, ETamanho.DUN),
    quantidade: quantidadeCaixa,
    tipo: EMedidas.CAIXA,
  }));
  return _.concat(eans, duns);
}

function ehTipoCaixa(produto: Produto): boolean {
  return produto.qtde_embalagem > 0;
}

function obterOrigem(produto: Produto) {
  return produto.origem === 0 ? ORIGEM_IMPORTACAO_DIRETA : ORIGEM_MERCADO_INTERNO;
}

function obterQuantidadeEmbalagem(produto: Produto) {
  return ehTipoCaixa(produto) ? produto?.qtde_embalagem : 1;
}

function obterTipoEmbalagem(produto: Produto) {
  return ehTipoCaixa(produto) ? EMedidas.CAIXA : EMedidas.UNIDADE;
}

function limparNCM(ncm: string): string {
  return ncm?.trim()?.replace(REGEX_APENAS_NUMEROS, '');
}

export default {
  tratarEansDuns,
  possuiDivergencias,
  formatarTexto,
  obterQuantidadeEmbalagem,
  obterTipoEmbalagem,
  obterOrigem,
  limparNCM
};
