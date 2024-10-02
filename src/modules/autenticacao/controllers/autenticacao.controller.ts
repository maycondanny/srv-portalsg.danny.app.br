import httpStatusEnum from '@enums/http-status.enum';
import ResponseDTO from 'dtos/response.dto';
import { NextFunction, Request, Response } from 'express';
import LoginRequestDTO from '../dtos/login-request.dto';
import LoginResponseDTO from '../dtos/login-response.dto';
import RegistroRequestDTO from '../dtos/registro-request.dto';
import CarregaSessaoRequestDTO from '../dtos/carrega-sessao-request.dto';
import EmailRedefinicaoSenhaRequestDTO from '../dtos/email-redefinicao-senha-request.dto';
import RedefineSenhaRequestDTO from '../dtos/redefine-senha-request.dto';
import Usuario from '@modules/core/usuarios/models/usuario.model';
import autenticacaoService from '../services/autenticacao.service';
import ConfirmaCadastroRequestDTO from '../dtos/confirma-cadastro-request.dto';
import ConfirmaCadastroResponseDTO from '../dtos/confirma-cadastro-response.dto';
import encryptacaoUtil from '@utils/encryptacao.util';

async function login(
  req: Request<{}, {}, LoginRequestDTO, {}>,
  res: Response<ResponseDTO<LoginResponseDTO>>,
  next: NextFunction
) {

  console.log(encryptacaoUtil.encriptar("123mudar"));

  try {
    const { token, tokenHub } = await autenticacaoService.login(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Login realizado com sucesso',
      dados: {
        token,
        tokenHub,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function registrar(
  req: Request<{}, {}, RegistroRequestDTO, {}>,
  res: Response<ResponseDTO<void>>,
  next: NextFunction
) {
  try {
    await autenticacaoService.registrar(req.body);
    return res.status(httpStatusEnum.Status.CRIADO).json({
      mensagem: 'Conta registrada com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function redefinirSenha(
  req: Request<{}, {}, RedefineSenhaRequestDTO, {}>,
  res: Response<ResponseDTO<void>>,
  next: NextFunction
) {
  try {
    await autenticacaoService.redefinirSenha(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    next(error);
  }
}

async function carregarSessao(
  req: Request<{}, {}, CarregaSessaoRequestDTO, {}>,
  res: Response<ResponseDTO<Usuario>>,
  next: NextFunction
) {
  try {
    const usuario = await autenticacaoService.carregarSessao(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      dados: usuario,
    });
  } catch (error) {
    next(error);
  }
}

async function enviarEmailRedefinicaoSenha(
  req: Request<{}, {}, EmailRedefinicaoSenhaRequestDTO, {}>,
  res: Response<ResponseDTO<void>>,
  next: NextFunction
) {
  try {
    await autenticacaoService.enviarEmailRedefinicaoSenha(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Email de redefinição de senha enviado com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

async function confirmarCadastro(
  req: Request<{}, {}, ConfirmaCadastroRequestDTO, {}>,
  res: Response<ResponseDTO<ConfirmaCadastroResponseDTO>>,
  next: NextFunction
) {
  try {
    const retorno = await autenticacaoService.confirmarCadastro(req.body);
    return res.status(httpStatusEnum.Status.SUCESSO).json({
      mensagem: 'Cadastro confirmado com sucesso',
      dados: retorno
    });
  } catch (error) {
    next(error);
  }
}

export default {
  registrar,
  login,
  carregarSessao,
  enviarEmailRedefinicaoSenha,
  redefinirSenha,
  confirmarCadastro
};
