import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import ProdutoPlanilhaDTO from '../dtos/produto-planilha.dto';
import eanModel, { Ean } from '@modules/comercial/ecommerce/models/ean.model';
import _ from 'lodash';
import Imagem from '@modules/comercial/ecommerce/models/imagem.model';

function toProduto(fornecedorId: number, produtoPlanilhaDTO: ProdutoPlanilhaDTO): Produto {
  return {
    nome: produtoPlanilhaDTO.nome,
    modo_uso: produtoPlanilhaDTO.modo_uso,
    descricao: produtoPlanilhaDTO.descricao,
    caracteristica: produtoPlanilhaDTO.caracteristica,
    fornecedor_id: fornecedorId,
    eans: obterEans(produtoPlanilhaDTO),
    imagens: obterImagens(produtoPlanilhaDTO),
    status: produtoPlanilhaDTO.status
  };
}

function obterEans(produtoPlanilhaDTO: ProdutoPlanilhaDTO): Ean[] {
  return _.map(produtoPlanilhaDTO.eans, (codigo) => ({ codigo: eanModel.adicionarZeroEsquerda(codigo) }));
}

function obterImagens(produtoPlanilhaDTO: ProdutoPlanilhaDTO): Imagem[] {
  return _.map(produtoPlanilhaDTO.imagens, (imagem) => ({
    url: imagem,
  }));
}

export default {
  toProduto,
};
