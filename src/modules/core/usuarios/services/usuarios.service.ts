import Usuario from '../models/usuario.model';
import encryptacaoUtil from '@utils/encryptacao.util';
import usuariosRepository from '../repositories/usuarios.repository';
import ErroException from '@exceptions/erro.exception';
import dotenv from 'dotenv';
dotenv.config();

async function cadastrar(usuario: Usuario): Promise<number> {
  try {
    const usuarioExiste = await obterUsuarioPorEmail(usuario.email);
    if (usuarioExiste) {
      throw new ErroException('O email fornecido já está sendo utilizado');
    }
    usuario.senha = encryptacaoUtil.encriptar(usuario.senha || process.env.SENHA_PADRAO_NOVO_USUARIO);
    return await usuariosRepository.cadastrar(usuario);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterTodos(): Promise<any[]> {
  let usuarios = await usuariosRepository.obterTodos();

  return await Promise.all(
    usuarios.map(async (usuario) => {
      usuario.senha = encryptacaoUtil.descriptar(usuario.senha);
      const grupos = await obterGrupos(usuario.id);
      const acessos = await obterAcessos(usuario.id);
      const setores = await obterSetores(usuario.id);

      return {
        ...usuario,
        grupos,
        acessos,
        setores,
      };
    })
  );
}

async function obterPorId(id: number): Promise<any> {
  const usuario = await usuariosRepository.obterPorId(id);

  if (!usuario) throw new ErroException('Usuario não encontrado.');

  const grupos = await obterGrupos(id);
  const acessos = await obterAcessos(id);
  const setores = await obterSetores(id);

  return {
    ...usuario,
    grupos,
    acessos,
    setores,
  };
}

async function obterUsuarioPorEmail(email: string): Promise<any> {
  const usuario = await usuariosRepository.obterUsuarioPorEmail(email);

  if (!usuario) return false;

  const grupos = await obterGrupos(usuario.id);
  const acessos = await obterAcessos(usuario.id);
  const setores = await obterSetores(usuario.id);

  return {
    ...usuario,
    grupos,
    acessos,
    setores,
  };
}

async function atualizar(usuario: Usuario) {
  try {
    const usuarioDados = await obterPorId(usuario.id);
    const usuarioExiste = await obterUsuarioPorEmail(usuario.email);
    if (usuarioDados.email !== usuarioExiste.email && usuarioExiste) {
      throw new ErroException('O email fornecido já está sendo usado.');
    }
    usuario.senha = encryptacaoUtil.encriptar(usuario.senha);
    await usuariosRepository.atualizar(usuario);
    return await obterPorId(usuario.id);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterSetores(usuario_id: number): Promise<any[]> {
  return await usuariosRepository.obterSetores(usuario_id);
}

async function obterGrupos(usuario_id: number): Promise<any[]> {
  return await usuariosRepository.obterGrupos(usuario_id);
}

async function obterAcessos(usuario_id: number): Promise<any[]> {
  return await usuariosRepository.obterAcessos(usuario_id);
}

async function trocarSenhaPrimeiroAcesso({ id, senha }) {
  try {
    const usuario = await obterPorId(id);
    if (!usuario) {
      throw new ErroException('Usuario não encontrado!');
    }
    usuario.senha = encryptacaoUtil.encriptar(senha);
    usuario.troca_senha = 1;
    await usuariosRepository.atualizar(usuario);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function redefinirSenha({ id, senha, confirmacaoSenha }) {
  try {
    const usuario = await obterPorId(id);
    if (!usuario) throw new ErroException('Usuario não encontrado!');
    if (!checarSenhasIguais(senha, confirmacaoSenha)) throw new ErroException('As senhas não correspondem');
    usuario.senha = encryptacaoUtil.encriptar(senha);
    await usuariosRepository.atualizar(usuario);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterPorCNPJ(cnpj: string) {
  const usuario = await usuariosRepository.obterPorCNPJ(cnpj);

  if (!usuario) return false;

  const grupos = await obterGrupos(usuario.id);
  const acessos = await obterAcessos(usuario.id);
  const setores = await obterSetores(usuario.id);

  return {
    ...usuario,
    grupos,
    acessos,
    setores,
  };
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
};
