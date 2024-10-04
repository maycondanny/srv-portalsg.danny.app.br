import dataUtil from '@utils/data.util';
import Aviso from '../models/aviso.model';
import avisoRepository from '../repositories/aviso.repository';
import ErroException from '@exceptions/erro.exception';

async function obterAtivo(): Promise<Aviso> {
  const dataHoraAgora = dataUtil.obterHorarioBrasilia(new Date().toISOString());
  const aviso = await avisoRepository.obterUltimo();

  if (!aviso) return;

  const dataInicioBrasilia = dataUtil.obterHorarioBrasilia(aviso.data_inicio);
  const dataFimBrasilia = dataUtil.obterHorarioBrasilia(aviso.data_fim);

  if (dataHoraAgora >= dataInicioBrasilia && dataHoraAgora <= dataFimBrasilia) {
    return {
      ...aviso,
      data_inicio: dataInicioBrasilia,
      data_fim: dataFimBrasilia,
    };
  }
}

async function obterTodos(): Promise<Aviso[]> {
  const avisos = await avisoRepository.obterTodos();
  return avisos?.map((aviso, index) => ({
    mensagem: aviso.mensagem,
    data_inicio: dataUtil.obterHorarioBrasilia(aviso.data_inicio),
    data_fim: dataUtil.obterHorarioBrasilia(aviso.data_fim),
    data_criacao: dataUtil.obterHorarioBrasilia(aviso.created_at),
    ativo: index === 0 ? true : false,
  }));
}

async function cadastrar(aviso: Aviso) {
  if (!aviso) throw new ErroException('Dados do aviso não informados');
  await avisoRepository.cadastrar(aviso);
}

export default {
  cadastrar,
  obterTodos,
  obterAtivo,
};
