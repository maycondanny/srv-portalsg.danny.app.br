import _ from 'lodash';
import eanModel, { Ean, EMedidas, EPrincipal, ETamanho } from './ean.model';
import { REGEX_NAO_NUMERICOS } from '@utils/regex.util';
import stringUtil from '@utils/string.util';
import Ecommerce from './ecommerce.model';
import numberUtil from '@utils/number.util';
import Divergencia from './divergencia.model';
import ErroException from '@exceptions/erro.exception';

export const TAMANHO_DESCRICAO_ABREVIADA = 30;
export const TAMANHO_DESCRICAO_CLASSIFICACAO = 128;

export const CODIGO_REFERENCIA_FORNECEDOR_CACHE = 'CPF_CIPF';

const ORIGEM_IMPORTACAO_DIRETA = 'ESTRANGEIRA_IMPORTACAO_DIRETA';
const ORIGEM_MERCADO_INTERNO = 'ESTRANGEIRA_MERCADO_INTERNO';

export const CODIGOS_PIS_COFINS = {
  I: 'ISENTO',
  N: "NÃO INCIDE",
  S: "SUSPENSO",
  M: "MONOFÁSICO",
  B: "SUBSTITUIDO",
  O: "ALIQUOTA 0",
  T: "TRIBUTADO"
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
  marca?: number;
  depto?: number;
  secao?: number;
  grupo?: number;
  subgrupo?: number;
  classificacao_fiscal: string;
  origem: string;
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
  tipo_tributacao?: string;
  estado: number;
  fornecedor_id: number;
  status?: number;
  divergencias?: Divergencia[];
  eans: Ean[];
  duns: Ean[];
  ecommerce?: Ecommerce;
  produto_arius?: number;
  cadastro_arius?: Date;
  comprador?: number;
  categoria_fiscal?: string;
  familia?: number;
  created_at?: Date;
}

function formatarDescritivo(produto: Produto): Produto {
  produto.descritivo = stringUtil.cortar(produto.descritivo, TAMANHO_DESCRICAO_CLASSIFICACAO);
  produto.descritivo_pdv = stringUtil.cortar(produto.descritivo_pdv, TAMANHO_DESCRICAO_ABREVIADA);
  return produto;
}

function juntarEansDuns(eans: Ean[], duns: Ean[], quantidadeCaixa: number) {
  eans = _.map(eans, ean => ({
    ...ean,
    principal: EPrincipal.SIM,
    codigo: eanModel.obterCodigoComZeroEsquerda(ean, ETamanho.EAN),
    quantidade: 1,
    tipo: EMedidas.UNIDADE,
  }));
  duns = _.map(duns, (dun) => ({
    ...dun,
    codigo: eanModel.obterCodigoComZeroEsquerda(dun, ETamanho.DUN),
    quantidade: quantidadeCaixa,
    tipo: EMedidas.CAIXA,
  }));
  return _.concat(eans, duns);
}

function obterEans(eans: Ean[]) {
  return _.filter(eans, ean => ean.tipo === EMedidas.UNIDADE);
}

function obterDuns(eans: Ean[]) {
  return _.filter(eans, ean => ean.tipo === EMedidas.CAIXA);
}

function possuiDivergencias(produto: Produto) {
  return numberUtil.isMaiorZero(produto.divergencias?.length);
}

function ehTipoCaixa(produto: Produto): boolean {
  return produto.qtde_embalagem > 0;
}

function obterQuantidadeEmbalagem(produto: Produto) {
  return ehTipoCaixa(produto) ? produto?.qtde_embalagem : 1;
}

function obterTipoEmbalagem(produto: Produto) {
  return ehTipoCaixa(produto) ? EMedidas.CAIXA : EMedidas.UNIDADE;
}

function limparNCM(ncm: string): string {
  return ncm?.trim()?.replace(REGEX_NAO_NUMERICOS, '');
}

function obterCodigosEans(eans: Ean[]): string[] {
  return _.map(eans, ean => ean.codigo);
}

function obterOrigem(origem: string) {
  return origem === "0" ? ORIGEM_IMPORTACAO_DIRETA : ORIGEM_MERCADO_INTERNO;
}

function obterTipoTributacao(cst: string): string {
  if (!cst) return;
  switch (cst?.substring(1, 3)) {
    case '00':
      return 'T';
    case '10':
    case '60':
    case '30':
    case '70':
    case '02':
    case '15':
    case '53':
    case '61':
      return 'F';
    case '20':
      return 'R';
    case '40':
      return 'I';
    case '41':
      return 'N';
    case '50':
      return 'S';
    case '51':
      return 'D';
    case '90':
      return 'O';
    default:
      throw new ErroException('Tipo da situação tributária não encontrada');
  }
}

export default {
  juntarEansDuns,
  possuiDivergencias,
  formatarDescritivo,
  obterQuantidadeEmbalagem,
  obterTipoEmbalagem,
  limparNCM,
  obterCodigosEans,
  obterEans,
  obterDuns,
  obterTipoTributacao,
  obterOrigem
};
