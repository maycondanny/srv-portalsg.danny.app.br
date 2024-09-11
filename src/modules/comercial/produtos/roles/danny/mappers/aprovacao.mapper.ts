import produtoModel, { DEPTO_CLASSIFICAR, GRUPO_CLASSIFICAR, MARCA, Produto, SECAO_CLASSIFICAR, SUBGRUPO_CLASSIFICAR } from "@modules/comercial/produtos/models/produto.model";
import ProdutoCadastro from "../models/produto-cadastro.model";
import ProdutoFiscal from "../models/produto-fiscal.model";

function toProdutoCadastro(produto: Produto): ProdutoCadastro {
  return {
    id: produto.id,
    codigo_produto_fornecedor: produto.codigo_produto_fornecedor,
    descritivo: produto.descritivo,
    descritivo_pdv: produto.descritivo_pdv,
    classificacao_fiscal: produto.classificacao_fiscal,
    origem: produto.origem,
    estado: produto.estado,
    marca: produto.marca || MARCA,
    depto: produto.depto || DEPTO_CLASSIFICAR,
    secao: produto.secao || SECAO_CLASSIFICAR,
    grupo: produto.grupo || GRUPO_CLASSIFICAR,
    subgrupo: produto.subgrupo || SUBGRUPO_CLASSIFICAR,
    preco: produto.preco,
    desconto_p: produto.desconto_p,
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
    eans: produto.eans,
    pis_cofins: produto.pis_cofins,
    fornecedor_id: produto.fornecedor_id,
    icms_compra: produto.icms_compra,
    ipi: produto.ipi,
    st_compra: produto.st_compra
  };
}

function toProdutoFiscal(produto: Produto): ProdutoFiscal {
  return {
    id: produto.id,
    ipi: produto.ipi,
    st_compra: produto.st_compra,
    pis_cofins: produto.pis_cofins,
    classificacao_fiscal: produto.classificacao_fiscal,
    estado: produto.estado,
    fornecedor_id: produto.fornecedor_id,
    icms_compra: produto.icms_compra,
    produto_arius: produto.produto_arius,
    tipo_tributacao: produto.tipo_tributacao
  };
}

export default {
  toProdutoCadastro,
  toProdutoFiscal
}
