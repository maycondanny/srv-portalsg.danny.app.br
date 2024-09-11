import produtoModel, {
  ECadastroStatus,
  EFiscalStatus,
  ERole,
  Produto,
} from '@modules/comercial/produtos/models/produto.model';
import CapaProdutoResponseDTO from '../dtos/capa-produto-response.dto';
import produtoDannyRepository from '../repositories/produto.repository';
import _ from 'lodash';
import fornecedorService from '@services/fornecedor.service';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import Fornecedor from '@models/fornecedor.model';
import produtoRepository from '@modules/comercial/produtos/repositories/produto.repository';
import divergenciasService from './divergencias.service';
import ProdutoFornecedorResponse from '../dtos/produto-fornecedor-response.dto';

async function obterTodosPorFornecedor(fornecedorId: number, role: ERole): Promise<ProdutoFornecedorResponse> {
  try {
    if (!fornecedorId) {
      throw new Error('Fornecedor não encontrado.');
    }

    const fornecedor = await buscarFornecedor(fornecedorId);

    const produtos = await produtoRepository.obterTodosPorFornecedor(fornecedorId);

    const resultado = _.map(produtos, async (produto) => {
      const divergencias = await divergenciasService.obterTodas(produto);

      produto.divergencias = divergencias;

      if (role === ERole.CADASTRO) {
        mapearProdutoCadastro(produto);
      }

      if (role === ERole.FISCAL) {
        mapearProdutoFiscal(produto);
      }

      return produto;
    });

    return {
      fornecedor,
      produtos: await Promise.all(resultado),
    };

  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel obter os produtos.');
  }
}

function mapearProdutoCadastro(produto: Produto): Produto {
  const status = [ECadastroStatus.NOVO, ECadastroStatus.APROVADO, ECadastroStatus.CADASTRADO];

  if (produto.status === ECadastroStatus.APROVADO || !status.includes(produto.status)) {
    return produto;
  }

  if (!produtoModel.possuiDivergencias(produto)) {
    produto.status = ECadastroStatus.NOVO;
    return produto;
  }

  produto.status = ECadastroStatus.CADASTRADO;
  produto.produto_arius = Number(produto.divergencias[0].produto_id);

  return produto;
}

function mapearProdutoFiscal(produto: Produto): Produto {
  const status = [ECadastroStatus.APROVADO, EFiscalStatus.NOVO, EFiscalStatus.APROVADO, EFiscalStatus.CADASTRADO];

  if (produto.status === EFiscalStatus.APROVADO || !status.includes(produto.status)) {
    return produto;
  }

  if (produto.status === ECadastroStatus.APROVADO && produtoModel.possuiDivergencias(produto)) {
    produto.status = EFiscalStatus.CADASTRADO;
    return produto;
  }

  produto.status = EFiscalStatus.NOVO;
  return produto;
}

async function buscarFornecedor(fornecedorId: number): Promise<Fornecedor> {
  const chaveCache = `fornecedor_${fornecedorId}`;
  let fornecedor: Fornecedor = null;

  const fornecedorCacheado = await cacheUtil.obter(chaveCache);

  if (fornecedorCacheado) {
    fornecedor = fornecedorCacheado;
  } else {
    fornecedor = await fornecedorService.obterPorId(fornecedorId);
    await cacheUtil.add(chaveCache, fornecedor, ETempoExpiracao.SEIS_HORAS);
  }

  return fornecedor;
}

async function obterTodos(): Promise<CapaProdutoResponseDTO[]> {
  const produtos = await produtoDannyRepository.obterTodosAgrupados();
  return agrupar(produtos);
}

function agrupar(produtos: CapaProdutoResponseDTO[]): CapaProdutoResponseDTO[] {
  const resultado = _.reduce(
    produtos,
    (prev, produto) => {
      const id = produto['fornecedor_id'];
      prev[id] = produto;
      return prev;
    },
    {}
  );
  return _.values(resultado);
}

export default {
  obterTodosPorFornecedor,
  obterTodos,
};
