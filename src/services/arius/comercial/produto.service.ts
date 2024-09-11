import ariusHttpUtil from "@utils/arius-http.util";

const URI = "/AriusERP/v2/Produto";

const ORIGEM_IMPORTACAO_DIRETA = 'ESTRANGEIRA_IMPORTACAO_DIRETA';
const ORIGEM_MERCADO_INTERNO = 'ESTRANGEIRA_MERCADO_INTERNO';

export enum MonofasicoEnum {
  NÃO_INCIDE = 'F',
  INCIDE = 'T',
  ALIQUOTA = 'O',
  SUBSTITUIDO = 'B',
  MONOFASICO = 'M',
  SUSPENSO = 'S',
  ISENTO = 'I',
}

interface Produto {
  id?: number,
  descricao: string,
  dataCadastro?: Date,
  dataAlteracao?: Date,
  descricaoPdv: string,
  associado?: string,
  materiaPrima?: {
    id: number
  },
  sazonalId?: number,
  sazonal?: {
    id: number
  },
  similarId?: number,
  similar?: {
    id: number
  },
  marcaId?: number,
  marcaProduto?: {
    id: number
  },
  familiaId?: number,
  familia?: {
    id: number
  },
  unidadeVenda: {
    id: string
  },
  quantidadeEmbalagemSaida: number,
  embalagem?: {
    id: string
  },
  quantidadeEmbalagemEntrada: number,
  validade?: number,
  tipoValidade?: string,
  validadeCongelado?: number,
  tipoValidadeCongelado?: string,
  ncm?: {
    id: string
  },
  excecaoNcmIpiId?: string,
  excecaoNcmIcmsId?: string,
  tipoSituacaoProduto?: string,
  tipoClassificacaoProduto?: {
    id: number
  },
  removidoSortimento?: boolean,
  ipi: number,
  percentualImpostoRenda?: number,
  cor?: string,
  tipoIpi: string,
  tipoProdutoComposto?: string,
  diasEstoque?: number,
  tipoIpv: string,
  pesoLiquido: number,
  pesoBruto: number,
  pesoMinimoPdv?: number,
  pesoMaximoPdv?: number,
  tipoValidaPesoPdv?: string,
  pisCofins?: boolean,
  acrescimoFracionado?: number,
  pantone?: string,
  loteVenda?: number,
  tributacaoPisCofins: MonofasicoEnum,
  receita?: string,
  conservacao?: string,
  tag?: string,
  modoPreparo?: string,
  aceitaMultiplicacaoPDV: string,
  destinadoMaiores18?: boolean,
  aceitaEnterPDV: boolean,
  altoRisco?: boolean,
  participaCotacao?: boolean,
  fracionado?: boolean,
  cstIpi?: {
    cstIpi: string
  },
  codEnqLegalIpi?: {
    cod: string
  },
  emiteEtiquetaPedidoVenda?: boolean,
  incluiListaInventario: boolean,
  incluiListaPesquisa: boolean,
  utilizaSerie?: boolean,
  somenteCentroDistribuicao?: boolean,
  despesa?: number,
  aceitaTroca?: boolean,
  pontoFidelidade?: number,
  baseFidelidade?: string,
  descontoMaximo?: number,
  margemContribuicao?: number,
  unidadeKgl?: {
    id: string
  },
  quantidadeKgl?: number,
  origem?: number,
  cest?: string,
  lastro?: number,
  camada?: number,
  departamento?: {
    departamentoPK: {
      departamentoId: number,
      secaoId: number,
      grupoId: number,
      subGrupoId: number
    }
  },
  departamentoId?: number,
  secaoId?: number,
  grupoId?: number,
  subGrupoId?: number,
  valorNutricional?: {
    id: number
  },
  pesoMedio?: number,
  minDiasValidade?: number,
  largura?: number,
  altura?: number,
  comprimento?: number,
  profundidade?: number,
  codigoServico?: {
    id: number
  },
  ticketVinculado?: number,
  tipoCategoriaFiscal?: number,
  controlado?: boolean,
  descritivoQrCode?: string,
  mixBase?: boolean,
  armazenagemElevador?: boolean,
  controlaEstoque?: boolean,
  descricaoKGL?: string,
  comissao?: number,
  taraBalanca?: number,
  codigoProdutoAnvisa?: string,
  motivoInsencaoAnvisa?: string,
  imprimeDataEmbalagem?: boolean,
  eanPorPeso?: boolean,
  usuarioAlteracao?: string
}

async function cadastrar(produto: Produto | any): Promise<Produto> {
  try {
    return await ariusHttpUtil.post(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

async function atualizar(produto: any): Promise<Produto> {
  try {
    return await ariusHttpUtil.put(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

async function obter(produtoId: number): Promise<Produto> {
  try {
    return await ariusHttpUtil.get(`${URI}/${produtoId}`);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

function obterOrigem(origem: number) {
  return origem === 0 ? ORIGEM_IMPORTACAO_DIRETA : ORIGEM_MERCADO_INTERNO;
}

export default {
  atualizar,
  cadastrar,
  obter,
  obterOrigem
};
