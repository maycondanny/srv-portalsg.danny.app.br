import httpStatusEnum from '@enums/http-status.enum';
import ErroException from '@exceptions/erro.exception';
import jwtUtil from '@utils/jwt.util';
import dotenv from 'dotenv';
dotenv.config();

function obterUrl(id: number): string {
  if (!id) {
    throw new ErroException('Dashboard não informado', {}, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  const url = process.env.METABASE_SITE_URL;
  const secret = process.env.METABASE_SECRET_KEY;
  const expiresIn = process.env.METABASE_EXPIRES;

  const payload = {
    resource: { dashboard: Number(id) },
    params: {}
  };

  const token = jwtUtil.sign<any>({
    payload,
    chave: secret,
    expiracao: Number(expiresIn)
  });

  return url + '/embed/dashboard/' + token + '#bordered=true&titled=true&theme=night';
}

export default {
  obterUrl,
};
