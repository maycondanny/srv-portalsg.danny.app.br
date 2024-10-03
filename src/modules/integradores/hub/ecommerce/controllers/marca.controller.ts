import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Marca from '../models/marca.model';
import marcaService from '../services/marca.service';

async function obterTodas(req: Request, res: Response<ResponseDTO<Marca[]>>, next: NextFunction) {
  try {
    const marcas = await marcaService.obterTodas();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: marcas,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodas,
};
