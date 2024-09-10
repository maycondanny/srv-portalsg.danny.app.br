import _ from 'lodash';

function isMaiorZero(valor: number) {
  if (_.isUndefined(valor) || _.isNull(valor)) return;
  return valor > 0;
}

function isMaiorOuIgualZero(valor: number) {
  if (_.isUndefined(valor) || _.isNull(valor)) return;
  return valor >= 0;
}

function isMenorOuIgualZero(valor: number) {
  if (_.isUndefined(valor) || _.isNull(valor)) return;
  return valor <= 0;
}

function isMenorZero(valor: number) {
  if (_.isUndefined(valor) || _.isNull(valor)) return;
  return valor < 0;
}

export default {
  isMaiorZero,
  isMaiorOuIgualZero,
  isMenorOuIgualZero,
  isMenorZero,
};
