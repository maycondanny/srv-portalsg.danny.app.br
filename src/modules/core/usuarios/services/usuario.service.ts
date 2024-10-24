import Usuario from '../models/usuario.model';
import encryptacaoUtil from '@utils/encryptacao.util';
import usuarioRepository from '../repositories/usuario.repository';
import ErroException from '@exceptions/erro.exception';
import dotenv from 'dotenv';
import usuarioModuloService from './usuario-modulo.service';
import _ from 'lodash';
dotenv.config();

async function cadastrar(usuario: Usuario): Promise<number> {
  const usuarioExiste = await obterUsuarioPorEmail(usuario.email);
  if (usuarioExiste) {
    throw new ErroException('O email fornecido já está sendo utilizado');
  }
  usuario.senha = encryptacaoUtil.encriptar(usuario.senha || process.env.SENHA_PADRAO_NOVO_USUARIO);
  return await usuarioRepository.cadastrar(usuario);
}

async function obterTodos(): Promise<any[]> {
  let usuarios = await usuarioRepository.obterTodos();

  return await Promise.all(
    usuarios.map(async (usuario) => {
      usuario.senha = encryptacaoUtil.descriptar(usuario.senha);
      const setores = await obterSetores(usuario.id);
      const modulos = await usuarioModuloService.obterPorUsuarioId(usuario.id);

      return {
        ...usuario,
        setores,
        modulos,
      };
    })
  );
}

async function obterPorId(id: number): Promise<any> {
  const usuario = await usuarioRepository.obterPorId(id);

  if (!usuario) throw new ErroException('Usuario não encontrado.');

  const setores = await obterSetores(id);
  const modulos = await usuarioModuloService.obterPorUsuarioId(id);

  return {
    ...usuario,
    setores,
    modulos,
  };
}

async function obterUsuarioPorEmail(email: string): Promise<any> {
  const usuario = await usuarioRepository.obterUsuarioPorEmail(email);

  if (!usuario) return false;

  const setores = await obterSetores(usuario.id);
  const modulos = await usuarioModuloService.obterPorUsuarioId(usuario.id);

  return {
    ...usuario,
    setores,
    modulos,
  };
}

async function atualizar(usuario: Usuario) {
  const usuarioDados = await obterPorId(usuario.id);
  const usuarioExiste = await obterUsuarioPorEmail(usuario.email);
  if (usuarioDados.email !== usuarioExiste.email && usuarioExiste) {
    throw new ErroException('O email fornecido já está sendo usado.');
  }
  usuario.senha = encryptacaoUtil.encriptar(usuario.senha);
  await usuarioRepository.atualizar(usuario);
  await usuarioModuloService.cadastrar(
    _.map(usuario.modulos, (modulo) => ({ modulo_id: modulo.id, usuario_id: usuario.id }))
  );
  return await obterPorId(usuario.id);
}

async function obterSetores(usuario_id: number): Promise<any[]> {
  return await usuarioRepository.obterSetores(usuario_id);
}

async function trocarSenhaPrimeiroAcesso({ id, senha }) {
  if (!id) {
    throw new ErroException('ID do usuario não enviado');
  }

  if (!senha) {
    throw new ErroException('Nova senha do usuario não enviada');
  }

  const usuario = await obterPorId(id);
  if (!usuario) {
    throw new ErroException('Usuario não encontrado');
  }
  usuario.senha = encryptacaoUtil.encriptar(senha);
  usuario.troca_senha = 1;
  await usuarioRepository.atualizar(usuario);
}

async function redefinirSenha({ id, senha, confirmacaoSenha }) {
  const usuario = await obterPorId(id);
  if (!usuario) throw new ErroException('Usuario não encontrado!');
  if (!checarSenhasIguais(senha, confirmacaoSenha)) throw new ErroException('As senhas não correspondem');
  usuario.senha = encryptacaoUtil.encriptar(senha);
  await usuarioRepository.atualizar(usuario);
}

async function obterPorCNPJ(cnpj: string) {
  const usuario = await usuarioRepository.obterPorCNPJ(cnpj);

  if (!usuario) return false;

  const setores = await obterSetores(usuario.id);
  const modulos = await usuarioModuloService.obterPorUsuarioId(usuario.id);

  return {
    ...usuario,
    setores,
    modulos,
  };
}

async function obterTodosOnline(): Promise<Usuario[]> {
  return await usuarioRepository.obterTodosOnline();
}

function checarSenhasIguais(senha: string, confirmacaoSenha: string) {
  return senha === confirmacaoSenha;
}

export default {
  obterUsuarioPorEmail,
  obterPorId,
  obterTodos,
  atualizar,
  cadastrar,
  trocarSenhaPrimeiroAcesso,
  obterPorCNPJ,
  redefinirSenha,
  obterTodosOnline,
};
