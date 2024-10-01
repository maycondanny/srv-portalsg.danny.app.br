import ErroException from '@exceptions/erro.exception';
import Divergencia from '@modules/comercial/produtos/models/divergencia.model';
import produtoModel, { Produto } from '@modules/comercial/produtos/models/produto.model';
import produtoPortalService from '@modules/integradores/hub/produtos/services/produto.service';
import numberUtil from '@utils/number.util';
import objectUtil from '@utils/object.util';
import _ from 'lodash';

async function obterTodas(produto: Produto): Promise<Divergencia[]> {
  if (numberUtil.isMenorOuIgualZero(produto.eans.length)) {
    throw new ErroException('Eans não encontrados.');
  }
  const codigos = produtoModel.obterCodigosEans(produto.eans);
  const divergencia = await produtoPortalService.obterTodosPorEans(codigos);
  return divergencia ? [tratarDivergencia(divergencia)] : [];
}

function tratarDivergencia(dados: any): Divergencia {
  return {
    produto_id: objectUtil.isCamposExiste(dados, ["produto_id"]) ? Number(dados.produto_id) : dados.produto_id,
    marca: objectUtil.isCamposExiste(dados, ["marca"]) ? Number(dados.marca) : dados.marca,
    descritivo: dados.descritivo,
    descritivo_pdv: dados.descritivo_pdv,
    depto: objectUtil.isCamposExiste(dados, ["depto"]) ? Number(dados.depto) : dados.depto,
    secao: objectUtil.isCamposExiste(dados, ["secao"]) ? Number(dados.secao) : dados.secao,
    grupo: objectUtil.isCamposExiste(dados, ["grupo"]) ? Number(dados.grupo) : dados.grupo,
    subgrupo: objectUtil.isCamposExiste(dados, ["subgrupo"]) ? Number(dados.subgrupo) : dados.subgrupo,
    classificacao_fiscal: dados.classificacao_fiscal,
    origem: objectUtil.isCamposExiste(dados, ["origem"]) ? dados.origem?.toString() : dados.origem,
    pesol: objectUtil.isCamposExiste(dados, ["pesol"]) ? Number(dados.pesol) : dados.pesol,
    pesob: objectUtil.isCamposExiste(dados, ["pesob"]) ? Number(dados.pesob) : dados.pesob,
    validade: objectUtil.isCamposExiste(dados, ["validade"]) ? Number(dados.validade) : dados.validade,
    comprimento: objectUtil.isCamposExiste(dados, ["comprimento"]) ? Number(dados.comprimento) : dados.comprimento,
    largura: objectUtil.isCamposExiste(dados, ["largura"]) ? Number(dados.largura) : dados.largura,
    altura: objectUtil.isCamposExiste(dados, ["altura"]) ? Number(dados.altura) : dados.altura,
    qtde_embalagem: objectUtil.isCamposExiste(dados, ["qtde_embalagem"]) ? Number(dados.qtde_embalagem) : dados.qtde_embalagem,
    ipi: objectUtil.isCamposExiste(dados, ["ipi"]) ? Number(dados.ipi) : dados.ipi,
    pis_cofins: dados.pis_cofins,
    fornecedor_id: objectUtil.isCamposExiste(dados, ["fornecedor_id"]) ? Number(dados.fornecedor_id) : dados.fornecedor_id,
    preco: objectUtil.isCamposExiste(dados, ["preco"]) ? Number(dados.preco) : dados.preco,
    desconto_p: objectUtil.isCamposExiste(dados, ["st_compra"]) ? Number(dados.st_compra) : dados.st_compra,
    st_compra: dados.st_compra,
    icms_compra: objectUtil.isCamposExiste(dados, ["icms_compra"]) ? Number(dados.icms_compra) : dados.icms_compra,
    tributacao_compra: dados.tributacao_compra,
    comprador: objectUtil.isCamposExiste(dados, ["comprador"]) ? Number(dados.comprador) : dados.comprador,
    familia: objectUtil.isCamposExiste(dados, ["familia"]) ? Number(dados.familia) : dados.familia,
    categoria_fiscal: dados.categoria_fiscal,
    estado: objectUtil.isCamposExiste(dados, ["estado"]) ? Number(dados.estado) : dados.estado,
    datahora_cadastro: dados.datahora_cadastro,
    datahora_alteracao: dados.datahora_alteracao,
  }
}

export default {
  obterTodas,
};
