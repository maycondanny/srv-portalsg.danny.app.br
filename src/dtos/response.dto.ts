export default interface ResponseDTO<T = any> {
  statusCode?: number;
  mensagem?: string;
  dados?: T;
}
