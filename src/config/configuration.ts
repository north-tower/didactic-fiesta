// src/config/configuration.ts
export default () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME || 'mhki',
    password: process.env.DATABASE_PASSWORD || '12345678',
    database: process.env.DATABASE_NAME || 'shopeazz_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  security: {
    bcryptSaltRounds: 10,
    refreshTokenTTL: 60 * 60 * 24 * 7, // 7 days
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  app: {
    url: process.env.APP_URL,
  },
});
