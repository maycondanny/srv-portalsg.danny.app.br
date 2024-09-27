import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import compradorService from '../services/comprador.service';
import Comprador from '../models/comprador.model';

async function obterTodos(req: Request, res: Response<ResponseDTO<Comprador[]>>, next: NextFunction) {
  try {
    const compradores = await compradorService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: compradores,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodos,
};
