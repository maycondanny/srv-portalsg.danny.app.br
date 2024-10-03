import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Acesso from '../models/acesso.model';
import acessoService from '../services/acesso.service';

async function obterTodos(
  req: Request<{}, {}, {}, { ativo: boolean }>,
  res: Response<ResponseDTO<Acesso[]>>,
  next: NextFunction
) {
  try {
    const { ativo } = req.query;
    const acessos = await acessoService.obterTodos(Boolean(ativo));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: acessos,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Acesso>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await acessoService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Acesso criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, Acesso>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await acessoService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Acesso atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function ativar(req: Request<{}, {}, Acesso>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await acessoService.ativar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Acesso ativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function desativar(req: Request<{}, {}, Acesso>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await acessoService.desativar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Acesso desativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function obterTodosPorSetores(
  req: Request<{}, {}, { setores: number[] }>,
  res: Response<ResponseDTO<Acesso[]>>,
  next: NextFunction
) {
  try {
    const { setores } = req.body;
    const acessos = await acessoService.obterTodosPorSetores(setores);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: acessos,
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
