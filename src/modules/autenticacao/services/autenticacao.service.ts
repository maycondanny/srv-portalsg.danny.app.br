import usuariosService from '@modules/core/usuarios/services/usuarios.service';
import LoginRequestDTO from '../dtos/login-request.dto';
import encryptacaoUtil from '@utils/encryptacao.util';
import { ERole } from '@modules/core/usuarios/models/usuario-role.model';
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

const TEMPO_EXPIRACAO_REDEFINICAO_SENHA = 15 * 60;

async function login({ email, senha }: LoginRequestDTO): Promise<LoginResponseDTO> {
  const usuario = await usuariosService.obterUsuarioPorEmail(email);

  if (!usuario) {
    throw new ErroException('Usuário não encontrado');
  }

  const senhaLimpa = encryptacaoUtil.descriptar(usuario.senha);

  if (senha !== senhaLimpa) {
    console.error('Senha inválida.');
    throw new ErroException('Não foi possivel efetuar o login');
  }

  if (usuario.role === ERole.FORNECEDOR || usuario.role === ERole.TRANSPORTADORA) {
    const contaAtivada = await verificarContaAtivada(usuario);
    if (!contaAtivada) {
      throw new ErroException('Conta não ativada');
    }
  }

  const token = jwtUtil.sign({
    payload: {
      usuario_id: usuario.id,
      role: usuario.role,
      setores: usuario.setores?.map((setor) => setor.id),
      grupos: usuario.grupos?.map((grupo) => grupo.id),
      acessos: usuario.acessos?.map((acesso) => acesso.id),
    },
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
  const { usuario_id, role } = jwtUtil.decode<{ usuario_id: number; role: ERole }>(token);

  let usuario = await usuariosService.obterPorId(usuario_id);

  if (!usuario) throw new ErroException('Usuário não encontrado');

  if (role === ERole.FORNECEDOR || role === ERole.TRANSPORTADORA) {
    return await fornecedorService.carregarSessao(usuario);
  }
  return usuario;
}

async function enviarEmailRedefinicaoSenha({ email }: EmailRedefinicaoSenhaRequestDTO) {
  if (!email) throw new ErroException('Email não informado');
  const usuario = await usuariosService.obterUsuarioPorEmail(email);

  if (!usuario) throw new ErroException('Email não cadastrado');

  const token = jwtUtil.sign({ payload: { id: usuario.id }, expiracao: TEMPO_EXPIRACAO_REDEFINICAO_SENHA });
  await emailRedefinicaoSenhaJob.add({ nome: usuario.nome, email, token });
}

async function redefinirSenha({ usuarioId, senha, confirmacaoSenha }: RedefineSenhaRequestDTO) {
  await usuariosService.redefinirSenha({ id: usuarioId, senha, confirmacaoSenha });
}

export default {
  login,
  registrar,
  carregarSessao,
  enviarEmailRedefinicaoSenha,
  redefinirSenha,
};
