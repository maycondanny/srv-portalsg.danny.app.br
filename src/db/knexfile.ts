import path from 'path';
import { types } from 'pg';

types.setTypeParser(types.builtins.INT4, (val) => parseInt(val, 10));
types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));
types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));
types.setTypeParser(types.builtins.BOOL, (val) => val === 't');

export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
    propagateCreateError: false,
  },
  migrations: {
    directory: path.join(__dirname, './migrations'),
  },
  seeds: {
    directory: path.join(__dirname, './seeds'),
  },
};
