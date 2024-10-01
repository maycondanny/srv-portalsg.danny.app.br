export enum EGrupos {
  Fornecedores_Externos = 1,
  Administracao = 5,
  Transportadora = 10,
}

export default interface Grupo {
  id: number;
  nome: string;
  setor_id: number;
  ativo: number;
}
