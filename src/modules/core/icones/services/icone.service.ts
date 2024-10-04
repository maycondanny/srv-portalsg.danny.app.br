import ErroException from '@exceptions/erro.exception';
import Icone from '../models/icone.model';
import iconeRepository from '../repositories/icone.repository';

async function cadastrar(icone: Icone) {
  if (!icone) throw new ErroException("Icone não informado");
  await iconeRepository.salvar(icone);
}

async function obterTodos(): Promise<Icone[]> {
  return await iconeRepository.obterTodos();
}

async function obterPorId(id: number): Promise<Icone> {
  if (!id) throw new ErroException("ID do icone não informado");
  return await iconeRepository.obterPorId(id);
}

export default {
  cadastrar,
  obterTodos,
  obterPorId,
};
