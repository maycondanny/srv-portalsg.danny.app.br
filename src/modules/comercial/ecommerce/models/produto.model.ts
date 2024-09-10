import Ean from './ean.model';
import Imagem from './imagem.model';

export default interface Produto {
  id?: number;
  produto_id?: number;
  produto_arius?: number;
  nome: string;
  marca?: number;
  depto?: number;
  secao?: number;
  modo_uso: string;
  descricao: string;
  caracteristica: string;
  destaque?: boolean;
  lancamento?: boolean;
  ativo?: boolean;
  status?: number;
  fornecedor_id: number;
  eans: Ean[];
  imagens: Imagem[];
}
