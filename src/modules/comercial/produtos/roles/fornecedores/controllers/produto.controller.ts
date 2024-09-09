import { NextFunction, Request, Response } from 'express';
import importacaoService from '../services/importacao.service';
import _ from 'lodash';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '../services/produto.service';

const cadastrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await produtoService.cadastrar(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({ mensagem: 'Produto cadastrado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export default {
  cadastrar,
};
