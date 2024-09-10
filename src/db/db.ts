import knex, { Knex } from 'knex';
import config from './knexfile';

const getDbInstance = (): Knex => {
  return knex(config);
};

export default getDbInstance;
