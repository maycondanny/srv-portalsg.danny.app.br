import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Categoria from '../models/categoria.model';
import produtoService from '../services/produto.service';

async function obterTodos(req: Request, res: Response<ResponseDTO<Categoria[]>>, next: NextFunction) {
  try {
    const { produtoId } = req.query;
    const produtos = await produtoService.obterTodos(Number(produtoId));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: produtos,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodos,
};
