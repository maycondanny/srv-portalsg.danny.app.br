import ResponseDTO from 'dtos/response.dto';
import { NextFunction, Request, Response } from 'express';
import importacaoService from '../services/importacao.service';
import httpStatusEnum from '@enums/http-status.enum';

async function importar(req: Request, res: Response<ResponseDTO>, next: NextFunction) {
  try {
    const { fornecedorId } = req.body;

    await importacaoService.importar({
      planilha: req.file,
      fornecedorId: Number(fornecedorId),
    });
    return res.status(httpStatusEnum.Status.SUCESSO).json({ mensagem: 'Produtos importados com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export default {
  importar,
};
