import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {

  console.log(req.headers);


  next();
};
