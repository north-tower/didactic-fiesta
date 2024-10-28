// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { Company } from '../modules/companies/entities/company.entity';
import { User } from '../modules/users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345678',
  database: 'shopeazz_db',
  synchronize: false,
  logging: true,
  entities: [Company, User],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
