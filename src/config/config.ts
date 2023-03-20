import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/books',
  JWT_SECRET: process.env.JWT_SECRET,
};