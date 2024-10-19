import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Usuario from '../models/usuario.model';
import usuarioService from '../services/usuario.service';

async function obterTodos(req: Request, res: Response<ResponseDTO<Usuario[]>>, next: NextFunction) {
  try {
    const usuarios = await usuarioService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: usuarios,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, Usuario>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await usuarioService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Usuário criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, Usuario>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await usuarioService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Usuário atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function trocarSenhaPrimeiroAcesso(
  req: Request<{}, {}, { senha: string }, { id: number }>,
  res: Response<ResponseDTO<void>>,
  next: NextFunction
) {
  try {
    const { id } = req.query;
    const { senha } = req.body;
    await usuarioService.trocarSenhaPrimeiroAcesso({ id, senha });
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Senha alterada com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function obterTodosOnline(req: Request, res: Response<ResponseDTO<Usuario[]>>, next: NextFunction) {
  try {
    const usuarios = await usuarioService.obterTodosOnline();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: usuarios,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  atualizar,
  trocarSenhaPrimeiroAcesso,
  obterTodosOnline,
};
