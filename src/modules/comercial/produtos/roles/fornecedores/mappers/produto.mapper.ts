import produtoModel, { Produto } from "@modules/comercial/produtos/models/produto.model";
import _ from 'lodash';
import { ProdutoDTO } from '../dtos/produto.dto';

function toProduto(dto: ProdutoDTO): Produto {
  const produto = {
    codigo_produto_fornecedor: dto.codigo_produto_fornecedor,
    descritivo_pdv: dto.descritivo_pdv,
    descritivo: dto.descritivo,
    origem: dto.origem,
    estado: dto.estado,
    preco: dto.preco,
    desconto_p: dto.desconto_p,
    eans: produtoModel.tratarEansDuns(dto.eans, dto.duns, dto.qtde_embalagem),
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
    descricao: dto.descricao,
    caracteristica: dto.caracteristica,
    modo_uso: dto.modo_uso,
    imagens: dto.imagens,
    fornecedor_id: dto.fornecedor_id,
  };

  produtoModel.formatarTexto(produto);

  return produto;
}

export default {
  toProduto
}
