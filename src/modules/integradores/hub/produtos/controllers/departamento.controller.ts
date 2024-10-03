import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import departamentoService from '../services/departamento.service';
import Departamento from '../models/departamento.model';

async function obterTodos(req: Request, res: Response<ResponseDTO<Departamento[]>>, next: NextFunction) {
  try {
    const departamentos = await departamentoService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: departamentos,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodos,
};
