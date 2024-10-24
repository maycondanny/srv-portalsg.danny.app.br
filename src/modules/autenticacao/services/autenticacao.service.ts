import usuarioService from '@modules/core/usuarios/services/usuario.service';
import LoginRequestDTO from '../dtos/login-request.dto';
import encryptacaoUtil from '@utils/encryptacao.util';
import jwtUtil from '@utils/jwt.util';
import logAcessosService from './log-acessos.service';
import Usuario from '@modules/core/usuarios/models/usuario.model';
import usuarioFornecedorRepository from '../repositories/usuario-fornecedor.repository';
import hubUtil from '@utils/hub.util';
import LoginResponseDTO from '../dtos/login-response.dto';
import fornecedorService from './fornecedor.service';
import CarregaSessaoRequestDTO from '../dtos/carrega-sessao-request.dto';
import RegistroRequestDTO from '../dtos/registro-request.dto';
import emailRedefinicaoSenhaJob from '../jobs/email-redefinicao-senha.job';
import EmailRedefinicaoSenhaRequestDTO from '../dtos/email-redefinicao-senha-request.dto';
import RedefineSenhaRequestDTO from '../dtos/redefine-senha-request.dto';
import ErroException from '@exceptions/erro.exception';
import ConfirmaCadastroRequestDTO from '../dtos/confirma-cadastro-request.dto';
import ConfirmaCadastroResponseDTO from '../dtos/confirma-cadastro-response.dto';
import RedefineSenhaDTO from '../dtos/redefine-senha.dto';
import objectUtil from '@utils/object.util';
import usuarioRepository from '@modules/core/usuarios/repositories/usuario.repository';
import dotenv from 'dotenv';
dotenv.config();

const FORNECEDOR = Number(process.env.ROLE_FORNECEDOR);
const TRANSPORTADORA = Number(process.env.ROLE_TRANSPORTADORA);

async function login({ email, senha }: LoginRequestDTO): Promise<LoginResponseDTO> {
  const usuario = await usuarioService.obterUsuarioPorEmail(email);

  if (!usuario) {
    throw new ErroException('Usuário não encontrado');
  }

  const senhaLimpa = encryptacaoUtil.descriptar(usuario.senha);

  if (senha !== senhaLimpa) {
    console.error('Senha inválida.');
    throw new ErroException('Não foi possivel efetuar o login');
  }

  if (usuario.role === FORNECEDOR || usuario.role === TRANSPORTADORA) {
    const contaAtivada = await verificarContaAtivada(usuario);
    if (!contaAtivada) {
      throw new ErroException('Conta não ativada');
    }
  }

  const token = jwtUtil.sign({
    expiracao: Number(process.env.TEMPO_EXPIRACAO_TOKEN_JWT),
    chave: process.env.CHAVE_TOKEN_JWT,
    payload: {
      usuario_id: usuario.id,
      role: usuario.role,
      setores: usuario.setores?.map((setor) => setor.id),
      grupos: usuario.grupos?.map((grupo) => grupo.id),
      acessos: usuario.acessos?.map((acesso) => acesso.id),
    },
  });

  await usuarioRepository.atualizar({
    ...usuario,
    online: 1,
  });

  await logAcessosService.registrar({
    usuario_id: usuario.id,
    datahora_login: new Date(),
  });

  return {
    token,
    tokenHub: await hubUtil.obterTokenAcessoHub(),
  };
}

async function verificarContaAtivada(usuario: Usuario) {
  const fornecedor = await usuarioFornecedorRepository.obterPorUsuario(usuario.id);
  if (!fornecedor) throw new ErroException('Fornecedor não encontrado');
  return fornecedor.ativo;
}

async function registrar(dados: RegistroRequestDTO) {
  await fornecedorService.registrar(dados);
}

async function carregarSessao({ token }: CarregaSessaoRequestDTO) {
  const { usuario_id, role } = jwtUtil.decode<{ usuario_id: number; role: number }>(token);

  let usuario = await usuarioService.obterPorId(usuario_id);

  if (!usuario) throw new ErroException('Usuário não encontrado');

  if (role === FORNECEDOR || role === TRANSPORTADORA) {
    return await fornecedorService.carregarSessao(usuario);
  }
  return usuario;
}

async function enviarEmailRedefinicaoSenha({ email }: EmailRedefinicaoSenhaRequestDTO) {
  if (!email) throw new ErroException('Email não informado');
  const usuario = await usuarioService.obterUsuarioPorEmail(email);

  if (!usuario) throw new ErroException('Email não cadastrado');

  const token = jwtUtil.sign({
    payload: { usuarioId: usuario.id },
    expiracao: Number(process.env.TEMPO_EXPIRACAO_REDEFINICAO_SENHA),
    chave: process.env.CHAVE_TOKEN_JWT,
  });

  await emailRedefinicaoSenhaJob.add({ nome: usuario.nome, email, token });
}

async function redefinirSenha(dto: RedefineSenhaRequestDTO): Promise<void> {
  if (!objectUtil.isCamposExiste(dto, ['token', 'senha', 'confirmacaoSenha'])) {
    throw new ErroException('Não foi possivel redefinir sua senha');
  }

  const isValido = jwtUtil.validate({ token: dto.token, chave: process.env.CHAVE_TOKEN_JWT });

  if (!isValido) {
    throw new ErroException('Link expirado');
  }

  const { usuarioId } = jwtUtil.decode<RedefineSenhaDTO>(dto.token);

  await usuarioService.redefinirSenha({ id: usuarioId, senha: dto.senha, confirmacaoSenha: dto.confirmacaoSenha });
}

async function confirmarCadastro({ token }: ConfirmaCadastroRequestDTO): Promise<ConfirmaCadastroResponseDTO> {
  return await fornecedorService.confirmarCadastro({ token });
}

async function logout(token: string) {
  if (!token) throw new ErroException('Token não encontrado');
  const { usuario_id } = jwtUtil.decode<{ usuario_id: number }>(token);

  let usuario = await usuarioService.obterPorId(usuario_id);

  if (!usuario) throw new ErroException('Usuário não encontrado');

  await usuarioRepository.atualizar({
    ...usuario,
    online: 0,
  });
}

export default {
  login,
  registrar,
  carregarSessao,
  enviarEmailRedefinicaoSenha,
  redefinirSenha,
  confirmarCadastro,
  logout,
};
