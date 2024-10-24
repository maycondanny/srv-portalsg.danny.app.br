import submoduloRepository from '../repositories/submodulo.repository';
import ErroException from '@exceptions/erro.exception';
import dotenv from 'dotenv';
import SubModulo from '../models/submodulo.model';
dotenv.config();

async function cadastrar(submodulo: SubModulo): Promise<void> {
  if (!submodulo) throw new ErroException('Submodulo não encontrado.');
  await submoduloRepository.cadastrar(submodulo);
}

async function obterTodos(): Promise<SubModulo[]> {
  return await submoduloRepository.obterTodos();
}

async function obterPorModuloId(moduloId: number): Promise<SubModulo[]> {
  const submodulo = await submoduloRepository.obterPorModuloId(moduloId);
  if (!submodulo) throw new ErroException('Submodulo não encontrado.');
  return submodulo;
}

async function removerPorModuloId(moduloId: number): Promise<void> {
  if (!moduloId) {
    throw new ErroException('Modulo não informado');
  }
  await submoduloRepository.removerPorModuloId(moduloId);
}

async function remover(id: number): Promise<void> {
  if (!id) {
    throw new ErroException('Submodulo não informado');
  }
  await submoduloRepository.remover(id);
}

async function atualizar(submodulo: SubModulo): Promise<void> {
  if (!submodulo) {
    throw new ErroException('Submodulo não encontrado');
  }
  await submoduloRepository.atualizar(submodulo);
}

export default {
  cadastrar,
  obterPorModuloId,
  removerPorModuloId,
  obterTodos,
  remover,
  atualizar,
};
