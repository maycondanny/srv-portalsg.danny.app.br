import ErroException from '@exceptions/erro.exception';
import Acesso from '../models/acesso.model';
import acessoRepository from '../repositories/acesso.repository';

const DESATIVADO = 0;
const ATIVADO = 1;

async function obterTodos(ativo?: boolean): Promise<Acesso[]> {
  return await acessoRepository.obterTodos(ativo);
};

async function obterTodosPorSetores(setores: number[]): Promise<Acesso[]> {
  if (!setores) {
    throw new ErroException("Setores não informados");
  }
  return await acessoRepository.obterTodosPorSetores(setores);
};

async function cadastrar(acesso: Acesso) {
  await acessoRepository.cadastrar(acesso);
};

async function ativar(acesso: Acesso) {
  await acessoRepository.atualizar({ ...acesso, ativo: ATIVADO });
};

async function desativar(acesso: Acesso) {
  await acessoRepository.atualizar({ ...acesso, ativo: DESATIVADO });
};

async function atualizar(acesso: Acesso) {
  await acessoRepository.atualizar(acesso);
};

export default {
  obterTodos,
  obterTodosPorSetores,
  cadastrar,
  ativar,
  desativar,
  atualizar,
};
