import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '../services/produto.service';
import ProdutoFornecedorRequest from '../dtos/produto-fornecedor-request.dto';
import ProdutoFornecedorResponse from '../dtos/produto-fornecedor-response.dto';
import CapaProdutoResponseDTO from '../dtos/capa-produto-response.dto';
import aprovacaoService from '../services/aprovacao.service';
import AprovacaoRequestDTO from '../dtos/aprovacao-request.dto';
import AprovacaoResponseDTO from '../dtos/aprovacao-response.dto';
import ResponseDTO from 'dtos/response.dto';

async function obterTodos(req: Request, res: Response<ResponseDTO<CapaProdutoResponseDTO[]>>, next: NextFunction) {
  try {
    const produtos = await produtoService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: produtos,
    });
  } catch (error) {
    next(error);
  }
}

async function obterTodosPorFornecedor(
  req: Request<{}, {}, {}, ProdutoFornecedorRequest>,
  res: Response<ResponseDTO<ProdutoFornecedorResponse>>,
  next: NextFunction
) {
  try {
    const { fornecedorId, role } = req.query;
    const produtos = await produtoService.obterTodosPorFornecedor(fornecedorId, role);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: produtos,
    });
  } catch (error) {
    next(error);
  }
}

async function aprovar(
  req: Request<{}, {}, AprovacaoRequestDTO>,
  res: Response<ResponseDTO<AprovacaoResponseDTO>>,
  next: NextFunction
) {
  try {
    const { produtoId } = await aprovacaoService.aprovar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Produto aprovado com sucesso',
      dados: {
        produtoId,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request, res: Response<ResponseDTO>, next: NextFunction) {
  try {
    const { role, produto } = req.body;
    await produtoService.atualizar(role, produto);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Produto atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodos,
  obterTodosPorFornecedor,
  aprovar,
  atualizar,
};
