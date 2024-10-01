import UsuarioRole from '../models/usuario-role.model';
import usuariosRoleRepository from '../repositories/usuarios-role.repository';

async function obterTodos(): Promise<UsuarioRole[]> {
  try {
    return await usuariosRoleRepository.obterTodos();
  } catch (erro) {
    console.error('Não foi possivel obter as roles dos usuarios.', erro);
    throw erro;
  }
}

export default {
  obterTodos,
};
