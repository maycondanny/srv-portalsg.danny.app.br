import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Familia from '../models/familia.model';
import familiaService from '../services/familia.service';

async function cadastrar(req: Request<{}, {}, { nome: string }>, res: Response<ResponseDTO<Familia>>, next: NextFunction) {
  try {
    const { nome } = req.body;
    const familia = await familiaService.cadastrar(nome);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Familia criada com sucesso',
      dados: familia
    });
  } catch (error) {
    next(error);
  }
}

async function obterPorId(req: Request<{ id: number }>, res: Response<ResponseDTO<Familia>>, next: NextFunction) {
  try {
    const { id } = req.params;
    const familia = await familiaService.obter(Number(id));
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: familia,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterPorId,
  cadastrar,
};
