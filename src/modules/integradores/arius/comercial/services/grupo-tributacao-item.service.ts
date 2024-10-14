import ariusUtil from '@utils/arius.util';

const URI = '/AriusERP/v2/GrupoTributacaoItem';

interface GrupoTributacaoItem {
  grupoTributacao: {
    id: number;
  };
  produto: {
    id: number;
  };
  dataCadastro?: string;
  dataAlteracao?: string;
  icmsVenda?: number;
  aliquotaIcmsOriginal?: number;
  reducaoVenda?: number;
  tributacaoVenda: string;
  situacaoTributaria: {
    id: string;
  };
  decr?: boolean;
  creditoIcms?: boolean;
  iva?: number;
  reducaoIva?: number;
  tipoIVA?: string;
  fcp?: number;
  codigoBeneficiarioFiscal?: {
    id: number;
  };
  valorPautaCarneCredIcms?: number;
  regimeAtacadoBahia?: boolean;
  reducaoIcmsSt?: boolean;
  reducaoBcOperPropriaSt?: boolean;
  utilizaAliquotaInterna?: boolean;
  vendaCarne?: boolean;
  percentualDiferimentoIcms?: number;
  compoeCestaBasicaUf?: boolean;
  codigoProdutoGnre?: number;
  conferido?: boolean;
  precoMaximoConsumidor?: number;
  tipoIpi?: string;
  ipi?: number;
  cstIpi?: {
    cstIpi: string;
  };
  codEnqLegalIpi?: {
    cod: string;
  };
  creditoIcmsConsumoInterno?: number;
}

async function atualizar(tributacao: GrupoTributacaoItem): Promise<GrupoTributacaoItem> {
  try {
    const resposta = await ariusUtil.put(URI, tributacao);
    return resposta;
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  atualizar,
};
