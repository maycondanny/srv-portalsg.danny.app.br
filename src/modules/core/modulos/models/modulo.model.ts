import SubModulo from "@modules/core/submodulos/models/submodulo.model";

export default interface Modulo {
  id?: number;
  nome: string;
  descricao: string;
  url: string;
  icone_id: number;
  setor_id: number;
  submodulos: SubModulo[];
  created_at?: Date;
  updated_at?: Date;
}

