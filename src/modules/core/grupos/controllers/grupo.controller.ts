import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import grupoService from '../services/grupo.service';
import Grupo from '../models/grupo.model';

async function obterTodos(
  req: Request<{}, {}, {}, { ativo: boolean }>,
  res: Response<ResponseDTO<Grupo[]>>,
  next: NextFunction
) {
  try {
    const { ativo } = req.query;
    const grupos = await grupoService.obterTodos(Boolean(ativo));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: grupos,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Grupo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await grupoService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Grupo criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, Grupo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await grupoService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Grupo atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function ativar(req: Request<{}, {}, Grupo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await grupoService.ativar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Grupo ativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function desativar(req: Request<{}, {}, Grupo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await grupoService.desativar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Grupo desativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function obterTodosPorSetores(
  req: Request<{}, {}, { setores: number[] }>,
  res: Response<ResponseDTO<Grupo[]>>,
  next: NextFunction
) {
  try {
    const { setores } = req.body;
    const grupos = await grupoService.obterPorSetores(setores);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: grupos,
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
  desativar,
  obterTodosPorSetores,
};
