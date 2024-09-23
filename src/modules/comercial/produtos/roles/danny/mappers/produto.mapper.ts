import produtoModel, { Produto } from "@modules/comercial/produtos/models/produto.model";
import ProdutoCadastroDTO from "../dtos/produto-cadastro.dto";
import ProdutoFiscalDTO from "../dtos/produto-fiscal.dto";
import ProdutoDTO from "../dtos/produto.dto";
import ProdutoFornecedorDTO from "../dtos/produto-fornecedor.dto";

const MARCA = 44;
const DEPTO_CLASSIFICAR = 80;
const GRUPO_CLASSIFICAR = 1;
const SUBGRUPO_CLASSIFICAR = 1;
const SECAO_CLASSIFICAR = 1;
const COMPRADOR_BELLO = 118;
const CATEGORIA_FISCAL_REVENDA = "00";
const ESTADO_SP = 25;

function toProdutoCadastroDTO(produto: ProdutoDTO): ProdutoCadastroDTO {
  return {
    id: produto.id,
    codigo_produto_fornecedor: produto.codigo_produto_fornecedor,
    descritivo: produto.descritivo,
    descritivo_pdv: produto.descritivo_pdv,
    classificacao_fiscal: produto.classificacao_fiscal,
    origem: produto.origem,
    estado: produto.estado || ESTADO_SP,
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
    eans: produtoModel.juntarEansDuns(produto.eans, produto.duns, produto.qtde_embalagem),
    comprador: produto.comprador || COMPRADOR_BELLO,
    categoria_fiscal: produto.categoria_fiscal || CATEGORIA_FISCAL_REVENDA,
    fornecedor_id: produto.fornecedor_id,
    produto_arius: produto.produto_arius,
    divergencias: produto.divergencias,
    status: produto.status,
    familia: produto.familia
  };
}

function toProdutoFiscalDTO(produto: ProdutoDTO): ProdutoFiscalDTO {
  return {
    id: produto.id,
    classificacao_fiscal: produto.classificacao_fiscal,
    estado: produto.estado,
    pis_cofins: produto.pis_cofins,
    fornecedor_id: produto.fornecedor_id,
    icms_compra: produto.icms_compra,
    ipi: produto.ipi,
    st_compra: produto.st_compra,
    tipo_tributacao: produto.tipo_tributacao,
    produto_arius: produto.produto_arius,
    divergencias: produto.divergencias,
    status: produto.status
  };
}

function toProdutoFornecedorDTO(produto: Produto): ProdutoFornecedorDTO {
  return {
    id: produto.id,
    codigo_produto_fornecedor: produto.codigo_produto_fornecedor,
    descritivo: produto.descritivo,
    descritivo_pdv: produto.descritivo_pdv,
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
    eans: produto.eans,
    comprador: produto.comprador,
    categoria_fiscal: produto.categoria_fiscal,
    fornecedor_id: produto.fornecedor_id,
    produto_arius: produto.produto_arius,
    divergencias: produto.divergencias,
    status: produto.status,
    duns: produto.duns,
    icms_compra: produto.icms_compra,
    ipi: produto.ipi,
    pis_cofins: produto.pis_cofins,
    st_compra: produto.st_compra,
    tipo_tributacao: produto.tipo_tributacao,
    altura_d: produto.altura_d,
    comprimento_d: produto.comprimento_d,
    largura_d: produto.largura_d,
    familia: produto.familia
  }
}

export default {
  toProdutoFornecedorDTO,
  toProdutoCadastroDTO,
  toProdutoFiscalDTO,
}
