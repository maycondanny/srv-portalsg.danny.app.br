import getDbInstance from '@db/db';
import ErroException from '@exceptions/erro.exception';
import CapaProdutoResponseDTO from '../dtos/capa-produto-response.dto';
import _ from 'lodash';

async function obterTodosAgrupados(): Promise<CapaProdutoResponseDTO[]> {
  const db = getDbInstance();

  try {
    const produtos = await db
      .select('f.id AS fornecedorId', 'f.cnpj', 'u.nome', 'u.email', 'e.created_at')
      .from('usuarios AS u')
      .join('usuarios_fornecedores AS uf', 'u.id', 'uf.usuario_id')
      .join('fornecedores AS f', 'f.id', 'uf.fornecedor_id')
      .join(`produtos_ecommerce AS e`, 'e.fornecedor_id', 'f.id');

    return _.map(produtos, (produto) => ({
      fornecedorId: produto.fornecedorId,
      fornecedor: produto.nome,
      cnpj: produto.cnpj,
      email: produto.email,
      datahoraCadastro: produto.created_at,
    }));
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os produtos no ecommerce');
  } finally {
    db.destroy();
  }
}

export default {
  obterTodosAgrupados,
};
