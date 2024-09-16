import dotenv from 'dotenv';
dotenv.config();

const connection = {
  host: process.env.QUEUE_HOST,
  port: Number(process.env.QUEUE_PORT),
  maxRetriesPerRequest: null,
};

export default connection;
