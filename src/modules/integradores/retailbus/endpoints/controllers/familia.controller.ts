import { NextFunction, Request, Response } from "express";
import httpStatusEnum from "@enums/http-status.enum";
import ResponseDTO from "dtos/response.dto";
import Familia from "../models/familia.model";
import familiaService from "../services/familia.service";

async function obterTodas(req: Request, res: Response<ResponseDTO<Familia[]>>, next: NextFunction) {
  try {
    const { descricao } = req.query;
    const familias = await familiaService.obterTodas(descricao.toString());
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: familias
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodas
}
