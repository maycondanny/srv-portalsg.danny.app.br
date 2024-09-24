import { NextFunction, Request, Response } from "express";
import marcaService from "../services/marca.service";
import httpStatusEnum from "@enums/http-status.enum";
import Marca from "../models/marca.model";
import ResponseDTO from "dtos/response.dto";

async function obterTodas(req: Request, res: Response<ResponseDTO<Marca[]>>, next: NextFunction) {
  try {
    const marcas = await marcaService.obterTodas();
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: marcas
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterTodas
}
