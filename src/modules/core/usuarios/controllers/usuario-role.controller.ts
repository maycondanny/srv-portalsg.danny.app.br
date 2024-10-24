import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import usuarioRoleService from '../services/usuario-role.service';
import UsuarioRole from '../models/usuario-role.model';

async function obterTodos(req: Request, res: Response<ResponseDTO<UsuarioRole[]>>, next: NextFunction) {
  try {
    const roles = await usuarioRoleService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: roles,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, UsuarioRole>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await usuarioRoleService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Função cadastrada com sucesso',
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
    await usuarioRoleService.remover(id);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Função removida com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, UsuarioRole>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await usuarioRoleService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Função atualizada com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  atualizar,
  remover,
  obterTodos,
};
