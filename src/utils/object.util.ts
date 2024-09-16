import _ from "lodash";

function isVazio(valor: Object): boolean {
  return _.size(valor) === 0;
}

function isCamposExiste(obj: Object, campos: string[]): boolean {
  return _.every(campos, campo => _.has(obj, campo) && (obj[campo] !== undefined));
}

export default {
  isVazio,
  isCamposExiste
}

