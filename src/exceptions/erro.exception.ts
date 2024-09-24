import httpStatusEnum from '@enums/http-status.enum';

export default class ErroException<T> extends Error {
  public readonly codigo: number;
  public readonly dados: T;

  constructor(mensagem: string, dados?: T, codigo: number = httpStatusEnum.Status.ERRO_INTERNO_SERVIDOR) {
    super(mensagem);
    this.name = this.constructor.name;
    this.codigo = codigo;
    this.dados = dados;
    Error.captureStackTrace(this, this.constructor);
  }
}
