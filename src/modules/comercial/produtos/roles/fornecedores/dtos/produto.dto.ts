import { ESiglaEstado } from '@models/sigla-estado.model';
import { Ean } from '@modules/comercial/produtos/models/ean.model';
import { Imagem } from '@modules/comercial/produtos/models/imagem.model';
import numberUtil from '@utils/number.util';
import _ from 'lodash';

export interface ProdutoDTO {
  codigo_produto_fornecedor: string;
  descritivo_pdv: string;
  descritivo: string;
  origem: number;
  estado: ESiglaEstado;
  preco: number;
  desconto_p: number;
  eans: Ean[];
  duns: Ean[];
  pesob: number;
  pesol: number;
  altura: number;
  largura: number;
  comprimento: number;
  validade: number;
  qtde_embalagem: number;
  comprimento_d: number;
  largura_d: number;
  altura_d: number;
  classificacao_fiscal: string;
  st_compra: string;
  icms_compra: number;
  ipi: number;
  pis_cofins: string;
  descricao: string;
  caracteristica: string;
  modo_uso: string;
  imagens: Imagem[];
  fornecedor_id: number;
}

function validarPossuiEan(produtoDTO: ProdutoDTO) {
  if (!_.isArray(produtoDTO.eans)) {
    return false;
  }

  if (numberUtil.isMenorOuIgualZero(produtoDTO.eans.length)) {
    return false;
  }

  return produtoDTO.eans.every((ean) => typeof ean.codigo === 'string' && ean.codigo.trim() !== '');
}

export default {
  validarPossuiEan,
};
