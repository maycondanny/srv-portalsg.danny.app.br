import { Request, Response } from "express";
import importacaoService from "../services/importacao.service";
import formidable from "formidable";

const importar = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao analisar o formulário." });
      }

      const arquivo = files.arquivo && Array.isArray(files.arquivo) ? files.arquivo[0] : undefined;
      const usuarioId = Array.isArray(fields.usuarioId) ? fields.usuarioId[0] || null : null;

      if (!arquivo) {
        return res.status(400).json({
          message: "Nenhum arquivo enviado.",
        });
      }

      if (!usuarioId) {
        return res.status(400).json({
          message: "Usuário não encontrado.",
        });
      }

      await importacaoService.importar({
        arquivo,
        usuarioId,
      });

      res.status(200).json({
        message: "ok",
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao realizar a importação dos produtos.", error });
  }
};

export default {
  importar,
};
