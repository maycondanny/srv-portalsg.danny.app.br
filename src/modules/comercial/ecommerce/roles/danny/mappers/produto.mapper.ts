import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import ProdutoDTO from '../dtos/produto.dto';

function toDTO(produto: Produto): ProdutoDTO {
  return {
    id: produto.id,
    caracteristica: produto.caracteristica,
    descricao: produto.descricao,
    imagens: produto.imagens,
    eans: produto.eans,
    modo_uso: produto.modo_uso,
    nome: produto.nome,
    dataCadastro: produto.created_at,
    status: produto.status,
    fornecedor_id: produto.fornecedor_id,
  };
}

function toProduto(produtoDTO: ProdutoDTO): Produto {
  return {
    id: produtoDTO.id,
    caracteristica: produtoDTO.caracteristica,
    descricao: produtoDTO.descricao,
    imagens: produtoDTO.imagens,
    eans: produtoDTO.eans,
    modo_uso: produtoDTO.modo_uso,
    nome: produtoDTO.nome,
    created_at: produtoDTO.dataCadastro,
    status: produtoDTO.status,
    fornecedor_id: produtoDTO.fornecedor_id,
    marca: produtoDTO.marca,
    depto: produtoDTO.depto,
    secao: produtoDTO.secao,
    ativo: produtoDTO.ativo,
    lancamento: produtoDTO.lancamento,
    destaque: produtoDTO.destaque,
  };
}

export default {
  toDTO,
  toProduto,
};
