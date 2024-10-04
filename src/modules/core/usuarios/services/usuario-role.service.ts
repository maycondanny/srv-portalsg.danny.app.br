import UsuarioRole from '../models/usuario-role.model';
import usuarioRoleRepository from '../repositories/usuario-role.repository';

async function obterTodos(): Promise<UsuarioRole[]> {
  return await usuarioRoleRepository.obterTodos();
}

export default {
  obterTodos,
};
