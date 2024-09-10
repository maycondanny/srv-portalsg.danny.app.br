import ProdutoService from './produto.service';
import { ProdutoDTO } from '../dtos/produto.dto';

describe('ProdutoServiceTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve cadastrar produto com sucesso', async () => {
    const dto: ProdutoDTO = {
      descritivo: 'teste',
      descritivo_pdv: 'teste',
      altura: 1,
      caracteristica: 'dsadas',
      classificacao_fiscal: '4564654',
      comprimento: 2,
      desconto_p: 1,
      descricao: 'teste',
      estado: 25,
      fornecedor_id: 1,
      icms_compra: 1,
      imagens: 'dsadsadsad',
      ipi: 1,
      largura: 1,
      modo_uso: 'teste',
      origem: 1,
      pesob: 1,
      pesol: 1,
      pis_cofins: 'M',
      preco: 1,
      qtde_embalagem: 1,
      st_compra: '060',
      validade: 1,
      eans: [{ codigo_ean: '41545644' }],
      duns: [{ codigo_ean: '32132131' }],
      altura_d: 1,
      codigo_produto_fornecedor: '3213213',
      comprimento_d: 1,
      largura_d: 1,
    };
    await expect(ProdutoService.cadastrar(dto)).resolves.not.toThrow();
  });
});
