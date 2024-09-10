function cortar(valor: string, tamanho: number) {
  if (!valor) return valor;
  return valor.trim().substring(0, tamanho);
}

function removerEspacosLaterais(valor: string) {
  if (!valor) return valor;
  return valor.trim();
}

function isMaior(valor: string, tamanho: number) {
  if (!valor) return;
  return valor.length > tamanho;
}

export default {
  cortar,
  removerEspacosLaterais,
  isMaior,
};
