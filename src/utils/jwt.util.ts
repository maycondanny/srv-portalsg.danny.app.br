import jwt from 'jsonwebtoken';

interface SignProps<T> {
  payload: T;
  expiracao: number;
  chave: string;
}

interface ValidateProps {
  token: string;
  chave: string;
}

function sign<T>({ payload, expiracao, chave }: SignProps<T>): string {
  const agora = Math.round(Date.now() / 1000);
  return jwt.sign(
    {
      exp: agora + expiracao,
      ...payload,
    },
    chave
  );
}

function decode<T>(token: string): T {
  return jwt.decode(token) as T;
}

function validate({ token, chave }: ValidateProps): boolean {
  try {
    return jwt.verify(token, chave) ? true : false;
  } catch (erro) {
    console.log(erro);
    return false;
  }
}

export default {
  sign,
  decode,
  validate,
};
