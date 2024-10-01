import Grupo from '@modules/core/grupos/models/grupo.model';

export enum EAcessos {
  FE_ListagemProdutos = 1,
  FE_AgendamentoPedidos = 6,
  FE_Ecommerce = 14,
}

export default interface Acesso {
  id?: number;
  pagina: string;
  modulo: string;
  submodulo?: string;
  sub_submodulo?: string;
  tag: string;
  setor_id: string;
  setor?: string;
  icone_id?: number;
  ativo: number;
  grupos: Grupo[];
}
