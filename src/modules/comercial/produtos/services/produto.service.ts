import _ from "lodash";
import { Produto } from "../models/produto.model";
import produtoRepository from "../repositories/produto.repository";
import eanService from "./ean.service";

async function cadastrar(produto: Produto) {
  const eans = produto.eans;
  const produtoTratado = _.omit(produto, "eans");
  const produtoId = await produtoRepository.cadastrar(produtoTratado);
  await eanService.cadastrarEmlote(produtoId, eans);
};

export default {
  cadastrar,
};
