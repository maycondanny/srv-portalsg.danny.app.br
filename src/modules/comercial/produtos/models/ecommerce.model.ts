export default interface Ecommerce {
  id?: number;
  descricao: string;
  caracteristica: string;
  modo_uso: string;
  imagens: Imagem[];
  eans?: Ean[];
}

export interface Imagem {
  id?: number;
  url: string;
}

interface Ean {
  id?: number;
  codigo: string;
}
