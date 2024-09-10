import produtoModel, { Produto } from '@modules/comercial/produtos/models/produto.model';
import _ from 'lodash';
import { ProdutoDTO } from '../dtos/produto.dto';
import { EMedidas } from '@modules/comercial/produtos/models/ean.model';

function toProduto(dto: ProdutoDTO): Produto {
  const produto: Produto = {
    codigo_produto_fornecedor: dto.codigo_produto_fornecedor,
    descritivo_pdv: dto.descritivo_pdv,
    descritivo: dto.descritivo,
    origem: dto.origem,
    estado: dto.estado,
    preco: dto.preco,
    desconto_p: dto.desconto_p,
    eans: produtoModel.juntarEansDuns(dto.eans, dto.duns, dto.qtde_embalagem),
    pesob: dto.pesob,
    pesol: dto.pesol,
    altura: dto.altura,
    largura: dto.largura,
    comprimento: dto.comprimento,
    validade: dto.validade,
    qtde_embalagem: dto.qtde_embalagem,
    comprimento_d: dto.comprimento_d,
    largura_d: dto.largura_d,
    altura_d: dto.altura_d,
    classificacao_fiscal: produtoModel.limparNCM(dto.classificacao_fiscal),
    st_compra: dto.st_compra,
    icms_compra: dto.icms_compra,
    ipi: dto.ipi,
    pis_cofins: dto.pis_cofins,
    fornecedor_id: dto.fornecedor_id,
    ecommerce: {
      caracteristica: dto.caracteristica,
      descricao: dto.descricao,
      modo_uso: dto.modo_uso,
      imagens: dto.imagens
    }
  };

  produtoModel.formatarTexto(produto);

  return produto;
}

function toDTO(produto: Produto): ProdutoDTO {
  return {
    id: produto.id,
    codigo_produto_fornecedor: produto.codigo_produto_fornecedor,
    descritivo_pdv: produto.descritivo_pdv,
    descritivo: produto.descritivo,
    origem: produto.origem,
    estado: produto.estado,
    preco: produto.preco,
    desconto_p: produto.desconto_p,
    eans: produtoModel.obterEans(produto),
    duns: produtoModel.obterDuns(produto),
    pesob: produto.pesob,
    pesol: produto.pesol,
    altura: produto.altura,
    largura: produto.largura,
    comprimento: produto.comprimento,
    validade: produto.validade,
    qtde_embalagem: produto.qtde_embalagem,
    comprimento_d: produto.comprimento_d,
    largura_d: produto.largura_d,
    altura_d: produto.altura_d,
    classificacao_fiscal: produtoModel.limparNCM(produto.classificacao_fiscal),
    st_compra: produto.st_compra,
    icms_compra: produto.icms_compra,
    ipi: produto.ipi,
    pis_cofins: produto.pis_cofins,
    descricao: produto.ecommerce.descricao,
    caracteristica: produto.ecommerce.caracteristica,
    modo_uso: produto.ecommerce.modo_uso,
    imagens: produto.ecommerce.imagens,
    fornecedor_id: produto.fornecedor_id
  };
}

export default {
  toProduto,
  toDTO,
};
