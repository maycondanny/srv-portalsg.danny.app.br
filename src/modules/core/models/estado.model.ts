export interface Estado {
  id: number;
  sigla: string;
}

export enum ESiglaEstado {
  'AC' = 1,
  'AL' = 2,
  'AP' = 3,
  'AM' = 4,
  'BA' = 5,
  'CE' = 6,
  'DF' = 7,
  'ES' = 8,
  'GO' = 9,
  'MA' = 10,
  'MT' = 11,
  'MS' = 12,
  'MG' = 13,
  'PA' = 14,
  'PB' = 15,
  'PR' = 16,
  'PE' = 17,
  'PI' = 18,
  'RJ' = 19,
  'RN' = 20,
  'RS' = 21,
  'RO' = 22,
  'RR' = 23,
  'SC' = 24,
  'SP' = 25,
  'SE' = 26,
  'TO' = 27,
}

const obterNome = (estado: number) => {
  const siglas = {
    1: 'AC',
    2: 'AL',
    3: 'AP',
    4: 'AM',
    5: 'BA',
    6: 'CE',
    7: 'DF',
    8: 'ES',
    9: 'GO',
    10: 'MA',
    11: 'MT',
    12: 'MS',
    13: 'MG',
    14: 'PA',
    15: 'PB',
    16: 'PR',
    17: 'PE',
    18: 'PI',
    19: 'RJ',
    20: 'RN',
    21: 'RS',
    22: 'RO',
    23: 'RR',
    24: 'SC',
    25: 'SP',
    26: 'SE',
    27: 'TO',
  };
  return siglas[estado];
};

export default {
  obterNome,
};
