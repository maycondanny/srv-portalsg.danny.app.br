import UsuarioModulo from '../models/usuario-modulo.model';
import usuarioModuloRepository from '../repositories/usuario-modulo.repository';

async function cadastrar(usuarioModulos: UsuarioModulo[]): Promise<void> {
  return await usuarioModuloRepository.cadastrar(usuarioModulos);
}

async function obterPorUsuarioId(usuarioId: number): Promise<UsuarioModulo[]> {
  return await usuarioModuloRepository.obterPorUsuarioId(usuarioId);
}

export default {
  cadastrar,
  obterPorUsuarioId,
};
