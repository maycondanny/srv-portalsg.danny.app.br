import ErroException from '@exceptions/erro.exception';
import UsuarioRole from '../models/usuario-role.model';
import usuarioRoleRepository from '../repositories/usuario-role.repository';

async function obterTodos(): Promise<UsuarioRole[]> {
  return await usuarioRoleRepository.obterTodos();
}

async function remover(roleId: number): Promise<void> {
  if (!roleId) {
    throw new ErroException('Função não informada');
  }
  await usuarioRoleRepository.remover(roleId);
}

async function atualizar(role: UsuarioRole): Promise<void> {
  if (!role) {
    throw new ErroException('Função não encontrada');
  }
  await usuarioRoleRepository.atualizar(role);
}

async function cadastrar(role: UsuarioRole): Promise<void> {
  if (!role) {
    throw new ErroException('Função não encontrada');
  }
  await usuarioRoleRepository.cadastrar(role);
}

export default {
  cadastrar,
  atualizar,
  remover,
  obterTodos,
};
