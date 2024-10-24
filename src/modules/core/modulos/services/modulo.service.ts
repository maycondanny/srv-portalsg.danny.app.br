import moduloRepository from '../repositories/modulo.repository';
import ErroException from '@exceptions/erro.exception';
import dotenv from 'dotenv';
import Modulo from '../models/modulo.model';
import submoduloService from '@modules/core/submodulos/services/submodulo.service';
import _ from 'lodash';
dotenv.config();

async function cadastrar(modulo: Modulo): Promise<void> {
  if (!modulo) {
    throw new ErroException('Modulo não encontrado');
  }
  await moduloRepository.cadastrar(modulo);
}

async function obterTodos(): Promise<Modulo[]> {
  const modulos = await moduloRepository.obterTodos();
  return await Promise.all(
    _.map(modulos, async (modulo) => {
      const submodulos = await submoduloService.obterPorModuloId(modulo.id);
      return {
        ...modulo,
        submodulos,
      };
    })
  );
}

async function remover(moduloId: number): Promise<void> {
  if (!moduloId) {
    throw new ErroException('Modulo não informado');
  }
  await moduloRepository.remover(moduloId);
}

async function atualizar(modulo: Modulo): Promise<void> {
  if (!modulo) {
    throw new ErroException('Modulo não encontrado');
  }
  await moduloRepository.atualizar(modulo);
}

async function obterPorIds(ids: number[]): Promise<Modulo[]> {
  const modulos = await moduloRepository.obterPorIds(ids);
  return await Promise.all(
    _.map(modulos, async (modulo) => {
      const submodulos = await submoduloService.obterPorModuloId(modulo.id);
      return {
        ...modulo,
        submodulos,
      };
    })
  );
}

export default {
  cadastrar,
  obterTodos,
  obterPorIds,
  remover,
  atualizar,
};
