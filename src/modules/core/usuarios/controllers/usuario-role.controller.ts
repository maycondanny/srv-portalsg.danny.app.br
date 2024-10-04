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

export default {
  obterTodos,
};
