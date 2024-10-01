import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import Fornecedor from '../models/fornecedor.model';
import fornecedorService from '../services/fornecedor.service';
import FornecedorPorCnpjDTO from '../dtos/fornecedor-por-cnpj.dto';

async function obterPorCnpj(
  req: Request<{}, {}, {}, FornecedorPorCnpjDTO>,
  res: Response<ResponseDTO<Fornecedor>>,
  next: NextFunction
) {
  try {
    const { cnpj } = req.query;
    const fornecedor = await fornecedorService.obterPorCnpj(cnpj);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: fornecedor,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterPorCnpj,
};
