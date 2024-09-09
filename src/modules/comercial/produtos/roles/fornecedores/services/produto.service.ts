import ErroException from '@exceptions/erro.exception';
import produtoDto, { ProdutoDTO } from '../dtos/produto.dto';
import produtoMapper from '../mappers/produto.mapper';
import validacaoService from './validacao.service';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import ErroCadastroProdutoDTO from '../dtos/erro-cadastro-produto.dto';
import _ from 'lodash';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE } from '@modules/comercial/produtos/models/produto.model';

async function cadastrar(dto: ProdutoDTO): Promise<void | ErroCadastroProdutoDTO> {
  try {
    const referencia = dto.codigo_produto_fornecedor;
    const { valido, mensagensErro } = await validacaoService.isValido(dto);

    if (!valido) {
      throw new ErroException<ErroCadastroProdutoDTO[]>(
        'Erro ao cadastrar novo produto',
        [
          {
            ean: dto.eans[0].codigo || null,
            erros: mensagensErro,
          },
        ],
        httpStatusEnum.Status.ERRO_REQUISICAO
      );
    }

    const produto = produtoMapper.toProduto(dto);
    await produtoService.cadastrar(produto);
    await cacheUtil.add(`${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${referencia}`, referencia, ETempoExpiracao.UMA_SEMANA);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  cadastrar,
};
