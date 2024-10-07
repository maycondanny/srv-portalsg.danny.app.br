import httpStatusEnum from '@enums/http-status.enum';
import jwtUtil from '@utils/jwt.util';
import ResponseDTO from 'dtos/response.dto';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export default function (req: Request, res: Response<ResponseDTO>, next: NextFunction) {
  try {
    const { authorization } = req.headers;

    const bearerToken = authorization.split(' ')[1];

    if (!bearerToken) {
      return res.status(httpStatusEnum.Status.RECUSADO).json({
        mensagem: 'Acesso não autorizado',
        statusCode: httpStatusEnum.Status.RECUSADO,
      });
    }

    const tokenValido = jwtUtil.validate({
      token: bearerToken,
      chave: process.env.CHAVE_TOKEN_JWT,
    });

    if (!tokenValido) {
      return res.status(httpStatusEnum.Status.RECUSADO).json({
        mensagem: 'Acesso não autorizado',
        statusCode: httpStatusEnum.Status.RECUSADO,
      });
    }

    next();
  } catch (erro) {
    return res.status(httpStatusEnum.Status.RECUSADO).json({
      mensagem: 'Acesso não autorizado',
      statusCode: httpStatusEnum.Status.NAO_AUTORIZADO,
    });
  }
}
