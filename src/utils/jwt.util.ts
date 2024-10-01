import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface SignProps<T> {
  payload: T;
  expiracao?: number;
  chave?: string;
}

interface ValidateProps {
  token: string;
  chave?: string;
}

function sign<T>({
  payload,
  expiracao = Number(process.env.EXPIRACAO_TOKEN_JWT),
  chave = process.env.CHAVE_TOKEN_JWT,
}: SignProps<T>): string {
  return jwt.sign(
    {
      exp: expiracao,
      ...payload,
    },
    chave
  );
}

function decode<T>(token: string): T {
  return jwt.decode(token) as T;
}

function validate({ token, chave = process.env.CHAVE_TOKEN_JWT }: ValidateProps): boolean {
  try {
    return jwt.verify(token, chave) ? true : false;
  } catch (erro) {
    return false;
  }
}

export default {
  sign,
  decode,
  validate,
};
