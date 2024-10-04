import Grupo from '../models/grupo.model';
import grupoRepository from '../repositories/grupo.repository';

const DESATIVADO = 0;
const ATIVADO = 1;

async function obterPorSetores(setores: number[]): Promise<Grupo[]> {
  return await grupoRepository.obterPorSetores(setores);
}

async function obterTodos(ativo?: boolean): Promise<Grupo[]> {
  return await grupoRepository.obterTodos(ativo);
}

async function cadastrar(grupo: Grupo) {
  await grupoRepository.cadastrar(grupo);
}

async function ativar(grupo: Grupo) {
  await grupoRepository.atualizar({ ...grupo, ativo: ATIVADO });
}

async function desativar(grupo: Grupo) {
  await grupoRepository.atualizar({ ...grupo, ativo: DESATIVADO });
}

async function atualizar(grupo: Grupo) {
  await grupoRepository.atualizar(grupo);
}

export default {
  obterPorSetores,
  obterTodos,
  cadastrar,
  ativar,
  desativar,
  atualizar,
};
