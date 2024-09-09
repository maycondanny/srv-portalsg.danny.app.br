const paraNumerico = (valor: string) => {
  if (!valor) return;
  return Number(valor.trim()) ?? 0;
};

function paraDecimal(valor: string): number {
  if (!valor) return;
  return (
    paraNumerico(
      valor
        .trim()
        .replace(/[^0-9.,]/g, '')
        .replace(',', '.')
    ) ?? 0
  );
}

export default {
  paraNumerico,
  paraDecimal,
};
