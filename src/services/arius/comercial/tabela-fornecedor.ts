import ariusHttpUtil from "@utils/arius-http.util";

const URI = "/AriusERP/v2/TabelaFornecedor";

interface TabelaFornecedor {
  pk: {
    produtoId: number;
    fornecedorId: number;
  };
  produtoFornecedor: {
    pk: {
      produtoId: number;
      fornecedorId: number;
    };
    produto: {
      id: number;
    };
    fornecedor: {
      id: number;
    };
  };
  dataCadastro?: Date;
  dataAlteracao?: Date;
  tipoIPI?: string;
  ipi?: number;
  quantidadeEmbalagem?: number;
  unidadeCompra?: {
    id: string;
  };
  efetivaTabela?: boolean;
  unidadeConversao?: {
    id: string;
  };
  quantidadeEmbalagemConversao?: number;
  cstIpi?: {
    cstIpi: string;
  };
  codEnqLegalIpi?: {
    cod: string;
  };
}

async function cadastrar(
  tabela: TabelaFornecedor
): Promise<TabelaFornecedor> {
  try {
    return await ariusHttpUtil.post(URI, tabela);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

async function atualizar(
  tabela: TabelaFornecedor
): Promise<TabelaFornecedor> {
  try {
    return await ariusHttpUtil.put(URI, tabela);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

export default {
  atualizar,
  cadastrar,
};
