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
import eanService from '@modules/comercial/produtos/services/ean.service';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import produtoMapper from '../mappers/produto.mapper';
import ErroException from '@exceptions/erro.exception';
import httpStatusEnum from '@enums/http-status.enum';
import validacaoService from './validacao.service';

async function obterTodosPorFornecedor(fornecedorId: number, role: ERole): Promise<ProdutoFornecedorResponse> {
  try {
    if (!fornecedorId) {
      throw new Error('Fornecedor não encontrado.');
    }

    const fornecedor = await buscarFornecedor(fornecedorId);

    const produtos = await obterProdutosFornecedor(fornecedorId);

    const resultado = _.map(produtos, async (produto) => {
      const divergencias = await divergenciasService.obterTodas(produto);

      produto.divergencias = divergencias;

      if (role === ERole.CADASTRO) {
        mapearProdutoCadastro(produto);
      }

      if (role === ERole.FISCAL) {
        mapearProdutoFiscal(produto);
      }

      return produtoMapper.toProdutoFornecedorDTO(produto);
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

async function obterProdutosFornecedor(fornecedorId: number): Promise<Produto[]> {
  let produtos = await produtoRepository.obterTodosPorFornecedor(fornecedorId);
  produtos = _.map(produtos, async (produto) => ({
    ...produto,
    eans: await eanService.obterPorProdutoId(produto.id),
  }));
  return await Promise.all(produtos);
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

async function atualizar(role: ERole, produto: Produto) {
  if (!role) throw new Error('Role não informada');
  if (!produto) throw new Error('Produto não informada');

  if (role === ERole.FISCAL) {
    const validacao = await validacaoService.validarFiscal(produto);

    if (!validacao.valido) {
      throw new ErroException(
        'Erro ao atualizar a tributação do produto',
        validacao,
        httpStatusEnum.Status.ERRO_REQUISICAO
      );
    }

    await produtoService.atualizar({
      id: produto.id,
      classificacao_fiscal: produto?.classificacao_fiscal,
      st_compra: produto?.st_compra,
      ipi: produto?.ipi,
      icms_compra: produto?.icms_compra,
      pis_cofins: produto?.pis_cofins,
    });
    return;
  }

  if (role === ERole.CADASTRO) {
    const validacao = await validacaoService.validarCadastro(produto);

    if (!validacao.valido) {
      throw new ErroException(
        'Erro ao atualizar o cadastro do produto',
        validacao,
        httpStatusEnum.Status.ERRO_REQUISICAO
      );
    }

    produto = produtoModel.formatarTexto(produto);
    await produtoService.atualizar({
      id: produto.id,
      codigo_produto_fornecedor: produto?.codigo_produto_fornecedor,
      descritivo: produto.descritivo,
      descritivo_pdv: produto?.descritivo_pdv,
      marca: produto?.marca,
      depto: produto?.depto,
      secao: produto?.secao,
      grupo: produto?.grupo,
      subgrupo: produto?.subgrupo,
      classificacao_fiscal: produto?.classificacao_fiscal,
      origem: produto?.origem,
      pesol: produto?.pesol,
      pesob: produto?.pesob,
      validade: produto?.validade,
      familia: produto?.familia,
      comprimento: produto?.comprimento,
      largura: produto?.largura,
      altura: produto?.altura,
      qtde_embalagem: produto?.qtde_embalagem,
      comprimento_d: produto?.comprimento_d,
      altura_d: produto?.altura_d,
      largura_d: produto?.largura_d,
      ipi: produto?.ipi,
      pis_cofins: produto?.pis_cofins,
      preco: produto?.preco,
      desconto_p: produto?.desconto_p,
      estado: produto?.estado,
      comprador: produto?.comprador,
      categoria_fiscal: produto?.categoria_fiscal,
    });
    const eans = produtoModel.juntarEansDuns(produto.eans, produto.duns, produto.qtde_embalagem);
    await eanService.atualizar(eans);
    return;
  }
}

export default {
  obterTodosPorFornecedor,
  obterTodos,
  atualizar,
};
