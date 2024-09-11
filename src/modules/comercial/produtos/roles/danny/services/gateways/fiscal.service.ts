// import { EFiscalStatus } from "@modules/comercial/produtos/models/produto.model";
// import ProdutoFiscal from "../../models/produto-fiscal.model";
// import siglaEstadoModel from "@models/sigla-estado.model";

// async function cadastrar(produto: ProdutoFiscal) {
//   if (!aprovacaoService.validarSituacaoTributaria(produto)) {
//     throw new Error("Situação tributária está inconsistente para a tributação. Por favor, verifique.");
//   }
//   await atualizarTributacaoArius(produto);
//   await atualizarTabelaFornecedor(produto);
//   await atualizarTabelaFornecedorUF(produto);
//   await atualizarDados(produto);
// }

// const atualizarTributacaoArius = async (produto: ProdutoFiscal) => {
//   try {
//     await produtoService.atualizar({
//       id: produto.produto_arius,
//       ncm: {
//         id: produto?.classificacao_fiscal,
//       },
//       pisCofins: true,
//       tributacaoPisCofins: produto.pis_cofins,
//     });
//   } catch (erro) {
//     console.log(erro);
//     throw new Error("Ocorreu um erro ao atualizar o produto na ARIUS.");
//   }
// };

// const atualizarTabelaFornecedor = async (produto: ProdutoFiscal) => {
//   try {
//     await tabelaFornecedor.atualizar({
//       pk: {
//         produtoId: Number(produto.produto_arius),
//         fornecedorId: Number(produto.fornecedor_id),
//       },
//       produtoFornecedor: {
//         pk: {
//           produtoId: Number(produto.produto_arius),
//           fornecedorId: Number(produto.fornecedor_id),
//         },
//         produto: {
//           id: Number(produto.produto_arius),
//         },
//         fornecedor: {
//           id: Number(produto.fornecedor_id),
//         },
//       },
//       tipoIPI: "F",
//       ipi: Number(produto?.ipi),
//     });
//   } catch (erro) {
//     console.log(erro);
//     throw new Error(
//       "Ocorreu um erro ao atualizar os custos na tabela do fornecedor na Arius."
//     );
//   }
// };

// const atualizarTabelaFornecedorUF = async (produto: ProdutoFiscal) => {
//   try {
//     await tabelaFornecedorUf.atualizar({
//       pk: {
//         estadoId: siglaEstadoModel.obterNome(produto.estado),
//         produtoId: Number(produto?.produto_arius),
//         fornecedorId: Number(produto?.fornecedor_id),
//       },
//       tabelaFornecedor: {
//         pk: {
//           produtoId: Number(produto?.produto_arius),
//           fornecedorId: Number(produto?.fornecedor_id),
//         },
//       },
//       produtoEstado: {
//         pk: {
//           produtoId: Number(produto?.produto_arius),
//           estadoId: produto.estado,
//         },
//       },
//       tributacao: tabelaFornecedorUf.obterTipoTributacao(
//         produto?.st_compra
//       ),
//       situacaoTributaria: { id: produto?.st_compra },
//       icms: Number(produto?.icms_compra),
//       estado: {
//         id: siglaEstadoModel.obterNome(produto.estado),
//         icms: Number(produto?.icms_compra),
//       },
//     });
//   } catch (erro) {
//     console.log(erro);
//     throw new Error(
//       "Ocorreu um erro ao cadastrar os custos na tabela do fornecedor no estado na Arius."
//     );
//   }
// };

// const atualizarDados = async (produto: ProdutoFiscal) => {
//   try {
//     await produtosRepository.atualizar({
//       id: produto?.id,
//       ipi: produto?.ipi,
//       st_compra: produto?.st_compra,
//       icms_compra: produto?.icms_compra,
//       pis_cofins: produto?.pis_cofins,
//       classificacao_fiscal: produto?.classificacao_fiscal,
//       status: EFiscalStatus.APROVADO,
//     });
//   } catch (erro) {
//     console.log(erro);
//     throw new Error(
//       "Ocorreu um erro ao atualizar na base as tributações do produto."
//     );
//   }
// };


// export default {
//   cadastrar
// }
