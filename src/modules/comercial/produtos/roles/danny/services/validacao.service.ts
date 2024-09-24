import ErroValidacaoResponseDTO from '@modules/comercial/produtos/dtos/erro-validacao-response.dto';
import { Produto } from '@modules/comercial/produtos/models/produto.model';
import validacaoService from '@modules/comercial/produtos/services/validacao.service';
import _ from 'lodash';

async function validarCadastro(produto: Produto): Promise<ErroValidacaoResponseDTO> {
  let erros: string[] = [];
  erros = _.concat(erros, validacaoService.validarCodigoFornecedor(produto));
  erros = _.concat(erros, validacaoService.validarEan(produto));
  erros = _.concat(erros, validacaoService.validarCaixaDun(produto));
  erros = _.concat(erros, validacaoService.validarCamposObrigatorios(produto));
  erros = _.concat(erros, validarCamposObrigatoriosCadastro(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
}

async function validarFiscal(produto: Produto): Promise<ErroValidacaoResponseDTO> {
  let erros: string[] = [];
  erros = _.concat(erros, validarCamposObrigatoriosFiscal(produto));
  erros = _.concat(erros, validacaoService.validarCstTributacao(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
}

function validarCamposObrigatoriosFiscal(produto: Produto) {
  let mensagens: string[] = [];

  if (validacaoService.validaCampoNumerico(produto, 'estado')) {
    mensagens.push('UF FATURAMENTO não informado');
  }

  mensagens = _.concat(mensagens, validacaoService.validarCamposObrigatoriosFiscal(produto));

  return mensagens;
}

function validarCamposObrigatoriosCadastro(produto: Produto) {
  let mensagens: string[] = [];

  if (_.isEmpty(produto.categoria_fiscal)) {
    mensagens.push('CATEGORIA FISCAL não informada');
  }

  if (validacaoService.validaCampoNumerico(produto, 'comprador')) {
    mensagens.push('COMPRADOR não informado');
  }

  if (validacaoService.validaCampoNumerico(produto, 'marca')) {
    mensagens.push('MARCA não informada');
  }

  if (validacaoService.validaCampoNumerico(produto, 'depto')) {
    mensagens.push('DEPARTAMENTO não informado');
  }

  if (validacaoService.validaCampoNumerico(produto, 'secao')) {
    mensagens.push('SEÇÃO não informada');
  }

  if (validacaoService.validaCampoNumerico(produto, 'grupo')) {
    mensagens.push('GRUPO não informado');
  }

  if (validacaoService.validaCampoNumerico(produto, 'subgrupo')) {
    mensagens.push('SUBGRUPO não informado');
  }

  return mensagens;
}

export default {
  validarCadastro,
  validarFiscal,
};
