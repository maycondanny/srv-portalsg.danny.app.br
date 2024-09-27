import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import _ from 'lodash';
import ProdutoDTO from '../dtos/produto.dto';

function toProduto(produtoDTO: ProdutoDTO): Produto {
  return {
    id: produtoDTO.id,
    nome: produtoDTO.nome,
    modo_uso: produtoDTO.modo_uso,
    descricao: produtoDTO.descricao,
    caracteristica: produtoDTO.caracteristica,
    fornecedor_id: produtoDTO.fornecedor_id,
    eans: produtoDTO.eans,
    imagens: produtoDTO.imagens,
    status: produtoDTO.status,
  };
}

function toDTO(produto: Produto): ProdutoDTO {
  return {
    id: produto.id,
    nome: produto.nome,
    modo_uso: produto.modo_uso,
    descricao: produto.descricao,
    caracteristica: produto.caracteristica,
    fornecedor_id: produto.fornecedor_id,
    eans: produto.eans,
    imagens: produto.imagens,
    status: produto.status,
    dataCadastro: produto.created_at
  };
}

export default {
  toDTO,
  toProduto,
};
