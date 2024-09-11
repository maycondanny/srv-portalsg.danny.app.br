import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '../services/produto.service';
import ProdutoFornecedorRequest from '../dtos/produto-fornecedor-request.dto';
import ProdutoFornecedorResponse from '../dtos/produto-fornecedor-response.dto';
import CapaProdutoResponseDTO from '../dtos/capa-produto-response.dto';
import aprovacaoService from '../services/aprovacao.service';
import AprovacaoRequestDTO from '../dtos/aprovacao-request.dto';

// async function cadastrar(req: Request, res: Response, next: NextFunction) {
//   try {
//     await produtoService.cadastrar(req.body);
//     return res.status(httpStatusEnum.Status.CRIADO).json({ mensagem: 'Produto cadastrado com sucesso.' });
//   } catch (error) {
//     next(error);
//   }
// }

async function obterTodos(req: Request, res: Response<CapaProdutoResponseDTO[]>, next: NextFunction) {
  try {
    const produtos = await produtoService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json(produtos);
  } catch (error) {
    next(error);
  }
}

async function obterTodosPorFornecedor(req: Request<{}, {}, {}, ProdutoFornecedorRequest>, res: Response<ProdutoFornecedorResponse>, next: NextFunction) {
  try {
    const { fornecedorId, role } = req.query;
    const produtos = await produtoService.obterTodosPorFornecedor(fornecedorId, role);
    return res.status(httpStatusEnum.Status.SUCESSO).json(produtos);
  } catch (error) {
    next(error);
  }
}

async function aprovar(req: Request<{}, {}, AprovacaoRequestDTO>, res: Response, next: NextFunction) {
  try {
    await aprovacaoService.aprovar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: "Produto aprovado com sucesso"
    });
  } catch (error) {
    next(error);
  }
}

// async function obterPorId(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { id } = req.params;
//     const produto = await produtoService.obterPorId(Number(id));
//     return res.status(httpStatusEnum.Status.SUCESSO).json(produto);
//   } catch (error) {
//     next(error);
//   }
// }

export default {
  obterTodos,
  obterTodosPorFornecedor,
  aprovar
};
