import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '../services/produto.service';
import ResponseDTO from 'dtos/response.dto';
import { ProdutoDTO } from '../dtos/produto.dto';

async function cadastrar(req: Request, res: Response<ResponseDTO>, next: NextFunction) {
  try {
    await produtoService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({ mensagem: 'Produto cadastrado com sucesso.' });
  } catch (error) {
    next(error);
  }
}

async function obterTodos(req: Request, res: Response<ResponseDTO<ProdutoDTO[]>>, next: NextFunction) {
  try {
    const { fornecedor } = req.query;
    const produtos = await produtoService.obterTodosPorFornecedor(Number(fornecedor));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: produtos
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
      dados: produto
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request, res: Response<ResponseDTO>, next: NextFunction) {
  try {
    await produtoService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: "Produto atualizado com sucesso"
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  obterPorId,
  atualizar
};
