import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import iconeService from '../services/icone.service';
import Icone from '../models/icone.model';

async function obterTodos(req: Request, res: Response<ResponseDTO<Icone[]>>, next: NextFunction) {
  try {
    const icones = await iconeService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: icones,
    });
  } catch (error) {
    next(error);
  }
}

async function obterPorId(req: Request<{}, {}, {}, { id: number }>, res: Response<ResponseDTO<Icone>>, next: NextFunction) {
  try {
    const { id } = req.query;
    const icone = await iconeService.obterPorId(id);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: icone,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Icone>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await iconeService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Icone criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  obterPorId
};
