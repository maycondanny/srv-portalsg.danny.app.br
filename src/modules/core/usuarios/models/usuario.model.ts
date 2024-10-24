import Setor from '@modules/core/setores/models/setor.model';
import Modulo from '@modules/core/modulos/models/modulo.model';

export default interface Usuario {
  id?: number;
  nome: string;
  senha: string;
  email: string;
  setores: Setor[];
  modulos: Modulo[];
  role: number;
  troca_senha?: number;
  online?: number;
  created_at?: Date;
  updated_at?: Date;
}
