import Setor from '../models/setor.model';
import setorRepository from '../repositories/setor.repository';

const DESATIVADO = 0;
const ATIVADO = 1;

async function obterTodos(ativo?: boolean): Promise<Setor[]> {
  return await setorRepository.obterTodos(ativo);
};

async function cadastrar(setor: Setor): Promise<void> {
  await setorRepository.cadastrar(setor);
};

async function atualizar(setor: Setor): Promise<void> {
  await setorRepository.atualizar(setor);
};

async function ativar(setor: Setor) {
  await setorRepository.atualizar({ ...setor, ativo: ATIVADO });
};

async function desativar(setor: Setor) {
  await setorRepository.atualizar({ ...setor, ativo: DESATIVADO });
};

export default {
  obterTodos,
  cadastrar,
  atualizar,
  ativar,
  desativar,
};
