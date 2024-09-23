import produtoModel, { Produto } from '@modules/comercial/produtos/models/produto.model';
import produtoPortalService from '@services/hub/produto-portal.service';
import numberUtil from '@utils/number.util';
import _ from 'lodash';

async function obterTodas(produto: Produto) {
  if (numberUtil.isMenorOuIgualZero(produto.eans.length)) {
    throw new Error('Eans não encontrados.');
  }
  const codigos = produtoModel.obterCodigosEans(produto.eans);
  const divergencias = await produtoPortalService.obterTodosPorEans(codigos);
  return [divergencias ?? []];
}

export default {
  obterTodas,
};
