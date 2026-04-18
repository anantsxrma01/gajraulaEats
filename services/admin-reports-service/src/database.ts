import { Sequelize } from 'sequelize';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/admin_reports';

export const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log('Admin Reports Service connected to the database');
}
