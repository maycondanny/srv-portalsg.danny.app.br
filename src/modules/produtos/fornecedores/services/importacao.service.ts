import fs from "fs";
import xlsx from "xlsx";

async function importar({ arquivo, usuarioId }: any) {
  try {
    const dados = obterDadosPlanilha(arquivo);
    for (const dado of dados) {
      const produto = mapearCamposParaProduto(dado, usuarioId);
    }
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

function obterDadosPlanilha(arquivo: any) {
  try {
    const conteudoArquivo = fs.readFileSync(arquivo);
    const planilha = xlsx.read(conteudoArquivo, { type: "buffer" });
    const nomeDaAba = planilha.SheetNames[0];
    return xlsx.utils.sheet_to_json(planilha.Sheets[nomeDaAba], {
      header: 3,
      range: 4,
      raw: false,
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel ler os dados da planilha.");
  }
}

function mapearCamposParaProduto(dadosImportados: any, usuario_id: number) {
  return {
    codigo_produto_fornecedor:
      dadosImportados["CODIGO INTERNO DO PRODUTO FORNEC"],
    descricao_abreviada: dadosImportados["DESCRIÇÃO ABREVIADA"]?.substring(
      0,
      30
    ),
    sub_categoria: dadosImportados["SUB CATEGORIA /SEÇÃO"],
    ncm: limparNCM(dadosImportados["CLASSIFICAÇÃO FISCAL (NCM)"]),
    descricao_classificacao: dadosImportados[
      "DESCRIÇÃO CLASIFICAÇÃO DO PRODUTO"
    ]?.substring(0, 128),
    origem: obterOrigem(dadosImportados["ORIGEM PRODUTO"]),
    uf_faturamento: SIGLAS[dadosImportados["UF FATURAMENTO"]],
    preco_custo: Number(
      dadosImportados["PREÇO CUSTO"]
        ?.trim()
        ?.replaceAll(/\,/g, "")
        ?.replace(",", ".") ?? 0
    ),
    situacao_tributaria: dadosImportados["CÓDIGO SUBSTITUIÇÃO TRIBUTÁRIA"],
    ipi_tabela: Number(dadosImportados["IPI"]?.trim() ?? 0),
    icms_tabela: Number(dadosImportados["ICMS"]?.trim() ?? 0),
    peso_bruto: Number(dadosImportados["PESO BRUTO(KG)"] ?? 0),
    eans: limparEans(dadosImportados["EAN"]),
    duns: dadosImportados["DUN"] ? limparEans(dadosImportados["DUN"]) : [],
    altura_primario: Number(dadosImportados["ALT"] ?? 0),
    largura_primario: Number(dadosImportados["LARG"] ?? 0),
    comprimento_primario: Number(dadosImportados["COMPR"] ?? 0),
    validade: Number(dadosImportados["VALIDADE DO PRODUTO (MESES)"]),
    qtde_cx: dadosImportados["QTDE POR CX"]
      ? Number(dadosImportados["QTDE POR CX"])
      : 0,
    comprimento_secundario: Number(dadosImportados["COMPR_1"] ?? 0),
    largura_secundario: Number(dadosImportados["LARG_1"] ?? 0),
    altura_secundario: Number(dadosImportados["ALT_1"] ?? 0),
    peso_bruto_secundario: Number(dadosImportados["PB"] ?? 0),
    peso_liquido_secundario: Number(dadosImportados["PL"] ?? 0),
    ipi: Number(dadosImportados["%IPI"] ?? 0),
    iva: Number(dadosImportados["%IVA"] ?? 0),
    icms: Number(dadosImportados["ICMS ST"] ?? 0),
    icms_entrada: dadosImportados["ICMS ENTRADA"],
    pis: dadosImportados["PIS/COFINS"],
    user_id: usuario_id,
    descricao_curta_multicanal: dadosImportados["DESCRIÇÃO CURTA / titulo"],
    descricao_detalhada_multicanal:
      dadosImportados["DESCRIÇÃO DETALHADA DO SKU"],
    modo_uso: dadosImportados["MODO DE USO"],
    link_videos_imagens: dadosImportados["Link para vídeos e Imagens"],
  };
}

function limparEans(ean: string) {
  return ean
    .split(",")
    .map((ean) => ({ codigo_ean: ean.replaceAll(/[^\d]/g, "").trim() }));
}

function limparNCM(ncm: string) {
  return ncm?.replaceAll(/[^\d]/g, "");
}

function obterOrigem(origem: string) {
  const ORIGEM_IMPORTACAO_DIRETA = "0 - ESTRANGEIRA - IMPORTAÇÃO DIRETA";
  const ORIGEM_MERCADO_INTERNO =
    "1 - ESTRANGEIRA - ADQUIRIDA NO MERCADO INTERNO";
  if (origem === ORIGEM_IMPORTACAO_DIRETA) {
    return 0;
  }
  if (origem === ORIGEM_MERCADO_INTERNO) {
    return 1;
  }
  return null;
}

export default {
  importar,
};
