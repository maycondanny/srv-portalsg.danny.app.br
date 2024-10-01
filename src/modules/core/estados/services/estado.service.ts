import { Estado } from '../models/estado.model';
import estadoRepository from '../repositories/estado.repository';

async function obterTodos(): Promise<Estado[]> {
  return await estadoRepository.obterTodos();
}

export default {
  obterTodos,
};
