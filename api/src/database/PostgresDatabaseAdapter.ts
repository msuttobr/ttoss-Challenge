import { Client } from 'pg';
import { CustomError } from '../utils/customError';
import { IDatabaseClient } from './interface/IDatabaseClient';

export class PostgresDatabaseAdapter implements IDatabaseClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      throw new CustomError(`Erro ao conectar ao PostgreSQL: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.end();
    } catch (error) {
      throw new CustomError(`Erro ao desconectar do PostgreSQL: ${error}`);
    }
  }

  async query<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const res = await this.client.query(query, params);
      return res.rows as T[];
    } catch (error) {
      throw new CustomError(`Erro ao executar consulta: ${error}`);
    }
  }
}