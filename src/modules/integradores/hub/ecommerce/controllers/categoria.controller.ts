import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Categoria from '../models/categoria.model';
import categoriaService from '../services/categoria.service';

async function obterTodas(req: Request, res: Response<ResponseDTO<Categoria[]>>, next: NextFunction) {
  try {
    const categorias = await categoriaService.obterTodas();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: categorias,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodas,
};
