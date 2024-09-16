import stringUtil from '@utils/string.util';
import produtoModel, { CODIGOS_PIS_COFINS, Produto } from '@modules/comercial/produtos/models/produto.model';
import { REGEX_CONTEM_LETRA_OU_NUMERO, REGEX_NAO_NUMERICOS, REGEX_TEXTO_VAZIO } from '@utils/regex.util';
import { ESiglaEstado } from '@models/sigla-estado.model';
import _ from 'lodash';
import ProdutoImportacaoDTO from '../dtos/produto-importacao.dto';

const TAMANHO_SITUACAO_TRIBUTARIA = 3;

interface ProdutoProps {
  fornecedorId: number;
  produto: ProdutoImportacaoDTO;
}

function toProduto({ fornecedorId, produto }: ProdutoProps): Produto {
  const retorno = {
    codigo_produto_fornecedor: produto.codigo_produto_fornecedor,
    descritivo_pdv: produto.descritivo_pdv?.trim(),
    descritivo: produto.descritivo?.trim(),
    origem: obterOrigem(produto.origem),
    estado: ESiglaEstado[produto.estado],
    preco: Number(produto.preco),
    desconto_p: Number(produto.desconto_p),
    eans: limparEans(produto.eans),
    duns: limparEans(produto.duns),
    pesob: Number(produto.pesob),
    pesol: Number(produto.pesol),
    altura: Number(produto.altura),
    largura: Number(produto.largura),
    comprimento: Number(produto.comprimento),
    validade: Number(produto.validade),
    qtde_embalagem: Number(produto.qtde_embalagem),
    comprimento_d: Number(produto.comprimento_d),
    largura_d: Number(produto.largura_d),
    altura_d: Number(produto.altura_d),
    classificacao_fiscal: produtoModel.limparNCM(produto.classificacao_fiscal),
    st_compra: obterCodigoCST(produto.st_compra),
    icms_compra: Number(produto.icms_compra),
    ipi: Number(produto.ipi),
    pis_cofins: obterPisCofins(produto.pis_cofins),
    ecommerce: {
      descricao: produto.descricao?.trim(),
      caracteristica: produto.caracteristica?.trim(),
      modo_uso: produto.modo_uso?.trim(),
      imagens: tratarImagens(produto.imagens),
    },
    fornecedor_id: fornecedorId,
  };

  produtoModel.formatarTexto(retorno);

  return retorno;
}

function tratarImagens(imagens: string) {
  if (!imagens) return null;
  return _.chain(imagens)
    .split(',')
    .map((imagem) => {
      if (REGEX_TEXTO_VAZIO.test(imagem)) {
        return { url: imagem };
      } else if (REGEX_CONTEM_LETRA_OU_NUMERO.test(imagem)) {
        return { url: imagem };
      }
      return null;
    })
    .compact()
    .value();
}

function obterPisCofins(pisCofins: string) {
  const codigo = Object.keys(CODIGOS_PIS_COFINS).find((codigo) => {
    if (CODIGOS_PIS_COFINS[codigo] === pisCofins) {
      return codigo;
    }
  });
  return codigo || null;
}

function limparEans(ean: string): any[] {
  return ean?.split(',')?.map((ean) => ({
    codigo: stringUtil.removerEspacosLaterais(ean.replace(REGEX_NAO_NUMERICOS, '')),
  }));
}

function obterCodigoCST(situacao_tributaria: string) {
  return stringUtil.cortar(situacao_tributaria, TAMANHO_SITUACAO_TRIBUTARIA);
}

function obterOrigem(origem: string) {
  const ORIGEM_IMPORTACAO_DIRETA = '0 - ESTRANGEIRA - IMPORTACAO DIRETA';
  const ORIGEM_MERCADO_INTERNO = '1 - ESTRANGEIRA - ADQUIRIDA NO MERCADO INTERNO';
  if (origem === ORIGEM_IMPORTACAO_DIRETA) {
    return 0;
  }
  if (origem === ORIGEM_MERCADO_INTERNO) {
    return 1;
  }
  return null;
}

export default {
  toProduto,
};
