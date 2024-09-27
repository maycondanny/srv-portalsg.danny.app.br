import { Divergencia } from '@modules/comercial/ecommerce/models/divergencia.model';
import produtosServiceHub from '@modules/integradores/hub/ecommerce/services/produtos.service';
import objectUtil from '@utils/object.util';
import _ from 'lodash';

async function obterTodas(produtoId: number): Promise<Divergencia[]> {
  const divergencia = await produtosServiceHub.obterTodos(produtoId);
  return divergencia ? [tratarDivergencia(divergencia)] : [];
}

function tratarDivergencia(dados: any): Divergencia {
  return {
    produto_id: objectUtil.isCamposExiste(dados, ['produto_id']) ? Number(dados.produto_id) : dados.produto_id,
    nome: dados.nome,
    depto: objectUtil.isCamposExiste(dados, ['depto']) ? Number(dados.depto) : dados.depto,
    marca: objectUtil.isCamposExiste(dados, ['marca']) ? Number(dados.marca) : dados.marca,
    secao: objectUtil.isCamposExiste(dados, ['secao']) ? Number(dados.secao) : dados.secao,
    destaque: dados.destaque,
    modo_uso: dados.modo_uso,
    lancamento: dados.lancamento,
    descricao: dados.descricao,
    caracteristica: dados.caracteristica,
    ativo: dados.ativo,
    imagens: dados.imagens,
    datahora_cadastro: dados.datahora_cadastro,
    datahora_alteracao: dados.datahora_alteracao,
  };
}

export default {
  obterTodas,
};
