import knex, { Knex } from 'knex';
import knexConfig from './knexfile';

let dbInstance: Knex | null = null;

const getDbInstance = (): Knex => {
  if (!dbInstance) {
    dbInstance = knex(knexConfig);
  }
  return dbInstance;
};

export default getDbInstance;