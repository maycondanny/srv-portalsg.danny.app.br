import { Ean } from '@modules/comercial/produtos/models/ean.model';
import { Imagem } from '@modules/comercial/produtos/models/ecommerce.model';
import { ESiglaEstado } from '@modules/core/estados/models/estado.model';

export interface ProdutoDTO {
  id?: number;
  codigo_produto_fornecedor: string;
  descritivo_pdv: string;
  descritivo: string;
  origem: string;
  estado: ESiglaEstado;
  preco: number;
  desconto_p: number;
  eans: Ean[];
  duns: Ean[];
  pesob: number;
  pesol: number;
  altura: number;
  largura: number;
  comprimento: number;
  validade: number;
  qtde_embalagem: number;
  comprimento_d: number;
  largura_d: number;
  altura_d: number;
  classificacao_fiscal: string;
  st_compra: string;
  icms_compra: number;
  ipi: number;
  pis_cofins: string;
  descricao: string;
  caracteristica: string;
  modo_uso: string;
  imagens: Imagem[];
  status: number;
  fornecedor_id: number;
}
