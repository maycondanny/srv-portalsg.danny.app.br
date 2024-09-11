import ariusHttpUtil from '@utils/arius-http.util';

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
    return await ariusHttpUtil.post(URI, tabela);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(tabela: TabelaFornecedorUF): Promise<TabelaFornecedorUF> {
  try {
    return await ariusHttpUtil.put(URI, tabela);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obter({ estado, fornecedorId, produtoId }): Promise<TabelaFornecedorUF> {
  try {
    const url = `${URI}/{estadoId:${estado},produtoId:${produtoId},fornecedorId:${fornecedorId}}`;
    return await ariusHttpUtil.get(url);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

function obterTipoTributacao(cst: string): string {
  switch (cst?.substring(1, 3)) {
    case '00':
      return 'T';
    case '10':
    case '60':
    case '30':
    case '70':
    case '02':
    case '15':
    case '53':
    case '61':
      return 'F';
    case '20':
      return 'R';
    case '40':
      return 'I';
    case '41':
      return 'N';
    case '50':
      return 'S';
    case '51':
      return 'D';
    case '90':
      return 'O';
    default:
      throw new Error('Tipo da situação tributária não encontrada');
  }
}

export default {
  obter,
  atualizar,
  cadastrar,
  obterTipoTributacao,
};
