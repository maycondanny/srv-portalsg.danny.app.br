import { ECadastroStatus, ERole, Produto } from "@modules/comercial/produtos/models/produto.model";
import cadastroService from "./gateways/cadastro.service";
import AprovacaoRequestDTO from "../dtos/aprovacao-request.dto";
import ProdutoCadastro from "../models/produto-cadastro.model";
import aprovacaoMapper from "../mappers/aprovacao.mapper";
// import fiscalService from "./gateways/fiscal.service";
import ProdutoFiscal from "../models/produto-fiscal.model";
import tabelaFornecedorUf from "@services/arius/comercial/tabela-fornecedor-uf";

async function aprovar(dto: AprovacaoRequestDTO) {
  let produto = null;
  let dadosAtualizacao = null;
  switch (dto.role) {
    case ERole.CADASTRO:
      produto = aprovacaoMapper.toProdutoCadastro(dto.produto);
      //dadosAtualizacao = aprovacaoMapper.toProdutoCadastro(dto.dadosAtualizacao);
      await aprovarCadastro(produto, dadosAtualizacao);
      return;
    case ERole.FISCAL:
      produto = aprovacaoMapper.toProdutoFiscal(dto.produto);
      //dadosAtualizacao = aprovacaoMapper.toProdutoFiscal(dto.dadosAtualizacao);
      await aprovarFiscal(produto, dadosAtualizacao);
      return;
  }
};

const aprovarCadastro = async (produto: ProdutoCadastro, dadosAtualizacao: ProdutoCadastro) => {
    await cadastroService.cadastrar(produto);
  // try {
  //   if (aprovacaoDto.status === ECadastroStatus.CADASTRADO) {
  //     //await atualizaProdutoAriusService.atualizar(produto, dadosAtualizacao);
  //   } else {
  //     await cadastroService.cadastrar(aprovacaoDto);
  //   }
  // } catch (erro) {
  //   throw erro;
  // }
};

const aprovarFiscal = async (produto: ProdutoFiscal, dadosAtualizacao: Produto) => {
  // await fiscalService.cadastrar(produto);
};

const validarSituacaoTributaria = (produto: Produto): boolean => {
  const st = produto.st_compra;
  const tipo = produto.tipo_tributacao;

  if (st || tipo) {
    if (!st) throw new Error("Situação tributária do produto não informada.");
    if (!tipo)
      throw new Error("Tipo situação tributária do produto não informada.");
    const tipoTributacao = tabelaFornecedorUf.obterTipoTributacao(st);
    return tipoTributacao === tipo;
  }

  return true;
};


export default {
  aprovar,
  validarSituacaoTributaria
}
