import excelUtil from '@utils/excel.util';
import produtoDto, { ProdutoDTO } from '../dtos/produto.dto';
import formatacaoUtil from '@utils/formatacao.util';
import stringUtil from '@utils/string.util';
import ErroException from '@exceptions/erro.exception';
import ImportacaoService from './importacao.service';
import httpStatusEnum from '@enums/http-status.enum';

jest.mock('@utils/excel.util');
jest.mock('@utils/formatacao.util');
jest.mock('@utils/string.util');
jest.mock('../dtos/produto.dto');
jest.mock('../dtos/importacao.request.dto');
jest.mock('@enums/http-status.enum');

const excelUtilMock = excelUtil as jest.Mocked<typeof excelUtil>;
const formatacaoUtilMock = formatacaoUtil as jest.Mocked<typeof formatacaoUtil>;
const stringUtilMock = stringUtil as jest.Mocked<typeof stringUtil>;
const produtoDtoMock = produtoDto as jest.Mocked<typeof produtoDto>;

describe('ImportacaoServiceTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar um erro se a planilha não for fornecida', async () => {
    await expect(ImportacaoService.importar({ planilha: null, fornecedorId: 1 })).rejects.toThrow(
      new ErroException('Planilha não enviada', httpStatusEnum.Status.ERRO_REQUISICAO)
    );
  });

  it('deve lançar um erro se o fornecedorId não for fornecido', async () => {
    await expect(
      ImportacaoService.importar({ planilha: { buffer: Buffer.from('') }, fornecedorId: null })
    ).rejects.toThrow(new ErroException('Fornecedor não encontrado', httpStatusEnum.Status.ERRO_REQUISICAO));
  });

  it('deve lançar um erro se a planilha estiver vazia', async () => {
    excelUtilMock.lerDados.mockReturnValue([]);

    await expect(
      ImportacaoService.importar({ planilha: { buffer: Buffer.from('') }, fornecedorId: 1 })
    ).rejects.toThrow(new ErroException('A planilha importada está vazia, tente novamente.'));
  });

  it('deve processar corretamente produtos válidos e lançar erro para produtos inválidos', async () => {
    excelUtilMock.lerDados.mockReturnValue(obterProdutoObrigatoriosPlanilha());

    const produtoDTO = {
      codigo_produto_fornecedor: '123',
      descritivo: 'Produto Teste',
      estado: 25,
      preco: 3,
      largura: 3,
      altura: 3,
      comprimento: 3,
      ipi: 3,
      st_compra: '060',
      icms_compra: 3,
      validade: 12,
      classificacao_fiscal: '32001214',
      caracteristica: 'teste',
      imagens: 'teste',
      pesob: 3,
      pesol: 3,
      eans: [{ codigo: '123456789' }],
    } as ProdutoDTO;

    stringUtilMock.cortar.mockImplementation((texto) => texto);
    stringUtilMock.removerEspacosLaterais.mockImplementation((texto) => texto);
    formatacaoUtilMock.paraDecimal.mockImplementation((valor) => Number(valor));
    formatacaoUtilMock.paraNumerico.mockImplementation((valor) => Number(valor));
    produtoDtoMock.criarProduto.mockReturnValue(produtoDTO);

    await expect(
      ImportacaoService.importar({ planilha: { buffer: Buffer.from('') }, fornecedorId: 1 })
    ).resolves.not.toThrow();
  });

  it('deve lançar um erro se houver produtos inválidos', async () => {
    excelUtilMock.lerDados.mockReturnValue([{ 'CODIGO INTERNO DO PRODUTO FORNECEDOR': '', EAN: '' }]);

    await expect(
      ImportacaoService.importar({ planilha: { buffer: Buffer.from('') }, fornecedorId: 1 })
    ).rejects.toThrow(
      new ErroException(
        'Todos os campos em laranja na planilha devem ser preenchidos.',
        httpStatusEnum.Status.ERRO_REQUISICAO,
        { produtos: ['O produto com EAN undefined não foi preenchido corretamente.'] }
      )
    );
  });
});

function obterProdutoObrigatoriosPlanilha() {
  return [
    {
      'CODIGO INTERNO DO PRODUTO FORNECEDOR': '123',
      'DESCRIÇÃO COMPLETA': 'Produto Teste',
      'UF FATURAMENTO': 'SP',
      'PREÇO CUSTO': '3',
      EAN: '3465444654',
      'PESO BRUTO(KG)': '3',
      'PESO LIQUIDO': '3',
      ALTURA: '3',
      LARGURA: '3',
      COMPRIMENTO: '3',
      'VALIDADE DO PRODUTO (MESES)': '12',
      NCM: '32001214',
      'CÓDIGO SUBSTITUIÇÃO TRIBUTÁRIA': '060',
      IPI: '3',
      ICMS: '3',
      'DESCRIÇÃO DETALHADA DO SKU': 'teste',
      'Link para vídeos e Imagens': 'teste',
    },
  ];
}
