import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import avisoService from '../services/aviso.service';
import Aviso from '../models/aviso.model';

async function obterTodos(req: Request, res: Response<ResponseDTO<Aviso[]>>, next: NextFunction) {
  try {
    const avisos = await avisoService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: avisos,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Aviso>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await avisoService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Aviso cadastrado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function obterAtivo(req: Request, res: Response<ResponseDTO<Aviso>>, next: NextFunction) {
  try {
    const ativo = await avisoService.obterAtivo();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: ativo,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  obterAtivo,
};
