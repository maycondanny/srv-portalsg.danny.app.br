export default interface ResponseDTO<T = any> {
  mensagem?: string;
  dados?: T;
}
