import { NextFunction, Request, Response } from 'express';
import importacaoService from '../services/importacao.service';
import _ from 'lodash';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';

const importar = async (req: Request, res: Response<ResponseDTO>, next: NextFunction) => {
  try {
    await importacaoService.importar({
      planilha: req.file,
      fornecedorId: Number(req.body.fornecedorId),
    });
    return res.status(httpStatusEnum.Status.SUCESSO).json({ mensagem: 'Produtos importados com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export default {
  importar,
};
