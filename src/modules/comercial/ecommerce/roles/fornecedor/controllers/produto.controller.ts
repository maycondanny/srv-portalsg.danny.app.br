import ResponseDTO from 'dtos/response.dto';
import { NextFunction, Request, Response } from 'express';
import produtoService from '../services/produto.service';
import ProdutoDTO from '../dtos/produto.dto';
import httpStatusEnum from '@enums/http-status.enum';

async function cadastrar(req: Request<{}, {}, ProdutoDTO>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    const produto = req.body;
    await produtoService.cadastrar(produto);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Produto criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function obterTodos(req: Request, res: Response<ResponseDTO<ProdutoDTO[]>>, next: NextFunction) {
  try {
    const { fornecedor } = req.query;
    const produtos = await produtoService.obterTodos(Number(fornecedor));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: produtos,
    });
  } catch (error) {
    next(error);
  }
}

async function obterPorId(req: Request, res: Response<ResponseDTO<ProdutoDTO>>, next: NextFunction) {
  try {
    const { id } = req.params;
    const produto = await produtoService.obterPorId(Number(id));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: produto,
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, ProdutoDTO>, res: Response<ResponseDTO>, next: NextFunction) {
  try {
    const produto = req.body;
    await produtoService.atualizar(produto);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Produto atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  obterPorId,
  atualizar,
};
