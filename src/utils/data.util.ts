function obterHorarioBrasilia(data: string): Date {
  const offset = -3;
  const date = new Date(data);
  return new Date(date.getTime() + offset * 60 * 60 * 1000);
}

export default {
  obterHorarioBrasilia,
};
