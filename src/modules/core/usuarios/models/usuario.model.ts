import Acesso from "@modules/core/acessos/models/acesso.model";
import { ERole } from "./usuario-role.model";
import Grupo from "@modules/core/grupos/models/grupo.model";
import Setor from "@modules/core/setores/models/setor.model";

export default interface Usuario {
  id?: number;
  nome: string;
  senha: string;
  email: string;
  grupos: Grupo[];
  acessos: Acesso[];
  setores: Setor[];
  role: ERole;
  troca_senha?: number;
  online?: number;
  created_at?: Date;
  updated_at?: Date;
}
