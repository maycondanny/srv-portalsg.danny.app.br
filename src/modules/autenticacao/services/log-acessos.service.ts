import LogAcesso from '../models/usuario-acesso-log.model';
import logAcessosRepository from '../repositories/log-acessos.repository';

async function registrar({ usuario_id, datahora_login }: LogAcesso) {
  await logAcessosRepository.salvar({ usuario_id, datahora_login });
};

export default {
  registrar,
};
