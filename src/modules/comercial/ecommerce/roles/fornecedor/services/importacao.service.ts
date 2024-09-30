import ProdutoPlanilhaDTO from '../dtos/produto-planilha.dto';
import importacaoMapper from '../mappers/importacao.mapper';
import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import ErroException from '@exceptions/erro.exception';
import ImportacaoRequestDTO from '../dtos/importacao.request.dto';
import httpStatusEnum from '@enums/http-status.enum';
import excelUtil from '@utils/excel.util';
import _ from 'lodash';
import numberUtil from '@utils/number.util';
import validacaoService from './validacao.service';
import cadastroProdutoJob from '../jobs/cadastro-produto.job';

async function importar({ planilha, fornecedorId }: ImportacaoRequestDTO): Promise<void> {
  if (!planilha) throw new ErroException('Planilha não enviada', httpStatusEnum.Status.ERRO_REQUISICAO);
  if (!fornecedorId) throw new ErroException('Fornecedor não encontrado', httpStatusEnum.Status.ERRO_REQUISICAO);

  const dados = excelUtil.lerDados(planilha.buffer);
  if (_.isEmpty(dados)) throw new ErroException('A planilha importada está vazia, tente novamente');

  const produtosInvalidos = [];
  const produtos = [];

  for (const dado of dados) {
    const produto = obterProduto(fornecedorId, dado);

    const validacao = await validacaoService.validar(produto);

    if (!validacao.valido) {
      produtosInvalidos.push({ ean: validacao.ean, erros: validacao.erros });
    } else {
      produtos.push(produto);
    }
  }

  if (numberUtil.isMaiorZero(produtosInvalidos.length)) {
    throw new ErroException(
      'Ocorreu um erro ao cadastrar os produtos',
      produtosInvalidos,
      httpStatusEnum.Status.ERRO_REQUISICAO
    );
  }

  for (const produto of produtos) {
    await cadastroProdutoJob.add({ produto });
  }
}

const obterProduto = (fornecedorId: number, dadosPlanilha: any): Produto => {
  const produtoPlanilha: ProdutoPlanilhaDTO = {
    nome: dadosPlanilha['NOME']?.trim(),
    descricao: dadosPlanilha['DESCRIÇÃO CURTA / titulo']?.trim(),
    caracteristica: dadosPlanilha['DESCRIÇÃO DETALHADA DO SKU']?.trim(),
    modo_uso: dadosPlanilha['MODO DE USO']?.trim(),
    imagens: obterImagensFormatadas(dadosPlanilha['Link para vídeos e Imagens']),
    eans: limparEans(dadosPlanilha['EAN']),
  };

  return importacaoMapper.toProduto(fornecedorId, produtoPlanilha);
};

const limparEans = (ean: string): any[] => {
  return ean?.split(',')?.map((ean) => ean?.trim());
};

const obterImagensFormatadas = (imagem: string) => {
  return imagem?.trim()?.split(',');
};

export default {
  importar,
};
