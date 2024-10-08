import produtoModel, { Produto } from "@modules/comercial/produtos/models/produto.model";
import ProdutoDTO from "../dtos/produto.dto";

function toProduto(produtoDTO: Partial<ProdutoDTO>): Produto {
  const produto = {
    id: produtoDTO?.id,
    codigo_produto_fornecedor: produtoDTO?.codigo_produto_fornecedor,
    descritivo: produtoDTO?.descritivo,
    descritivo_pdv: produtoDTO?.descritivo_pdv,
    classificacao_fiscal: produtoDTO?.classificacao_fiscal,
    origem: produtoDTO?.origem,
    estado: produtoDTO?.estado,
    marca: produtoDTO?.marca,
    depto: produtoDTO?.depto,
    secao: produtoDTO?.secao,
    grupo: produtoDTO?.grupo,
    subgrupo: produtoDTO?.subgrupo,
    preco: produtoDTO?.preco,
    desconto_p: produtoDTO?.desconto_p,
    pesob: produtoDTO?.pesob,
    pesol: produtoDTO?.pesol,
    altura: produtoDTO?.altura,
    largura: produtoDTO?.largura,
    comprimento: produtoDTO?.comprimento,
    validade: produtoDTO?.validade,
    qtde_embalagem: produtoDTO?.qtde_embalagem,
    eans: produtoModel.obterEans(produtoDTO?.eans),
    duns: produtoModel.obterDuns(produtoDTO?.duns),
    comprador: produtoDTO?.comprador,
    categoria_fiscal: produtoDTO?.categoria_fiscal,
    fornecedor_id: produtoDTO?.fornecedor_id,
    produto_arius: produtoDTO?.produto_arius,
    divergencias: produtoDTO?.divergencias,
    status: produtoDTO?.status,
    familia: produtoDTO?.familia,
    pis_cofins: produtoDTO?.pis_cofins,
    icms_compra: produtoDTO?.icms_compra,
    ipi: produtoDTO?.ipi,
    st_compra: produtoDTO?.st_compra,
    tipo_tributacao: produtoDTO?.tipo_tributacao,
  }

  return produtoModel.formatarDescritivo(produto);
}

function toProdutoFornecedorDTO(produto: Produto): ProdutoDTO {
  return {
    id: produto.id,
    codigo_produto_fornecedor: produto.codigo_produto_fornecedor?.toLocaleUpperCase(),
    descritivo: produto.descritivo?.toLocaleUpperCase(),
    descritivo_pdv: produto.descritivo_pdv?.toLocaleUpperCase(),
    classificacao_fiscal: produto.classificacao_fiscal,
    origem: produto.origem,
    estado: produto.estado,
    marca: produto.marca,
    depto: produto.depto,
    secao: produto.secao,
    grupo: produto.grupo,
    subgrupo: produto.subgrupo,
    preco: produto.preco,
    desconto_p: produto.desconto_p,
    pesob: produto.pesob,
    pesol: produto.pesol,
    altura: produto.altura,
    largura: produto.largura,
    comprimento: produto.comprimento,
    validade: produto.validade,
    qtde_embalagem: produto.qtde_embalagem,
    comprador: produto.comprador,
    categoria_fiscal: produto.categoria_fiscal,
    fornecedor_id: produto.fornecedor_id,
    produto_arius: produto.produto_arius,
    divergencias: produto.divergencias,
    status: produto.status,
    eans: produtoModel.obterEans(produto.eans),
    duns: produtoModel.obterDuns(produto.duns),
    icms_compra: produto.icms_compra,
    ipi: produto.ipi,
    pis_cofins: produto.pis_cofins,
    st_compra: produto.st_compra,
    tipo_tributacao: produto.tipo_tributacao,
    altura_d: produto.altura_d,
    comprimento_d: produto.comprimento_d,
    largura_d: produto.largura_d,
    familia: produto.familia,
    cadastro_arius: produto.cadastro_arius,
    created_at: produto.created_at
  }
}

export default {
  toProduto,
  toProdutoFornecedorDTO
}
