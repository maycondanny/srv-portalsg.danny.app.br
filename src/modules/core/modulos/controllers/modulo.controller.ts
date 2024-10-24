import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Modulo from '../models/modulo.model';
import moduloService from '../services/modulo.service';

async function obterTodos(req: Request, res: Response<ResponseDTO<Modulo[]>>, next: NextFunction) {
  try {
    const modulos = await moduloService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: modulos,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Modulo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await moduloService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Módulo cadastrado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function remover(
  req: Request<{ id: number }, {}, {}>,
  res: Response<ResponseDTO<void>>,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await moduloService.remover(id);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Módulo removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, Modulo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await moduloService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Módulo atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function obterPorIds(req: Request<{}, {}, { ids: number[] }>, res: Response<ResponseDTO<Modulo[]>>, next: NextFunction) {
  try {
    const { ids } = req.body;
    const modulos = await moduloService.obterPorIds(ids);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: modulos,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  remover,
  atualizar,
  obterPorIds
};
