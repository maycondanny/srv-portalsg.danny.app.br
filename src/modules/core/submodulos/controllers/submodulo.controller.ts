import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import submoduloService from '../services/submodulo.service';
import SubModulo from '../models/submodulo.model';

async function obterTodos(req: Request, res: Response<ResponseDTO<SubModulo[]>>, next: NextFunction) {
  try {
    const submodulos = await submoduloService.obterTodos();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: submodulos,
    });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req: Request<{}, {}, SubModulo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await submoduloService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Submodulo cadastrado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req: Request<{}, {}, SubModulo>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    await submoduloService.atualizar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Submódulo atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function remover(req: Request<{ id: number }, {}, {}>, res: Response<ResponseDTO<void>>, next: NextFunction) {
  try {
    const { id } = req.params;
    await submoduloService.remover(id);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Submódulo removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function removerPorModuloId(
  req: Request<{ modulo_id: number }, {}, {}>,
  res: Response<ResponseDTO<void>>,
  next: NextFunction
) {
  try {
    const { modulo_id } = req.params;
    await submoduloService.removerPorModuloId(modulo_id);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Submódulo removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  cadastrar,
  obterTodos,
  removerPorModuloId,
  remover,
  atualizar,
};
