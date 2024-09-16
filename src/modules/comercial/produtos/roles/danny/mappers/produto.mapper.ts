import { DEPTO_CLASSIFICAR, GRUPO_CLASSIFICAR, MARCA, Produto, SECAO_CLASSIFICAR, SUBGRUPO_CLASSIFICAR } from "@modules/comercial/produtos/models/produto.model";
import ProdutoDTO from "../dtos/produto.dto";

function toProduto(produto: Partial<ProdutoDTO>): Omit<Produto, "ecommerce"> {
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
    duns: produto.duns,
    pis_cofins: produto.pis_cofins,
    fornecedor_id: produto.fornecedor_id,
    icms_compra: produto.icms_compra,
    ipi: produto.ipi,
    st_compra: produto.st_compra,
    status: produto.status,
    tipo_tributacao: produto.tipo_tributacao,
    produto_arius: produto.produto_arius
  };
}

export default {
  toProduto
}
