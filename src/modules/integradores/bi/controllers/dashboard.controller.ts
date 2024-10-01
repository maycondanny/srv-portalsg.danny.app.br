import { NextFunction, Request, Response } from 'express';
import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import DashboardRequestDTO from '../dtos/dashboard-request.dto';
import dashboardService from '../services/dashboard.service';

function obterUrl(
  req: Request<{}, {}, {}, DashboardRequestDTO>,
  res: Response<ResponseDTO<string>>,
  next: NextFunction
) {
  try {
    const { id } = req.query;
    const url = dashboardService.obterUrl(id);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: url,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  obterUrl,
};
