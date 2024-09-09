import dotenv from 'dotenv';
dotenv.config();

const connection = {
  host: process.env.CACHE_HOST,
  port: Number(process.env.CACHE_PORT),
  maxRetriesPerRequest: null,
};

export default connection;
