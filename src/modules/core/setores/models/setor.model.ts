export enum ESetores {
  Comercial = 1,
  Admin = 2,
  BI = 3,
}

export default interface Setor {
  id: number;
  nome: string;
  ativo: number;
}
