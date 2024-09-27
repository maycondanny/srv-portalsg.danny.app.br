import ariusUtil from '@utils/arius.util';

const URI = '/AriusERP/v2/TabelaFornecedorUF';

interface TabelaFornecedorUF {
  pk: {
    estadoId: string;
    produtoId: number;
    fornecedorId: number;
  };
  tabelaFornecedor: {
    pk: {
      produtoId: number;
      fornecedorId: number;
    };
  };
  produtoEstado: {
    pk: {
      produtoId: number;
      estadoId: string | number;
    };
  };
  dataCadastro?: Date;
  dataAlteracao?: Date;
  dataAlteracaoCusto?: Date;
  tributacao?: string;
  icms?: number;
  reducao?: number;
  custo?: number;
  custoTabelaFinal?: number;
  desconto?: number;
  descontoPercentual?: number;
  encargos?: number;
  encargosPercentual?: number;
  frete?: number;
  fretePercentual?: number;
  bonificacao?: number;
  bonificacaoPercentual?: number;
  acrescimo?: number;
  acrescimoPercentual?: number;
  custoAnterior?: number;
  situacaoTributaria?: {
    id: string;
  };
  custoFinal?: number;
  pauta?: number;
  fcp?: number;
  percentualDiferimentoIcms?: number;
  qtdeCompraMinima?: number;
  usuario?: {
    id: string;
  };
  estado: {
    id: string;
    icms: number;
  };
}

async function cadastrar(tabela: TabelaFornecedorUF): Promise<TabelaFornecedorUF> {
  try {
    return await ariusUtil.post(URI, tabela);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(tabela: TabelaFornecedorUF): Promise<TabelaFornecedorUF> {
  try {
    return await ariusUtil.put(URI, tabela);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obter({ estado, fornecedorId, produtoId }): Promise<TabelaFornecedorUF> {
  try {
    const url = `${URI}/{estadoId:${estado},produtoId:${produtoId},fornecedorId:${fornecedorId}}`;
    return await ariusUtil.get(url);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  obter,
  atualizar,
  cadastrar
};
