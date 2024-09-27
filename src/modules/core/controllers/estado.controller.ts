import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import { Estado } from '../models/estado.model';
import estadoService from '../services/estado.service';

async function obterTodos(req: Request, res: Response<ResponseDTO<Estado[]>>, next: NextFunction) {
  try {
    const estados = await estadoService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: estados,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodos,
};
