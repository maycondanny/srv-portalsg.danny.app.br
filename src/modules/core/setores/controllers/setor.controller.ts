import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Setor from '../models/setor.model';
import setorService from '../services/setor.service';

async function obterTodos(
  req: Request<{}, {}, {}, { ativo: boolean }>,
  res: Response<ResponseDTO<Setor[]>>,
  next: NextFunction
) {
  try {
    const { ativo } = req.query;
    const setores = await setorService.obterTodos(Boolean(ativo));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: setores,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Setor>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await setorService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Setor criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, Setor>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await setorService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Setor atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function ativar(req: Request<{}, {}, Setor>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await setorService.ativar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Setor ativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function desativar(req: Request<{}, {}, Setor>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await setorService.desativar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Setor desativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  atualizar,
  ativar,
  desativar
};
