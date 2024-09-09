import excelUtil from '@utils/excel.util';
import formatacaoUtil from '@utils/formatacao.util';
import stringUtil from '@utils/string.util';
import _ from 'lodash';
import { ESiglaEstado } from '@models/sigla-estado.model';
import { CODIGOS_PIS_COFINS } from '@modules/comercial/produtos/models/produto.model';
import ErroException from '@exceptions/erro.exception';
import { ProdutoDTO } from '../dtos/produto.dto';
import ImportacaoRequestDTO from '../dtos/importacao.request.dto';
import httpStatusEnum from '@enums/http-status.enum';
import validacaoService from './validacao.service';
import { REGEX_APENAS_NUMEROS, REGEX_CONTEM_LETRA_OU_NUMERO, REGEX_TEXTO_VAZIO } from '@utils/regex.util';
import numberUtil from '@utils/number.util';
import ErroCadastroProdutoDTO from '../dtos/erro-cadastro-produto.dto';
import cadastroProdutoJob from '../jobs/cadastro-produto.job';

const TAMANHO_SITUACAO_TRIBUTARIA = 3;

async function importar({ planilha, fornecedorId }: ImportacaoRequestDTO): Promise<void> {
  if (!planilha) throw new ErroException('Planilha não enviada', httpStatusEnum.Status.ERRO_REQUISICAO);
  if (!fornecedorId) throw new ErroException('Fornecedor não encontrado', httpStatusEnum.Status.ERRO_REQUISICAO);

  try {
    const dados = excelUtil.lerDados(planilha.buffer);
    if (_.isEmpty(dados)) throw new ErroException('A planilha importada está vazia, tente novamente');

    const produtosInvalidos = [];
    const produtos = [];

    for (const dado of dados) {
      const produtoDTO = mapearDTO(dado, fornecedorId);
      const { valido, mensagensErro } = await validacaoService.isValido(produtoDTO);
      if (valido) {
        produtos.push(produtoDTO);
      } else {
        produtosInvalidos.push({ ean: produtoDTO.eans[0].codigo || null, erros: mensagensErro });
      }
    }

    if (_.isArray(produtosInvalidos) && numberUtil.isMaiorZero(produtosInvalidos.length)) {
      throw new ErroException<ErroCadastroProdutoDTO[]>(
        'Erro ao cadastrar novo produto',
        produtosInvalidos,
        httpStatusEnum.Status.ERRO_REQUISICAO
      );
    }

    for (const dto of produtos) {
      await cadastroProdutoJob.add({ dto });
    }
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

function mapearDTO(dadosImportados: any, fornecedorId: number): ProdutoDTO {
  return {
    codigo_produto_fornecedor: dadosImportados['CODIGO INTERNO DO PRODUTO FORNECEDOR']?.trim(),
    descritivo_pdv: dadosImportados['DESCRIÇÃO ABREVIADA'],
    descritivo: dadosImportados['DESCRIÇÃO COMPLETA'],
    origem: obterOrigem(dadosImportados['ORIGEM PRODUTO']),
    estado: ESiglaEstado[stringUtil.removerEspacosLaterais(dadosImportados['UF FATURAMENTO'])],
    preco: formatacaoUtil.paraDecimal(dadosImportados['PREÇO CUSTO']),
    desconto_p: formatacaoUtil.paraDecimal(dadosImportados['DESCONTO']),
    eans: limparEans(dadosImportados['EAN']),
    duns: limparEans(dadosImportados['DUN']),
    pesob: formatacaoUtil.paraNumerico(dadosImportados['PESO BRUTO(KG)']),
    pesol: formatacaoUtil.paraNumerico(dadosImportados['PESO LIQUIDO']),
    altura: formatacaoUtil.paraNumerico(dadosImportados['ALTURA']),
    largura: formatacaoUtil.paraNumerico(dadosImportados['LARGURA']),
    comprimento: formatacaoUtil.paraNumerico(dadosImportados['COMPRIMENTO']),
    validade: formatacaoUtil.paraNumerico(dadosImportados['VALIDADE DO PRODUTO (MESES)']),
    qtde_embalagem: formatacaoUtil.paraNumerico(dadosImportados['QTDE POR CX']),
    comprimento_d: formatacaoUtil.paraNumerico(dadosImportados['COMPRIMENTO DA CX']),
    largura_d: formatacaoUtil.paraNumerico(dadosImportados['LARGURA DA CX']),
    altura_d: formatacaoUtil.paraNumerico(dadosImportados['ALTURA DA CX']),
    classificacao_fiscal: dadosImportados['NCM'],
    st_compra: obterCodigoCST(dadosImportados['CÓDIGO SUBSTITUIÇÃO TRIBUTÁRIA'] || '0'),
    icms_compra: formatacaoUtil.paraNumerico(dadosImportados['ICMS']),
    ipi: formatacaoUtil.paraNumerico(dadosImportados['IPI']),
    pis_cofins: obterPisCofins(dadosImportados['PIS/COFINS']),
    descricao: dadosImportados['DESCRIÇÃO CURTA / titulo'],
    caracteristica: dadosImportados['DESCRIÇÃO DETALHADA DO SKU']?.trim(),
    modo_uso: dadosImportados['MODO DE USO'],
    imagens: tratarImagens(dadosImportados['Link para vídeos e Imagens']),
    fornecedor_id: fornecedorId,
  };
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
    codigo: stringUtil.removerEspacosLaterais(ean.replace(REGEX_APENAS_NUMEROS, '')),
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

function tratarImagens(imagens: string) {
  if (!imagens) return null;
  return _.chain(imagens)
    .split(',')
    .map(imagem => {
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

export default {
  importar,
};
