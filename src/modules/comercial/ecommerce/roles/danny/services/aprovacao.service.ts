import produtoModel, { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import AprovacaoRequestDTO from '../dtos/aprovacao-request.dto';
import _ from 'lodash';
import atualizaEcommerceAriusService from './gateways/atualiza-ecommerce-arius.service';
import cadastraEcommerceAriusService from './gateways/cadastra-ecommerce-arius.service';
import produtoMapper from '../mappers/produto.mapper';
import objectUtil from '@utils/object.util';
import ErroException from '@exceptions/erro.exception';
import AprovacaoEmLoteRequestDTO from '../dtos/aprovacao-em-lote-request.dto';
import validacaoService from './validacao.service';
import httpStatusEnum from '@enums/http-status.enum';
import cadastraEcommerceAriusEmLoteJob from '../jobs/cadastra-ecommerce-arius-em-lote.job';
import numberUtil from '@utils/number.util';

async function aprovar({ produto, dadosAtualizacao }: AprovacaoRequestDTO): Promise<void> {
  if (produto.status === EStatus.CADASTRADO) {
    if (objectUtil.isVazio(dadosAtualizacao)) {
      throw new ErroException('Dados para atualização não informados');
    }

    await atualizaEcommerceAriusService.atualizar(
      produtoMapper.toProduto(produto),
      produtoMapper.toProduto(dadosAtualizacao)
    );
    return;
  }

  await cadastraEcommerceAriusService.cadastrar(produtoMapper.toProduto(produto));
}

async function aprovarEmLote({ produtos }: AprovacaoEmLoteRequestDTO): Promise<void> {
  if (numberUtil.isMenorOuIgualZero(produtos.length)) {
    throw new ErroException('Produtos para aprovação não encontrados');
  }

  const produtosValidos = [];
  const produtosInvalidos = [];

  for (const produtoDTO of produtos) {
    const produto = produtoMapper.toProduto(produtoDTO);
    const validacao = validacaoService.validar(produto);

    if (validacao.valido) {
      produtosValidos.push(produto);
    } else {
      produtosInvalidos.push(validacao);
    }
  }

  if (numberUtil.isMaiorZero(produtosInvalidos.length)) {
    throw new ErroException(
      `Não foi possivel fazer a aprovação de ${produtosInvalidos.length} produtos, verifique`,
      produtosInvalidos,
      httpStatusEnum.Status.ERRO_REQUISICAO
    );
  }

  for (const produto of produtosValidos) {
    await cadastraEcommerceAriusEmLoteJob.add({ produto });
  }
}

async function salvarImagens(produto: Produto) {
  // const URL = '/images/create';
  // const imagens = tratarImagens(produto);
  // await hubUtil.post(URL, imagens);
}

function tratarImagens(produto: Produto) {
  if (!produtoModel.possuiImagens(produto)) {
    return;
  }
  const urls = _.chain(produto.imagens)
    .map((imagem) => ({
      url: imagem.url.trim(),
    }))
    .filter(Boolean)
    .value();

  return _.map(urls, (url) => ({
    link: url,
    produtoId: produto.produto_arius,
  }));
}

export default {
  aprovar,
  aprovarEmLote,
  salvarImagens,
};
