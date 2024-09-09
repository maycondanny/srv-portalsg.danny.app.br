import knex, { Knex } from 'knex';
import knexConfig from './knexfile';

const getDbInstance = (): Knex => {
  return knex(knexConfig);
};

export default getDbInstance;
