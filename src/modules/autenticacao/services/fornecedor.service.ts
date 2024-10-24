import RegistroFornecedorDTO from '../dtos/registro-request.dto';
import usuarioFornecedorRepository from '../repositories/usuario-fornecedor.repository';
import emailConfirmacaoCadastroJob from '../jobs/email-confirmacao-cadastro.job';
import jwtUtil from '@utils/jwt.util';
import usuarioService from '@modules/core/usuarios/services/usuario.service';
import fornecedorService from '@modules/integradores/hub/fornecedores/services/fornecedor.service';
import { ESetores } from '@modules/core/setores/models/setor.model';
import { EGrupos } from '@modules/core/grupos/models/grupo.model';
import { EAcessos } from '@modules/core/acessos/models/acesso.model';
import { ERole } from '@modules/core/usuarios/models/usuario-role.model';
import fornecedorRepository from '@modules/core/fornecedores/repositories/fornecedor.repository';
import { REGEX_LIMPAR_CARACTERES_CNPJ } from '@utils/regex.util';
import ErroException from '@exceptions/erro.exception';
import objectUtil from '@utils/object.util';
import ConfirmaCadastroRequestDTO from '../dtos/confirma-cadastro-request.dto';
import ConfirmaCadastroResponseDTO from '../dtos/confirma-cadastro-response.dto';
import dotenv from 'dotenv';
dotenv.config();

async function carregarSessao(usuario: any) {
  const fornecedor = await usuarioFornecedorRepository.obterPorUsuario(usuario.id);
  return {
    ...usuario,
    id: fornecedor.id,
    cnpj: fornecedor.cnpj,
  };
}

async function registrar(registroFornecedorDTO: RegistroFornecedorDTO): Promise<void> {
  const erros = validar(registroFornecedorDTO);

  if (!objectUtil.isVazio(erros)) {
    throw new ErroException('Dados inválidos, verifique', erros);
  }

  if (!checarSenhasIguais(registroFornecedorDTO)) {
    throw new ErroException('As senhas informadas não são iguais.');
  }

  const emailExiste = await usuarioService.obterUsuarioPorEmail(registroFornecedorDTO.email);

  if (emailExiste) {
    throw new ErroException('O email informado já está cadastrado em nosso sistema por favor tente novamente.');
  }

  let { nome, cnpj, email, senha, transportadora } = registroFornecedorDTO;

  cnpj = obterCnpjLimpo(cnpj);
  const dadosFornecedor = await fornecedorService.obterPorCnpj(cnpj);

  if (!dadosFornecedor) {
    throw new ErroException('CNPJ não encontrado em nosso ERP por favor tente novamente.');
  }

  let setores: any = [{ id: ESetores.Comercial }];
  let grupos = [];
  let acessos = [];

  if (transportadora) {
    grupos = [{ id: EGrupos.Transportadora }];
    acessos = [{ id: EAcessos.FE_AgendamentoPedidos }];
  } else {
    grupos = [{ id: EGrupos.Fornecedores_Externos }];
    acessos = [
      { id: EAcessos.FE_ListagemProdutos },
      { id: EAcessos.FE_AgendamentoPedidos },
      { id: EAcessos.FE_Ecommerce },
    ];
  }

  let role = registroFornecedorDTO.transportadora ? ERole.TRANSPORTADORA : ERole.FORNECEDOR;

  const usuario_id = await usuarioService.cadastrar({
    email,
    nome,
    senha,
    role,
    setores,
    modulos: []
  });

  const fornecedor_id = await fornecedorRepository.cadastrar({
    id: dadosFornecedor.id,
    nome,
    cnpj,
  });

  const token = gerarTokenConfirmacao({ email, cnpj, role });

  await usuarioFornecedorRepository.cadastrar({
    usuario_id,
    fornecedor_id,
    token,
  });

  if (!dadosFornecedor.email) {
    await fornecedorService.atualizar({ id: dadosFornecedor.id, email });
  }

  await emailConfirmacaoCadastroJob.add({ nome, email, token });
}

async function confirmarCadastro({ token }: ConfirmaCadastroRequestDTO): Promise<ConfirmaCadastroResponseDTO> {
  if (!token) throw new ErroException('Token não encontrado.');

  const dados = await usuarioFornecedorRepository.obterPorToken(token);

  if (!dados) {
    throw new ErroException('Fornecedor não encontrado.');
  }

  const { nome, ativo, fornecedor_id, usuario_id } = dados;

  if (ativo) throw new ErroException('Cadastro da conta já confirmado.');

  await usuarioFornecedorRepository.atualizar({
    ativo: 1,
    datahora_ativacao: new Date(),
    fornecedor_id,
    usuario_id,
  });

  return {
    nome,
  };
}

function gerarTokenConfirmacao({ email, cnpj, role }): string {
  return jwtUtil.sign({
    payload: { email, cnpj, role },
    expiracao: Number(process.env.TEMPO_CONFIRMACAO_CONTA),
    chave: process.env.CHAVE_TOKEN_JWT,
  });
}

function obterCnpjLimpo(cnpj: string): string {
  return cnpj.replace(REGEX_LIMPAR_CARACTERES_CNPJ, '');
}

function checarSenhasIguais(usuario: any) {
  return usuario?.senha === usuario?.confirmarSenha;
}

function validar(usuario: any) {
  let erros = {};
  if (!usuario.cnpj) {
    erros = { ...erros, cnpj: 'CNPJ não informado.' };
  }
  if (!usuario.nome) {
    erros = { ...erros, nome: 'Nome não informado.' };
  }
  if (!usuario.email) {
    erros = { ...erros, email: 'Email não informado.' };
  }
  if (!usuario.senha) {
    erros = { ...erros, senha: 'Senha não informada.' };
  }
  if (!usuario.confirmarSenha) {
    erros = { ...erros, confirmarSenha: 'Confirme a sua senha.' };
  }
  return erros;
}

export default {
  registrar,
  carregarSessao,
  confirmarCadastro,
};
